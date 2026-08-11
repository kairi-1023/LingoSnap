import * as Linking from 'expo-linking';
import { useAuthStore } from '../stores/useAuthStore';

export const handleDeepLinkUrl = async (url: string | null) => {
  if (!url) return;
  const parsed = Linking.parse(url);
};
