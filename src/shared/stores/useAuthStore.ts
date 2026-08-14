import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserEntity } from '../../domain/entities/User';
import { SupportedLanguage } from '../constants/languages';

export interface AuthState {
  user: UserEntity | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionId: number;
  setUser: (user: UserEntity | null) => void;
  setGuestUser: (nativeLang?: SupportedLanguage, targetLang?: SupportedLanguage) => void;
  setLoading: (isLoading: boolean) => void;
  incrementSessionId: () => void;
  swapLanguages: () => void;
  setLanguages: (nativeLang: SupportedLanguage, targetLang: SupportedLanguage) => void;
}

const buildGuestUser = (nativeLang: SupportedLanguage = 'en', targetLang: SupportedLanguage = 'ko'): UserEntity => ({
  id: 'guest_user',
  email: 'guest@lingosnap.app',
  displayName: 'Guest Explorer',
  nativeLang,
  targetLang,
  isGuest: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const getHybridStorage = () => {
  if (Platform.OS === 'web') {
    return createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : dummyStorage));
  }
  return createJSONStorage(() => AsyncStorage);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      sessionId: 0,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setGuestUser: (nativeLang, targetLang) => set({ user: buildGuestUser(nativeLang, targetLang), isAuthenticated: true, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      incrementSessionId: () => set((state) => ({ sessionId: state.sessionId + 1 })),
      swapLanguages: () => {
        const current = get().user;
        if (!current) return;
        set({
          user: {
            ...current,
            nativeLang: current.targetLang as SupportedLanguage,
            targetLang: current.nativeLang as SupportedLanguage,
          },
        });
      },
      setLanguages: (nativeLang, targetLang) => {
        const current = get().user;
        if (!current) return;
        set({
          user: {
            ...current,
            nativeLang,
            targetLang,
          },
        });
      },
    }),
    {
      name: 'lingosnap-auth-store',
      storage: getHybridStorage(),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      version: 1,
      // When storage version changes (app update with breaking store change), invalidate persisted auth
      migrate: (persistedState: any, version: number) => {
        if (version !== 1) {
          // Storage format mismatch — start fresh, user will re-authenticate via Supabase session
          return { user: null, isAuthenticated: false };
        }
        return persistedState as { user: UserEntity | null; isAuthenticated: boolean };
      },
    }
  )
);
