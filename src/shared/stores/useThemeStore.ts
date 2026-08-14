import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeColors {
  background: string;
  cardBackground: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  primary: string;
  secondary: string;
  accent: string;
  buttonPrimary: string;
  statusBarStyle: 'light-content' | 'dark-content';

  // Semantic tinted surfaces (single source for all screens)
  cardGreenBg: string;
  cardGreenBorder: string;
  successBg: string;
  successBorder: string;
  successText: string;
  streakBg: string;
  streakBorder: string;
  streakText: string;
  warningText: string;
  errorBg: string;
  errorBorder: string;
  infoBg: string;
  infoBorder: string;
  infoSolid: string;

  // Neutral raised/inset surfaces
  chipSurface: string;
  insetSurface: string;
  subtleSurface: string;
  fillSubtle: string;
  paperBg: string;
  paperBorder: string;
  progressTrack: string;
}

export const lightTheme: ThemeColors = {
  background: '#FFFDF7',
  cardBackground: '#FFFFFF',
  surface: '#FFFFFF',
  textPrimary: '#2F3437',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  primary: '#5CB85C',
  secondary: '#FFB84D',
  accent: '#EF6C57',
  buttonPrimary: '#408040',
  statusBarStyle: 'dark-content',

  cardGreenBg: '#F4F9F4',
  cardGreenBorder: '#D8ECD8',
  successBg: '#E6F4E6',
  successBorder: '#D1E7D1',
  successText: '#2E7D32',
  streakBg: '#FFF7E6',
  streakBorder: '#FFE0A3',
  streakText: '#D97706',
  warningText: '#D97706',
  errorBg: '#FCEBEA',
  errorBorder: '#F8C4C0',
  infoBg: 'rgba(74, 144, 226, 0.1)',
  infoBorder: 'rgba(74, 144, 226, 0.25)',
  infoSolid: '#4A90E2',
  chipSurface: '#FFFFFF',
  insetSurface: '#FFFDF7',
  subtleSurface: '#F8FAF8',
  fillSubtle: '#F3F4F6',
  paperBg: '#FAF8F3',
  paperBorder: '#EFEBE2',
  progressTrack: '#E2EFE2',
};

export const darkTheme: ThemeColors = {
  background: '#121212',
  cardBackground: '#1E1E1E',
  surface: '#1E1E1E',
  textPrimary: '#F3F4F6',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  border: '#2E3238',
  primary: '#5CB85C',
  secondary: '#FFB84D',
  accent: '#EF6C57',
  buttonPrimary: '#408040',
  statusBarStyle: 'light-content',

  cardGreenBg: '#18271C',
  cardGreenBorder: '#253B2B',
  successBg: '#1E2F23',
  successBorder: '#2E4C34',
  successText: '#81C784',
  streakBg: '#2A2418',
  streakBorder: '#3D3021',
  streakText: '#FFB84D',
  warningText: '#FFB84D',
  errorBg: '#2D1B18',
  errorBorder: '#4D2420',
  infoBg: 'rgba(74, 144, 226, 0.15)',
  infoBorder: 'rgba(74, 144, 226, 0.3)',
  infoSolid: '#4A90E2',
  chipSurface: '#2D3238',
  insetSurface: '#2D3238',
  subtleSurface: '#2D3238',
  fillSubtle: '#2D3238',
  paperBg: '#222527',
  paperBorder: '#34393D',
  progressTrack: '#233327',
};

interface ThemeState {
  isDarkMode: boolean;
  theme: ThemeColors;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
}

const getThemeStorage = () => {
  if (Platform.OS === 'web') {
    return createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : ({
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    })));
  }
  return createJSONStorage(() => AsyncStorage);
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      theme: lightTheme,
      toggleDarkMode: () =>
        set((state) => {
          const nextIsDark = !state.isDarkMode;
          return {
            isDarkMode: nextIsDark,
            theme: nextIsDark ? darkTheme : lightTheme,
          };
        }),
      setDarkMode: (enabled: boolean) =>
        set({
          isDarkMode: enabled,
          theme: enabled ? darkTheme : lightTheme,
        }),
    }),
    {
      name: 'lingosnap-theme-store',
      storage: getThemeStorage(),
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version !== 1) {
          return { isDarkMode: false };
        }
        return persistedState as { isDarkMode: boolean };
      },
    }
  )
);
