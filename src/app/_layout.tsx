import React, { useState } from 'react';
import '../global.css';
import { View, StatusBar, Platform } from 'react-native';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../shared/utils/queryClient';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../shared/stores/useAuthStore';
import { SplashScreen as AppSplashScreen } from '../features/auth/screens/SplashScreen';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { useBootstrap } from '../shared/hooks/useBootstrap';
import { SafeAreaProvider } from 'react-native-safe-area-context';

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

if (typeof ErrorUtils !== 'undefined') {
  const originalHandler = ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
    console.error('[GlobalErrorHandler] Unhandled error:', error?.message || error, 'isFatal:', isFatal);
    if (originalHandler) originalHandler(error, isFatal);
  });
}

function RouteGuard() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const isNavigationReady = !!navigationState?.key;

  useEffect(() => {
    if (isLoading || !isNavigationReady) return;

    const segs = segments as string[];
    const currentGroup = segs && segs.length > 0 ? segs[0] : null;
    const inAuthGroup = !currentGroup || currentGroup === '(auth)';

    if (isAuthenticated) {
      const isAtTabsScreen = segs[0] === '(tabs)';
      const isAllowedOutsideTab = segs[0] === 'quiz' || segs[0] === 'completion';

      if (!isAtTabsScreen && !isAllowedOutsideTab) {
        router.replace('/(tabs)');
      }
    } else {
      const isAtAuthCallback = segs[0] === 'auth' && segs[1] === 'callback';
      if (isAtAuthCallback) return;
      if (!inAuthGroup) router.replace('/(auth)');
    }
  }, [isAuthenticated, isLoading, isNavigationReady, segments]);

  if (isLoading) return <AppSplashScreen />;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFDF7' } }}>
      <Stack.Screen name="auth/callback" options={{ animation: 'fade' }} />
      <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      <Stack.Screen name="quiz" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="completion" options={{ presentation: 'modal', animation: 'fade' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useBootstrap(() => {
    setAppReady(true);
    if (Platform.OS !== 'web') SplashScreen.hideAsync().catch(() => {});
  });

  if (!appReady) return <AppSplashScreen />;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFDF7" />
      <SafeAreaProvider>
        <ErrorBoundary>
          <RouteGuard />
        </ErrorBoundary>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
