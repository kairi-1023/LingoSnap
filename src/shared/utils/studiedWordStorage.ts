import AsyncStorage from '@react-native-async-storage/async-storage';
import { WordEntity } from '../../domain/entities/Word';

const STORAGE_KEY_PREFIX = '@lingosnap_studied_words_';

export async function saveStudiedWordToLocal(userId: string = 'guest_user', word: WordEntity): Promise<void> {
  if (!word || !word.id) return;
  try {
    const keysToSave = [
      `${STORAGE_KEY_PREFIX}${userId}`,
      `${STORAGE_KEY_PREFIX}global`,
    ];

    for (const key of keysToSave) {
      const existingRaw = await AsyncStorage.getItem(key);
      let existingList: WordEntity[] = existingRaw ? JSON.parse(existingRaw) : [];

      const wordKey = (word.wordTarget || word.id).trim().toLowerCase();
      const filtered = existingList.filter(
        (w) => w.id !== word.id && (!w.wordTarget || w.wordTarget.trim().toLowerCase() !== wordKey)
      );

      const newList = [
        { ...word, isReview: true, createdAt: new Date().toISOString() },
        ...filtered,
      ];

      await AsyncStorage.setItem(key, JSON.stringify(newList));
    }
  } catch (err) {
    console.warn('[studiedWordStorage] Failed to save studied word:', err);
  }
}

export async function getStudiedWordsFromLocal(userId: string = 'guest_user'): Promise<WordEntity[]> {
  try {
    const keysToFetch = [
      `${STORAGE_KEY_PREFIX}${userId}`,
      `${STORAGE_KEY_PREFIX}guest_user`,
      `${STORAGE_KEY_PREFIX}guest`,
      `${STORAGE_KEY_PREFIX}global`,
    ];

    const allItems: WordEntity[] = [];
    const seenMap = new Set<string>();

    for (const key of keysToFetch) {
      const raw = await AsyncStorage.getItem(key);
      if (raw) {
        const list: WordEntity[] = JSON.parse(raw);
        for (const item of list) {
          const itemKey = (item.wordTarget || item.id || '').trim().toLowerCase();
          if (itemKey && !seenMap.has(itemKey)) {
            seenMap.add(itemKey);
            allItems.push(item);
          }
        }
      }
    }

    return allItems;
  } catch (err) {
    console.warn('[studiedWordStorage] Failed to get studied words:', err);
    return [];
  }
}
