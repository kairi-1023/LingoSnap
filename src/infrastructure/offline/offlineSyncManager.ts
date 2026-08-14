import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase/client';

const OFFLINE_QUEUE_KEY = '@LingoSnap:offline_study_queue';
const MAX_RETRIES = 20;
const MIN_RETRY_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes between retry attempts

export function getLocalDateString(date?: Date): string {
  const target = date || new Date();
  try {
    const formatter = new Intl.DateTimeFormat(undefined, {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(target);
    const year = parts.find((p) => p.type === 'year')!.value;
    const month = parts.find((p) => p.type === 'month')!.value;
    const day = parts.find((p) => p.type === 'day')!.value;
    return `${year}-${month}-${day}`;
  } catch {
    return target.toISOString().split('T')[0];
  }
}

function generateStableId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

// Current queue item format version
// Increment when the OfflineStudySession structure changes
const QUEUE_ITEM_VERSION = 1;

export interface OfflineStudySession {
  id: string;
  userId: string;
  localDate: string;
  conceptIds: string[];
  xpGained: number;
  createdAt: string;
  retryCount?: number;
  lastRetryAt?: number;
  version?: number;
}

type SyncStatus = 'idle' | 'running';

export class OfflineSyncManager {
  private static syncStatus: SyncStatus = 'idle';
  private static statusListeners: Array<(status: SyncStatus) => void> = [];

  static registerStatusListener(listener: (status: SyncStatus) => void): () => void {
    this.statusListeners.push(listener);
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  private static notifyStatus(status: SyncStatus): void {
    this.syncStatus = status;
    this.statusListeners.forEach((l) => l(status));
  }

  static get isProcessing(): boolean {
    return this.syncStatus === 'running';
  }

  static async enqueueSession(session: Omit<OfflineStudySession, 'id' | 'createdAt'>): Promise<void> {
    try {
      const queue = await this.getQueue();

      const sessionConceptKey = [...session.conceptIds].sort().join(',');
      const duplicate = queue.some(
        (s) =>
          s.userId === session.userId &&
          s.localDate === session.localDate &&
          [...s.conceptIds].sort().join(',') === sessionConceptKey &&
          s.xpGained === session.xpGained
      );
      if (duplicate) {
        return;
      }

      const newSession: OfflineStudySession = {
        ...session,
        id: generateStableId(),
        createdAt: new Date().toISOString(),
        version: QUEUE_ITEM_VERSION,
      };
      queue.push(newSession);
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    } catch (err) {
      console.warn('[OfflineSyncManager] Failed to enqueue session:', err);
    }
  }

  static async getQueue(): Promise<OfflineStudySession[]> {
    try {
      const raw = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        console.warn('[OfflineSyncManager] Queue data is not an array, resetting');
        return [];
      } catch (parseErr) {
        console.warn('[OfflineSyncManager] Queue data corrupted, resetting:', parseErr);
        await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY).catch(() => {});
        return [];
      }
    } catch (err) {
      console.warn('[OfflineSyncManager] Failed to get queue:', err);
      return [];
    }
  }

  static async getQueueSize(): Promise<number> {
    try {
      const queue = await this.getQueue();
      return queue.length;
    } catch {
      return 0;
    }
  }

  static async processQueue(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.notifyStatus('running');

    try {
      const queue = await this.getQueue();
      if (queue.length === 0) {
        this.notifyStatus('idle');
        return;
      }

      const initialLength = queue.length;
      let processedCount = 0;
      let iterationCount = 0;
      const MAX_ITERATIONS = 200;

      while (queue.length > 0 && processedCount < initialLength && iterationCount < MAX_ITERATIONS) {
        iterationCount++;
        processedCount++;
        const session = queue[0];
        const itemVersion = session.version || 1;
        if (itemVersion > QUEUE_ITEM_VERSION) {
          console.warn('[OfflineSyncManager] Session has unknown future version, postponing:', session.id, 'version:', itemVersion);
          break;
        }

        const currentRetry = session.retryCount || 0;
        const now = Date.now();
        const timeSinceLastRetry = session.lastRetryAt ? now - session.lastRetryAt : Infinity;

        if (currentRetry >= MAX_RETRIES) {
          console.error('[OfflineSyncManager] Session exceeded max retries, discarding:', session.id, 'retries:', currentRetry);
          queue.shift();
          await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
          continue;
        }

        if (timeSinceLastRetry < MIN_RETRY_INTERVAL_MS) {
          const skippedSession = { ...session, lastRetryAt: now };
          queue.shift();
          queue.push(skippedSession);
          await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
          continue;
        }

        try {
          const { error } = await supabase.rpc('sync_offline_study_session' as any, {
            p_user_id: session.userId,
            p_local_date: session.localDate || getLocalDateString(),
            p_concept_ids: session.conceptIds || [],
            p_xp_gained: session.xpGained || 100,
          });
          if (error) throw error;

          queue.shift();
          await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
        } catch (err) {
          console.warn('[OfflineSyncManager] Session sync postponed:', session.id, 'retry:', currentRetry + 1, err);
          const updatedSession = { ...session, retryCount: currentRetry + 1, lastRetryAt: now };
          queue.shift();
          queue.push(updatedSession);
          await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
          continue;
        }
      }
    } catch (err) {
      console.warn('[OfflineSyncManager] processQueue exception:', err);
    } finally {
      this.notifyStatus('idle');
    }
  }
}
