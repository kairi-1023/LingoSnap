import { UserEntity } from '../entities/User';

export interface IAuthRepository {
  signInWithGoogle(): Promise<UserEntity | null>;
  signInWithFacebook(): Promise<UserEntity | null>;
  signOut(): Promise<void>;
  deleteAccount(userId: string): Promise<void>;
  getCurrentUser(): Promise<UserEntity | null>;
  updateProfile(userId: string, updates: { avatarUrl?: string; displayName?: string; nativeLang?: string; targetLang?: string }): Promise<UserEntity>;
  onAuthStateChange(callback: (user: UserEntity | null, eventType?: string) => void): () => void;
}
