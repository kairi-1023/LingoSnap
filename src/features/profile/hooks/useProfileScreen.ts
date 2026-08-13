import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../shared/stores/useAuthStore';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { useSettingsStore } from '../../../shared/stores/useSettingsStore';
import { authService } from '../../../shared/services/authService';
import { studyService } from '../../../shared/services/studyService';
import { getLanguageDisplay } from '../../../shared/constants/languages';
import { TabType } from '../../../shared/components/BottomTabBar';
import { useTranslation } from 'react-i18next';
import { pickAndCompressAvatar } from '../utils/avatarPicker';

export interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export function useProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // Zustand Atomic Selectors
  const user = useAuthStore((state) => state.user);
  const [learnedCount, setLearnedCount] = useState(0);

  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    let isActive = true;
    if (!user?.id) {
      setLearnedCount(0);
      return () => { isActive = false; };
    }

    studyService.fetchStudiedWordsCount(user.id).then((count) => {
      if (isActive) setLearnedCount(count);
    }).catch(() => {});

    return () => { isActive = false; };
  }, [user?.id]);

  const isMountedRef = useRef(true);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const themeColors = useMemo(
    () => ({
      background: theme.background,
      cardBackground: theme.cardBackground,
      textPrimary: theme.textPrimary,
      textSecondary: theme.textSecondary,
      border: theme.border,
      statusBarStyle: theme.statusBarStyle,
    }),
    [theme, isDarkMode]
  );

  // Avatar Edit Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(user?.avatarUrl || '');
  const [customUrl, setCustomUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // Language Selection Modal State
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);

  // Edit Display Name Modal State
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [inputDisplayName, setInputDisplayName] = useState(user?.displayName || '');
  const [isSavingName, setIsSavingName] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ visible: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setToast((prev) => ({ ...prev, visible: false }));
      }
    }, 4000);
  }, []);

  // Sync state when user object updates
  useEffect(() => {
    if (user?.displayName) setInputDisplayName(user.displayName);
  }, [user?.displayName]);

  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const userInitials = userName.charAt(0).toUpperCase();

  const handleOpenAvatarModal = useCallback(() => {
    setSelectedAvatarUrl(user?.avatarUrl || '');
    setCustomUrl('');
    setIsModalVisible(true);
  }, [user?.avatarUrl]);

  const handlePickLocalFile = useCallback(async () => {
    setIsCompressing(true);
    try {
      const res = await pickAndCompressAvatar(t);
      if (!isMountedRef.current) return;
      if (res.success && res.avatarUrl) {
        setSelectedAvatarUrl(res.avatarUrl);
        setCustomUrl(res.avatarUrl);
        showToast(t('errors.fileSelected', 'Photo selected successfully!'), 'success');
      } else if (res.errorKey) {
        showToast(res.errorDefault || t(res.errorKey), 'error');
      }
    } catch {
      showToast(t('errors.fileReadFailed'), 'error');
    } finally {
      if (isMountedRef.current) {
        setIsCompressing(false);
      }
    }
  }, [showToast, t]);

  const handleSaveAvatar = useCallback(async () => {
    let avatarToSave = customUrl.trim() || selectedAvatarUrl;
    if (!user?.id) return;

    if (!avatarToSave) {
      showToast(t('errors.selectPhotoOrUrl'), 'warning');
      return;
    }

    setIsUpdating(true);
    try {
      await authService.updateAvatar(user.id, avatarToSave);
      if (isMountedRef.current) {
        setIsModalVisible(false);
        showToast(t('errors.photoUpdated'), 'success');
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        const msg = err instanceof Error ? err.message : t('errors.photoUpdateFailed');
        showToast(msg, 'error');
      }
    } finally {
      if (isMountedRef.current) {
        setIsUpdating(false);
      }
    }
  }, [customUrl, selectedAvatarUrl, user?.id, showToast, t]);

  const handleSaveDisplayName = useCallback(async () => {
    if (!user?.id) return;
    const trimmed = inputDisplayName.trim();
    if (!trimmed) {
      showToast(t('errors.enterValidName'), 'warning');
      return;
    }

    setIsSavingName(true);
    try {
      await authService.updateDisplayName(user.id, trimmed);
      if (isMountedRef.current) {
        setIsNameModalVisible(false);
        showToast(t('errors.nameUpdated'), 'success');
      }
    } catch (err: unknown) {
      if (isMountedRef.current) {
        const msg = err instanceof Error ? err.message : t('errors.nameUpdateFailed');
        showToast(msg, 'error');
      }
    } finally {
      if (isMountedRef.current) {
        setIsSavingName(false);
      }
    }
  }, [user?.id, inputDisplayName, showToast, t]);

  const handleTabPress = useCallback(
    (tab: TabType) => {
      if (tab === 'profile') return;
      if (tab === 'home') router.push('/(tabs)');
      else if (tab === 'study') router.push('/(tabs)/study');
    },
    [router]
  );

  const handleSignOut = useCallback(async () => {
    try {
      await authService.signOut();
      router.replace('/(auth)');
    } catch (err: unknown) {
      console.warn('[useProfileScreen] Sign out error:', err instanceof Error ? err.message : String(err));
      showToast(t('errors.signOutError'), 'error');
    }
  }, [router, showToast, t]);

  return {
    user,
    learnedCount,
    isDarkMode,
    toggleDarkMode,
    theme,
    themeColors,

    // Modals & Inputs
    isModalVisible,
    setIsModalVisible,
    selectedAvatarUrl,
    setSelectedAvatarUrl,
    customUrl,
    setCustomUrl,
    isUpdating,
    isCompressing,

    isLanguageModalVisible,
    setIsLanguageModalVisible,
    isGuestModalVisible,
    setIsGuestModalVisible,

    isNameModalVisible,
    setIsNameModalVisible,
    inputDisplayName,
    setInputDisplayName,
    isSavingName,

    toast,
    userName,
    userInitials,

    // Handlers
    handleOpenAvatarModal,
    handlePickLocalFile,
    handleSaveAvatar,
    handleSaveDisplayName,
    handleTabPress,
    handleSignOut,
    showToast,
    router,
  };
}
