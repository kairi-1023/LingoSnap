import { useAuthStore } from '../stores/useAuthStore';
import { authService } from '../services/authService';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  return {
    user,
    isAuthenticated,
    isLoading,
    signInWithGoogle: authService.signInWithGoogle,
    signInWithFacebook: authService.signInWithFacebook,
    signInAsGuest: authService.signInAsGuest.bind(authService),
    restoreSession: authService.restoreSession,
    refreshToken: authService.refreshToken,
    signOut: authService.signOut,
  };
};
