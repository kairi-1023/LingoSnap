import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const STORAGE_VERSION_KEY = '@TogetherLingo:storage_version';
const APP_VERSION_KEY = '@TogetherLingo:app_version';

// Increment this when a breaking change is made to any persisted data format
export const CURRENT_STORAGE_VERSION = 1;

export interface StorageVersionInfo {
  storageVersion: number;
  lastAppVersion: string | null;
  currentAppVersion: string;
}

// Get the app version from app.json / expo-constants
function getAppVersion(): string {
  try {
    return Constants.expoConfig?.version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

// Check if the app has been freshly installed (no prior version record)
export async function isFreshInstall(): Promise<boolean> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_VERSION_KEY);
    return stored === null;
  } catch {
    return true;
  }
}

// Get current storage version info
export async function getStorageVersionInfo(): Promise<StorageVersionInfo> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_VERSION_KEY);
    const storedVersion = raw ? parseInt(raw, 10) : 0;
    const lastAppVersion = await AsyncStorage.getItem(APP_VERSION_KEY);
    return {
      storageVersion: Number.isFinite(storedVersion) ? storedVersion : 0,
      lastAppVersion,
      currentAppVersion: getAppVersion(),
    };
  } catch {
    return { storageVersion: 0, lastAppVersion: null, currentAppVersion: getAppVersion() };
  }
}

// Persist the current storage version after migration completes
export async function persistStorageVersion(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_VERSION_KEY, String(CURRENT_STORAGE_VERSION));
    await AsyncStorage.setItem(APP_VERSION_KEY, getAppVersion());
  } catch (err) {
    console.warn('[StorageVersion] Failed to persist version:', err);
  }
}

// Clear storage version info (used during sign-out)
export async function clearStorageVersion(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([STORAGE_VERSION_KEY, APP_VERSION_KEY]);
  } catch {
    // ignore
  }
}
