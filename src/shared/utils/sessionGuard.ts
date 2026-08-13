import { useAuthStore } from '../stores/useAuthStore';

/**
 * Higher-order async wrapper that guards database calls against session race conditions.
 * Prevents executing or returning data if the current active session has changed mid-execution.
 */
export async function withSessionGuard<T>(
  asyncFn: () => Promise<T>,
  fallbackValue: T
): Promise<T> {
  const initialSessionId = useAuthStore.getState().sessionId;
  try {
    const result = await asyncFn();
    const currentSessionId = useAuthStore.getState().sessionId;
    if (initialSessionId !== currentSessionId) {
      return fallbackValue;
    }
    return result;
  } catch (error) {
    console.error('[SessionGuard] Operation failed:', error);
    return fallbackValue;
  }
}
