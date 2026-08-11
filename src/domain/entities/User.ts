import { SupportedLanguage } from '../../shared/constants/languages';

export interface UserEntity {
  id: string;
  email: string;
  nativeLang: SupportedLanguage;
  targetLang: SupportedLanguage;
  avatarUrl?: string | null;
  displayName?: string | null;
  pushToken?: string | null;
  isGuest?: boolean;
  createdAt: string;
  updatedAt: string;
}
