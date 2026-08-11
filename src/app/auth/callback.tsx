import { useEffect, useRef } from 'react';
import { Platform, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '../../infrastructure/supabase/client';

function extractCodeFromUrl(url: string): string | null {
  const searchPart = url.split('#')[0];
  const queryStr = searchPart.split('?')[1];
  if (queryStr) {
    for (const param of queryStr.split('&')) {
      const [key, value] = param.split('=');
      if (key === 'code') return decodeURIComponent(value);
    }
  }
  const hash = url.split('#')[1];
  if (hash) {
    for (const param of hash.split('&')) {
      const [key, value] = param.split('=');
      if (key === 'code') return decodeURIComponent(value);
    }
  }
  return null;
}

function extractTokensFromHash(url: string): { access_token?: string; refresh_token?: string } {
  const hash = url.split('#')[1];
  if (!hash) return {};
  const tokens: Record<string, string> = {};
  for (const pair of hash.split('&')) {
    const [k, v] = pair.split('=');
    if (k && v) tokens[k] = decodeURIComponent(v);
  }
  return { access_token: tokens.access_token, refresh_token: tokens.refresh_token };
}

export default function AuthCallbackScreen() {
  const params = useGlobalSearchParams();
  const router = useRouter();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    console.log('[AUTH_DEBUG] Platform.OS:', Platform.OS);
    console.log('[AUTH_DEBUG] auth/callback.tsx mounted - deep link received');
    console.log('[AUTH_DEBUG] useGlobalSearchParams paramKeys:', Object.keys(params));

    const code = params.code as string | undefined;
    const hasAccessToken = !!(params as any).access_token;
    const hasError = !!(params as any).error;

    const handleCallback = async () => {
      let resolvedCode = code;

      if (!resolvedCode && !hasAccessToken) {
        try {
          const initialUrl = await Linking.getInitialURL();
          if (initialUrl) {
            console.log('[AUTH_DEBUG] Falling back to Linking.getInitialURL (URL present)');
            resolvedCode = extractCodeFromUrl(initialUrl) || undefined;
            const tokens = extractTokensFromHash(initialUrl);
            if (!resolvedCode && tokens.access_token) {
              console.log('[AUTH_DEBUG] Setting session from hash tokens (implicit flow fallback)');
              const { data, error } = await supabase.auth.setSession({
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token || '',
              });
              if (!error && data?.session) {
                console.log('[AUTH_DEBUG] Session established via hash tokens');
                router.replace('/(tabs)');
                return;
              }
            }
          }
        } catch (err: unknown) {
          console.log('[AUTH_DEBUG] Linking.getInitialURL error:', err instanceof Error ? err.message : String(err));
        }
      }

      try {
        if (resolvedCode) {
          console.log('[AUTH_DEBUG] Calling exchangeCodeForSession with code');
          const { error } = await supabase.auth.exchangeCodeForSession(resolvedCode);
          if (error) {
            console.log('[AUTH_DEBUG] exchangeCodeForSession error:', error.message);
          } else {
            console.log('[AUTH_DEBUG] exchangeCodeForSession succeeded');
          }
        } else {
          console.log('[AUTH_DEBUG] No auth code found, trying existing session');
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('[AUTH_DEBUG] Session established, navigating to /(tabs)');
          router.replace('/(tabs)');
          return;
        }

        console.log('[AUTH_DEBUG] No session after callback processing');
        router.replace('/(auth)');
      } catch (err: unknown) {
        console.log('[AUTH_DEBUG] Exception:', err instanceof Error ? err.message : String(err));
        router.replace('/(auth)');
      }
    };

    handleCallback();
  }, [params]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#5B5BFF" />
      <Text style={styles.text} includeFontPadding={Platform.OS === 'android' ? false : undefined}>Completing sign in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFDF7',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
