import { useEffect } from 'react';
import { Platform, AppState } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import NetInfo from '@react-native-community/netinfo';
import { router } from 'expo-router';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as Localization from 'expo-localization';
import { useAuthStore } from '../stores/useAuthStore';
import { useStudyStore } from '../stores/useStudyStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { authService } from '../services/authService';
import { authRepository } from '../../infrastructure/supabase/authRepository';
import { OfflineSyncManager } from '../../infrastructure/offline/offlineSyncManager';
import { queryClient } from '../utils/queryClient';
import { initI18n, SUPPORTED_I18N_LANGUAGES, changeAppLanguage, getSavedLanguage } from '../i18n';
import { supabase } from '../../infrastructure/supabase/client';
import { persistStorageVersion } from '../../infrastructure/storage/storageVersion';
import { UserEntity } from '../../domain/entities/User';

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

interface BootstrapResult {
  appReady: boolean;
}

export function useBootstrap(onReady: () => void): void {
  useEffect(() => {
    let isMounted = true;
    let isBooting = true;
    let deferredSignOut: (() => void) | null = null;

    const safetyTimer = setTimeout(() => {
      if (useAuthStore.getState().isLoading) {
        useAuthStore.getState().setLoading(false);
      }
    }, 5000);

    const unsubscribe = authRepository.onAuthStateChange(async (currentUser: UserEntity | null, eventType?: string) => {
      if (!isMounted) return;
      if (currentUser) {
        useAuthStore.getState().setUser(currentUser);
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } else if (eventType === 'SIGNED_OUT') {
        useAuthStore.getState().incrementSessionId();
        queryClient.clear();
        if (isBooting) {
          deferredSignOut = () => {
            useStudyStore.getState().resetSession();
            useAuthStore.getState().setUser(null);
          };
        } else {
          useStudyStore.getState().resetSession();
          useAuthStore.getState().setUser(null);
        }
      }
    });

    async function bootstrap() {
      const fontPromise = Font.loadAsync({
        'Inter-Regular': Inter_400Regular,
        'Inter-Medium': Inter_500Medium,
        'Inter-SemiBold': Inter_600SemiBold,
        'Inter-Bold': Inter_700Bold,
      });

      const i18nPromise = (async () => {
        try {
          await initI18n();
          const saved = await getSavedLanguage();
          let detectedLang: string;
          if (saved && SUPPORTED_I18N_LANGUAGES.includes(saved)) {
            detectedLang = saved;
          } else {
            const locales = Localization.getLocales();
            detectedLang = locales?.[0]?.languageCode || 'en';
            if (!SUPPORTED_I18N_LANGUAGES.includes(detectedLang)) detectedLang = 'en';
          }
          await changeAppLanguage(detectedLang);
          useSettingsStore.getState().setDisplayLanguage(detectedLang);
        } catch (e) {
          await changeAppLanguage('en').catch(() => {});
          useSettingsStore.getState().setDisplayLanguage('en');
        }
      })();

      const fontTimeout = new Promise((resolve) => setTimeout(resolve, 2000));
      await Promise.race([Promise.all([fontPromise, i18nPromise]), fontTimeout]).catch(() => {});

      const isOAuthRedirect = Platform.OS === 'web' && typeof window !== 'undefined' && window.location.hash.includes('access_token');
      const splashDelay = isOAuthRedirect ? 200 : 600;
      const minSplashTime = new Promise((resolve) => setTimeout(resolve, splashDelay));

      try {
        const currentUser = await authService.restoreSession();
        if (currentUser && isMounted) {
          await minSplashTime;
          useAuthStore.getState().setUser(currentUser);
          if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          persistStorageVersion().catch(() => {});
        } else if (isMounted) {
          if (isOAuthRedirect) {
            const postBootUser = await Promise.race([
              new Promise<UserEntity | null>((resolve) => {
                const check = () => {
                  const u = useAuthStore.getState().user;
                  if (u && !u.isGuest) resolve(u);
                };
                check();
                const interval = setInterval(() => {
                  const u = useAuthStore.getState().user;
                  if (u && !u.isGuest) { clearInterval(interval); resolve(u); }
                }, 200);
                setTimeout(() => { clearInterval(interval); resolve(null); }, 1500);
              }),
              minSplashTime.then(() => null),
            ]);
            const hasValidSession = postBootUser ? await authRepository.checkCurrentSession() : false;
            if (postBootUser && hasValidSession) {
              // session valid, user already set via onAuthStateChange
            } else if (isMounted) {
              let resolvedUser: UserEntity | null = null;
              const hasSession = await authRepository.checkCurrentSession();
              if (hasSession) resolvedUser = await authService.restoreSession();
              if (!resolvedUser && Platform.OS === 'web' && typeof window !== 'undefined') {
                const urlCode = new URLSearchParams(window.location.search).get('code');
                if (urlCode) {
                  const { data, error } = await supabase.auth.exchangeCodeForSession(urlCode);
                  if (!error && data?.session) resolvedUser = await authRepository.getCurrentUser();
                }
              }
              if (resolvedUser && isMounted) {
                useAuthStore.getState().setUser(resolvedUser);
              } else if (isMounted) {
                useAuthStore.getState().setUser(null);
              }
            }
          } else {
            useAuthStore.getState().setUser(null);
          }
        }
        persistStorageVersion().catch(() => {});
      } catch (e) {
        if (isMounted) useAuthStore.getState().setUser(null);
      } finally {
        if (isMounted) {
          isBooting = false;
          if (deferredSignOut && !useAuthStore.getState().isAuthenticated) deferredSignOut();
          deferredSignOut = null;
          useAuthStore.getState().setLoading(false);
          clearTimeout(safetyTimer);
          onReady();
        }
      }
    }

    bootstrap();
    OfflineSyncManager.processQueue().catch(() => {});

    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') OfflineSyncManager.processQueue().catch(() => {});
    });

    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) {
        OfflineSyncManager.processQueue().catch(() => {});
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      unsubscribe();
      appStateSubscription.remove();
      unsubscribeNetInfo();
    };
  }, []);
}

