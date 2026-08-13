import { authRepository } from '../../infrastructure/supabase/authRepository';
import { useAuthStore } from '../stores/useAuthStore';
import { useStudyStore } from '../stores/useStudyStore';
import { clearStorageVersion } from '../../infrastructure/storage/storageVersion';
import { queryClient } from '../utils/queryClient';
import { UserEntity } from '../../domain/entities/User';
import { SupportedLanguage } from '../constants/languages';

export class AuthService {
  async signInWithGoogle() {
    return authRepository.signInWithGoogle();
  }

  async signInAsGuest(nativeLang?: string, targetLang?: string) {
    useAuthStore.getState().setGuestUser(nativeLang as SupportedLanguage, targetLang as SupportedLanguage);
  }

  // Restore Session on App Boot
  async restoreSession() {
    useAuthStore.getState().setLoading(true);
    try {
      const user = await authRepository.restoreSession();
      return user;
    } catch (error) {
      console.warn('[AuthService] Session restore failed:', error);
      return null;
    }
  }

  // Manually Trigger Refresh Token
  async refreshToken() {
    return authRepository.refreshToken();
  }

  // Full Logout & Store Clear
  async signOut() {
    useAuthStore.getState().setLoading(true);
    try {
      await authRepository.signOut();
    } finally {
      // Invalidate all in-flight requests from this session
      useAuthStore.getState().incrementSessionId();
      queryClient.clear();
      // Clear All Global Zustand Stores
      useAuthStore.getState().setUser(null);
      useStudyStore.getState().resetSession();
      useAuthStore.getState().setLoading(false);
      clearStorageVersion().catch(() => {});
    }
  }

  async deleteAccount(userId: string) {
    useAuthStore.getState().setLoading(true);
    try {
      await authRepository.deleteAccount(userId);
      useAuthStore.getState().incrementSessionId();
      queryClient.clear();
      useAuthStore.getState().setUser(null);
      useStudyStore.getState().resetSession();
      clearStorageVersion().catch(() => {});
    } catch (err) {
      throw err;
    } finally {
      useAuthStore.getState().setLoading(false);
    }
  }

  async updateProfile(userId: string, updates: { avatarUrl?: string; displayName?: string; nativeLang?: string; targetLang?: string }) {
    const currentUser = useAuthStore.getState().user;
    if (currentUser?.isGuest || userId === 'guest_user') {
      const updatedUser: UserEntity = {
        ...currentUser!,
        ...(updates.nativeLang && { nativeLang: updates.nativeLang as SupportedLanguage }),
        ...(updates.targetLang && { targetLang: updates.targetLang as SupportedLanguage }),
        ...(updates.displayName && { displayName: updates.displayName }),
        ...(updates.avatarUrl !== undefined && { avatarUrl: updates.avatarUrl }),
        updatedAt: new Date().toISOString(),
      };
      useAuthStore.getState().setUser(updatedUser);
      return updatedUser;
    }
    const updatedUser = await authRepository.updateProfile(userId, updates);
    useAuthStore.getState().setUser(updatedUser);
    return updatedUser;
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return this.updateProfile(userId, { avatarUrl });
  }

  async updateDisplayName(userId: string, displayName: string) {
    return this.updateProfile(userId, { displayName });
  }
}

export const authService = new AuthService();
