import { Platform } from 'react-native';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { UserEntity } from '../../domain/entities/User';
import { supabase } from './client';
import { useAuthStore } from '../../shared/stores/useAuthStore';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

import { SupportedLanguage } from '../../shared/constants/languages';

// User-facing error types so the UI can differentiate cancellation from failures
export class OAuthCancelledError extends Error {
  constructor() {
    super('OAuth flow was cancelled by the user.');
    this.name = 'OAuthCancelledError';
  }
}

export class OAuthSessionError extends Error {
  constructor(provider: string, detail?: string) {
    super(detail || `Could not complete ${provider} sign-in. Please try again.`);
    this.name = 'OAuthSessionError';
  }
}

const getRedirectTo = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.location.origin;
  }
  return Linking.createURL('auth/callback');
};

const extractAuthCode = (url: string): string | null => {
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
};

const openOAuthUrl = async (url: string, redirectTo: string) => {
  let result: any;
  try {
    result = await WebBrowser.openAuthSessionAsync(url, redirectTo);
  } catch (err) {
    console.warn('[authRepository] openAuthSessionAsync error:', err);
    throw new OAuthSessionError('Google', 'Unable to open the sign-in page. Check your internet connection and try again.');
  }

  if (result.type === 'cancel' || result.type === 'dismiss') {
    throw new OAuthCancelledError();
  }

  if (result.type === 'success' && result.url) {
    const authCode = extractAuthCode(result.url);

    if (authCode) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);
      if (error) {
        throw new OAuthSessionError('Google', 'Unable to verify your sign-in. Please try again.');
      }
      if (data?.session) return data.session;
    }

    const hashPart = result.url.split('#')[1] || '';
    const hashParams: Record<string, string> = {};
    for (const pair of hashPart.split('&')) {
      const [k, v] = pair.split('=');
      if (k && v) hashParams[k] = decodeURIComponent(v);
    }
    if (hashParams.access_token) {
      const { data, error } = await supabase.auth.setSession({
        access_token: hashParams.access_token,
        refresh_token: hashParams.refresh_token || '',
      });
      if (error) {
        throw new OAuthSessionError('Google', 'Unable to complete sign-in. Please try again.');
      }
      if (data?.session) return data.session;
    }
  }

  throw new OAuthSessionError('Google');
};

const normalizeLangName = (lang: string | null | undefined, defaultCode: SupportedLanguage): SupportedLanguage => {
  if (!lang) return defaultCode;
  const lower = lang.toLowerCase().trim();
  if (lower === 'tl' || lower === 'tagalog' || lower === 'filipino') return 'tl';
  if (lower === 'ko' || lower === 'korean') return 'ko';
  if (lower === 'en' || lower === 'english') return 'en';
  return defaultCode;
};

const langToCode = (lang: string | null | undefined): SupportedLanguage | null => {
  if (!lang) return null;
  const lower = lang.toLowerCase().trim();
  if (lower === 'tl' || lower === 'tagalog' || lower === 'filipino') return 'tl';
  if (lower === 'ko' || lower === 'korean') return 'ko';
  if (lower === 'en' || lower === 'english') return 'en';
  return 'en';
};

export class SupabaseAuthRepository implements IAuthRepository {
  private buildUserFromSession(session: import('@supabase/supabase-js').Session): UserEntity {
    const u = session.user;
    return {
      id: u.id,
      email: u.email || '',
      nativeLang: normalizeLangName(u.user_metadata?.native_lang, 'ko'),
      targetLang: normalizeLangName(u.user_metadata?.target_lang, 'en'),
      avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.picture || null,
      displayName: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private async ensurePublicUser(userId: string, session: import('@supabase/supabase-js').Session): Promise<UserEntity | null> {
    const u = session.user;
    try {
      const avatarUrl = u.user_metadata?.avatar_url || u.user_metadata?.picture || null;
      const displayName = u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'User';
      const payload = {
        id: userId,
        email: u.email || '',
        native_lang: langToCode(u.user_metadata?.native_lang) || 'ko',
        target_lang: langToCode(u.user_metadata?.target_lang) || 'en',
        avatar_url: avatarUrl,
        display_name: displayName,
      };
      const { data, error } = await supabase.from('users').upsert(payload, { onConflict: 'id' }).select().single();
      if (!error && data) {
        return {
          id: data.id,
          email: data.email,
          nativeLang: normalizeLangName(data.native_lang, 'ko'),
          targetLang: normalizeLangName(data.target_lang, 'en'),
          avatarUrl: data.avatar_url || avatarUrl,
          displayName: data.display_name || displayName,
          createdAt: data.created_at,
          updatedAt: data.updated_at || data.created_at || new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn('[authRepository] ensurePublicUser warning:', e);
    }
    return null;
  }

  async signInWithGoogle(): Promise<UserEntity | null> {
    if (Platform.OS === 'web') {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: origin ? `${origin}/` : undefined,
        },
      });
      if (error) {
        throw new OAuthSessionError('Google', error.message);
      }
      return null;
    }

    const redirectTo = getRedirectTo();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) {
      throw new OAuthSessionError('Google', error.message);
    }

    if (!data?.url) {
      throw new OAuthSessionError('Google', 'Could not generate sign-in link. Please try again.');
    }

    const session = await openOAuthUrl(data.url, redirectTo);
    if (session?.user) {
      const dbUser = await this.ensurePublicUser(session.user.id, session);
      if (dbUser) return dbUser;
      return this.buildUserFromSession(session);
    }
    throw new OAuthSessionError('Google');
  }

  async checkCurrentSession(): Promise<boolean> {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      return false;
    }
    return true;
  }

  // Restore Session on App Launch
  async restoreSession(): Promise<UserEntity | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        let user = await this.getCurrentUser();
        if (!user) {
          const avatarUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null;
          const displayName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
          const metaNative = session.user.user_metadata?.native_lang;
          const metaTarget = session.user.user_metadata?.target_lang;
          user = {
            id: session.user.id,
            email: session.user.email || '',
            nativeLang: normalizeLangName(metaNative, 'ko'),
            targetLang: normalizeLangName(metaTarget, 'en'),
            avatarUrl,
            displayName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return user;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return await this.getCurrentUser();
      }
      return null;
    } catch (error) {
      console.warn('[SupabaseAuthRepository] Restore session error, clearing stale session:', error);
      await supabase.auth.signOut().catch(() => {});
      return null;
    }
  }

  // Refresh JWT Access Token
  async refreshToken(): Promise<boolean> {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error || !session) {
      return false;
    }
    return true;
  }

  // Logout & Clear Auth Session
  async signOut(): Promise<void> {
    useAuthStore.getState().incrementSessionId();
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[authRepository] signOut warning:', err);
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        Object.keys(window.localStorage).forEach((key) => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            window.localStorage.removeItem(key);
          }
        });
      } catch (e) {
        // ignore
      }
    }
  }

  // Permanently Delete User Account & Data
  async deleteAccount(userId: string): Promise<void> {
    try {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) {
        console.warn('[authRepository] Delete user record warning:', error);
      }
    } catch (err) {
      console.warn('[authRepository] Delete user record exception:', err);
    } finally {
      try {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.localStorage.setItem('lingosnap-account-deleted', 'true');
        }
      } catch {
        // ignore
      }
      await this.signOut();
    }
  }

  async getCurrentUser(): Promise<UserEntity | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
      const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
      const metaNative = user.user_metadata?.native_lang;
      const metaTarget = user.user_metadata?.target_lang;

      const newUser: UserEntity = {
        id: user.id,
        email: user.email || '',
        nativeLang: normalizeLangName(metaNative, 'ko'),
        targetLang: normalizeLangName(metaTarget, 'en'),
        avatarUrl,
        displayName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        let { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        // If 401 Unauthorized occurs due to OAuth token propagation delay, retry once after session sync
        if (error && ((error as any).status === 401 || (error as any).code === '401' || error.message?.includes('JWT') || error.message?.includes('Unauthorized'))) {
          console.warn('[authRepository] 401 Unauthorized detected during users fetch. Refreshing session header and retrying...');
          await supabase.auth.refreshSession().catch(() => {});
          await new Promise((resolve) => setTimeout(resolve, 250));
          const retryResult = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          data = retryResult.data;
          error = retryResult.error;
        }

        if (!error && data) {
          // Preserve custom uploaded avatarUrl and displayName if present in DB.
          // Only backfill from OAuth metadata if DB avatar_url or display_name is empty/null.
          const finalAvatarUrl = data.avatar_url || avatarUrl;
          const finalDisplayName = data.display_name || displayName;
          const storeNative = useAuthStore.getState()?.user?.nativeLang;
          const storeTarget = useAuthStore.getState()?.user?.targetLang;
          const finalNativeLang = normalizeLangName(data.native_lang || metaNative || storeNative, 'ko');
          const finalTargetLang = normalizeLangName(data.target_lang || metaTarget || storeTarget, 'en');

          if (!data.avatar_url && avatarUrl) {
            try {
              await supabase.from('users').update({ avatar_url: avatarUrl }).eq('id', user.id);
            } catch (uErr) {
              console.warn('[authRepository] Initial avatar backfill warning:', uErr);
            }
          }

          if (!data.display_name && displayName) {
            try {
              await supabase.from('users').update({ display_name: displayName }).eq('id', user.id);
            } catch (uErr) {
              console.warn('[authRepository] Initial display_name backfill warning:', uErr);
            }
          }

          return {
            id: data.id,
            email: data.email,
            nativeLang: finalNativeLang,
            targetLang: finalTargetLang,
            avatarUrl: finalAvatarUrl,
            displayName: finalDisplayName,
            createdAt: data.created_at,
            updatedAt: data.updated_at || data.created_at || new Date().toISOString(),
          };
        }

        // Try inserting/merging into public.users if not present
        try {
          const payload = {
            id: newUser.id,
            email: newUser.email,
            native_lang: langToCode(newUser.nativeLang) || 'ko',
            target_lang: langToCode(newUser.targetLang) || 'en',
            avatar_url: avatarUrl,
            display_name: displayName,
          };
          const { data: upserted, error: upsertErr } = await supabase
            .from('users')
            .upsert(payload, { onConflict: 'id' })
            .select()
            .single();

          if (upsertErr) {
            console.error('[SupabaseAuthRepository] User table auto-insert error:', upsertErr.message);
            if (upsertErr.code === '23505') {
              const { data: updated, error: updateErr } = await supabase
                .from('users')
                .update(payload)
                .eq('id', user.id)
                .select()
                .single();
              if (!updateErr && updated) {
                return {
                  id: updated.id,
                  email: updated.email,
                  nativeLang: normalizeLangName(updated.native_lang, 'ko'),
                  targetLang: normalizeLangName(updated.target_lang, 'en'),
                  avatarUrl: updated.avatar_url || avatarUrl,
                  displayName: updated.display_name || displayName,
                  createdAt: updated.created_at,
                  updatedAt: updated.updated_at || updated.created_at || new Date().toISOString(),
                };
              }
            }
          } else if (upserted) {
            return {
              id: upserted.id,
              email: upserted.email,
              nativeLang: normalizeLangName(upserted.native_lang, 'ko'),
              targetLang: normalizeLangName(upserted.target_lang, 'en'),
              avatarUrl: upserted.avatar_url || avatarUrl,
              displayName: upserted.display_name || displayName,
              createdAt: upserted.created_at,
              updatedAt: upserted.updated_at || upserted.created_at || new Date().toISOString(),
            };
          }
        } catch (err) {
          console.warn('[SupabaseAuthRepository] User table auto-insert warning:', err);
        }

        return newUser;
      } catch (dbErr) {
        console.warn('[SupabaseAuthRepository] Error accessing users table, falling back to Auth user data:', dbErr);
        return newUser;
      }
    } catch (err) {
      console.warn('[SupabaseAuthRepository] getCurrentUser unexpected error:', err);
      return null;
    }
  }

  async updateProfile(userId: string, updates: { avatarUrl?: string; displayName?: string; nativeLang?: string; targetLang?: string }): Promise<UserEntity> {
    const { data: { user: authUser } } = await supabase.auth.getUser();

    const payload: any = {
      id: userId,
      email: authUser?.email || '',
      updated_at: new Date().toISOString(),
    };
    if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
    if (updates.displayName !== undefined) payload.display_name = updates.displayName;
    if (updates.nativeLang !== undefined) payload.native_lang = langToCode(updates.nativeLang);
    if (updates.targetLang !== undefined) payload.target_lang = langToCode(updates.targetLang);

    // Use upsert with required email field so NOT NULL constraint is satisfied
    let finalData: any = null;
    const { data, error } = await supabase
      .from('users')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.warn('[authRepository] Upsert profile warning, trying update fallback:', error.message);
      const { data: updateData, error: updateError } = await supabase
        .from('users')
        .update(payload)
        .eq('id', userId)
        .select()
        .single();

      if (updateError || !updateData) {
        throw new Error(`Profile update error: ${updateError?.message || error.message}`);
      }
      finalData = updateData;
    } else {
      finalData = data;
    }

    // Also persist metadata to Supabase Auth Session
    try {
      const metaData: any = {};
      if (updates.avatarUrl !== undefined) metaData.avatar_url = updates.avatarUrl;
      if (updates.displayName !== undefined) metaData.full_name = updates.displayName;
      if (updates.nativeLang !== undefined) metaData.native_lang = updates.nativeLang;
      if (updates.targetLang !== undefined) metaData.target_lang = updates.targetLang;

      await supabase.auth.updateUser({
        data: metaData,
      });
    } catch (e) {
      console.warn('[authRepository] updateUser auth metadata warning:', e);
    }

    return {
      id: finalData.id,
      email: finalData.email,
      nativeLang: normalizeLangName(finalData.native_lang, (updates.nativeLang as SupportedLanguage) || 'ko'),
      targetLang: normalizeLangName(finalData.target_lang, (updates.targetLang as SupportedLanguage) || 'en'),
      avatarUrl: finalData.avatar_url,
      displayName: finalData.display_name,
      createdAt: finalData.created_at,
      updatedAt: finalData.updated_at,
    };
  }

  onAuthStateChange(callback: (user: UserEntity | null, event?: string) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        let user = await this.getCurrentUser();
        if (!user) {
          const avatarUrl = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null;
          const displayName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User';
          const metaNative = session.user.user_metadata?.native_lang;
          const metaTarget = session.user.user_metadata?.target_lang;
          user = {
            id: session.user.id,
            email: session.user.email || '',
            nativeLang: normalizeLangName(metaNative, 'ko'),
            targetLang: normalizeLangName(metaTarget, 'en'),
            avatarUrl,
            displayName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        // Clean up URL hash on web after successful OAuth redirect token detection
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          try {
            window.history.replaceState(null, '', window.location.pathname);
          } catch (e) {
            // ignore
          }
        }
        callback(user, event);
      } else if (event === 'SIGNED_OUT') {
        callback(null, event);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }
}

export const authRepository = new SupabaseAuthRepository();
