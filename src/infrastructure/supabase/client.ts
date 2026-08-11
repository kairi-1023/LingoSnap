import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Database } from '../../types/database.types';

class ExpoSecureStoreAdapter {
  async getItem(key: string): Promise<string | null> {
    try {
      const val = await SecureStore.getItemAsync(key);
      if (val) return val;

      const legacyVal = await AsyncStorage.getItem(key);
      if (legacyVal) {
        console.log('[SecureStore] Migrating legacy token for key:', key);
        await SecureStore.setItemAsync(key, legacyVal);
        await AsyncStorage.removeItem(key).catch(() => {});
        return legacyVal;
      }
      return null;
    } catch (err) {
      console.warn('[SecureStore] Failed to get item:', err);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.warn('[SecureStore] Failed to set item:', err);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
      await AsyncStorage.removeItem(key).catch(() => {});
    } catch (err) {
      console.warn('[SecureStore] Failed to delete item:', err);
    }
  }
}

const secureStoreAdapter = new ExpoSecureStoreAdapter();

const DEV_SUPABASE_URL = 'https://ghdoqflateritxmnlnwa.supabase.co';
const DEV_SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZG9xZmxhdGVyaXR4bW5sbndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1MjQ4NjYsImV4cCI6MjEwMDEwMDg2Nn0';

const env = process.env.EXPO_PUBLIC_ENV;

export const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  Constants.expoConfig?.extra?.supabaseUrl ||
  DEV_SUPABASE_URL;

export const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  Constants.expoConfig?.extra?.supabaseAnonKey ||
  DEV_SUPABASE_ANON_KEY;

if (env === 'production') {
  if (!process.env.EXPO_PUBLIC_SUPABASE_URL && !Constants.expoConfig?.extra?.supabaseUrl) {
    console.error('[Supabase Client] EXPO_PUBLIC_SUPABASE_URL is missing in production build! Falling back to development endpoint — data may be incorrect.');
  }
} else if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
  console.warn(
    '[Supabase Client] EXPO_PUBLIC_SUPABASE_URL is missing. Using development fallback endpoint.'
  );
}

const getWebStorage = () => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return undefined;
  }
  try {
    const testKey = '__supabase_test_storage__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
  } catch (e) {
    console.warn('[Supabase Client] localStorage test failed, will attempt to use localStorage directly.', e);
  }
  return window.localStorage;
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web' ? getWebStorage() : secureStoreAdapter,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: Platform.OS === 'web',
    flowType: 'implicit',
  },
  global: {
    fetch: (url, options) => {
      return fetch(url, options).catch((err) => {
        throw err;
      });
    },
  },
});

function getSupabaseProjectRef(): string | null {
  try {
    const hostname = new URL(supabaseUrl).hostname;
    return hostname.split('.')[0] || null;
  } catch {
    return null;
  }
}
export const supabaseProjectRef = getSupabaseProjectRef();

// Unauthorized (401/403) Response Error Interceptor
let isHandlingUnauthorized = false;
let unauthorizedDebounceTimer: ReturnType<typeof setTimeout> | null = null;

export const handleUnauthorizedResponse = async (error: any) => {
  const isJwtExpired = error?.message?.includes('JWT expired') || error?.message?.includes('JWTExpired') || error?.message?.includes('jwt expired');
  if (!isJwtExpired) return;

  if (isHandlingUnauthorized) return;
  isHandlingUnauthorized = true;

  if (unauthorizedDebounceTimer) clearTimeout(unauthorizedDebounceTimer);
  unauthorizedDebounceTimer = setTimeout(() => {
    isHandlingUnauthorized = false;
    unauthorizedDebounceTimer = null;
  }, 5000);

  try {
    const { data: { session } } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
    if (!session) {
      console.warn('[Unauthorized Handling] JWT expired and no valid session. Signing out.');
      await supabase.auth.signOut().catch(() => {});
    }
  } catch {
    isHandlingUnauthorized = false;
  }
};
