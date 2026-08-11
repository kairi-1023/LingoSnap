import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../shared/stores/useAuthStore';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { authService } from '../../../shared/services/authService';
import { lessonService } from '../../../application/services/lessonService';
import { progressService } from '../../../application/services/progressService';
import { formatLanguagePairWithFlags } from '../../../shared/utils/languageUtils';
import { useTranslation } from 'react-i18next';
import { TabType } from '../../../shared/components/BottomTabBar';

export function useHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // Zustand State
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

  const langPairFlags = useMemo(
    () => formatLanguagePairWithFlags(user?.nativeLang, user?.targetLang, true),
    [user?.nativeLang, user?.targetLang]
  );

  const handleSaveLanguage = useCallback(
    async (nativeLang: string, targetLang: string) => {
      if (!user?.id) return;
      await authService.updateProfile(user.id, {
        nativeLang: nativeLang as any,
        targetLang: targetLang as any,
      });
    },
    [user?.id]
  );

  // 1. TanStack Query: Fetch Lessons via lessonService
  const {
    data: lessons = [],
    isLoading: isLessonsLoading,
    isError: isLessonsError,
    refetch: refetchLessons,
  } = useQuery({
    queryKey: ['lessons', user?.id || 'guest'],
    queryFn: () => lessonService.getLessons(user?.id),
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });

  // 2. TanStack Query: Fetch Progresses for User Lessons
  const { data: userProgresses = [] } = useQuery({
    queryKey: ['userProgresses', user?.id],
    queryFn: () => (user?.id ? progressService.getAllProgress(user.id) : Promise.resolve([])),
    enabled: !!user?.id && lessons.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  // Map progress percent per lesson
  const lessonProgressMap = useMemo(() => {
    const map: Record<string, number> = {};
    userProgresses.forEach((p) => {
      if (p.lessonId) {
        map[p.lessonId] = p.quizScore || (p.completedCount > 0 ? 100 : 0);
      }
    });
    return map;
  }, [userProgresses]);

  const userFirstName = useMemo(
    () => (user?.displayName ? user.displayName.split(' ')[0] : user?.email?.split('@')[0] || 'User'),
    [user?.displayName, user?.email]
  );

  const userInitials = useMemo(() => userFirstName.charAt(0).toUpperCase(), [userFirstName]);

  // Navigate to ImageLessonScreen (passing lessonId parameter)
  const handleSelectLesson = useCallback(
    (lessonId: string) => {
      router.push({
        pathname: '/(tabs)/study',
        params: { lessonId },
      });
    },
    [router]
  );

  const handleTabPress = useCallback(
    (tab: TabType) => {
      if (tab === 'home') return;
      if (tab === 'study') router.push('/(tabs)/study');
      else if (tab === 'review') router.push({ pathname: '/(tabs)/study', params: { tab: 'review' } });
      else if (tab === 'dictionary') router.push({ pathname: '/(tabs)/study', params: { tab: 'dictionary' } });
      else if (tab === 'profile') router.push('/(tabs)/profile');
    },
    [router]
  );

  return {
    user,
    theme,
    isDarkMode,
    isGuestModalVisible,
    setIsGuestModalVisible,
    isLanguageModalVisible,
    setIsLanguageModalVisible,
    langPairFlags,

    lessons,
    lessonProgressMap,
    isLessonsLoading,
    isLessonsError,
    refetchLessons,

    userFirstName,
    userInitials,

    handleSaveLanguage,
    handleSelectLesson,
    handleTabPress,
    router,
  };
}
