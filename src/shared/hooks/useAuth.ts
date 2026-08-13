import { useAuthStore } from '../stores/useAuthStore';
import { authService } from '../services/authService';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleGoogleSignInWithLoading = async (
    setLoading: (loading: boolean) => void,
    onSuccess?: () => void,
    onError?: (error: unknown) => void
  ) => {
    setLoading(true);
    try {
      await authService.signInWithGoogle();
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'OAuthCancelledError') {
        return;
      }
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    signInWithGoogle: authService.signInWithGoogle,
    handleGoogleSignInWithLoading,
    signInAsGuest: authService.signInAsGuest.bind(authService),
    restoreSession: authService.restoreSession,
    refreshToken: authService.refreshToken,
    signOut: authService.signOut,
  };
};
