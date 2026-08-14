import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeAppLanguage, SUPPORTED_I18N_LANGUAGES } from '../i18n';

interface SettingsState {
  displayLanguage: string;
  setDisplayLanguage: (lang: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      displayLanguage: 'en',
      setDisplayLanguage: async (lang: string) => {
        const code = SUPPORTED_I18N_LANGUAGES.includes(lang) ? lang : 'en';
        await changeAppLanguage(code);
        set({ displayLanguage: code });
      },
    }),
    {
      name: 'lingosnap-settings-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ displayLanguage: state.displayLanguage }),
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          return { displayLanguage: 'en' };
        }
        return persistedState as { displayLanguage: string };
      },
    }
  )
);
