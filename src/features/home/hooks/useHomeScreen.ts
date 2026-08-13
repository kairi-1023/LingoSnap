import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../shared/stores/useAuthStore';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { authService } from '../../../shared/services/authService';
import { lessonService } from '../../../application/services/lessonService';
import { studyService } from '../../../shared/services/studyService';
import { formatLanguagePairWithFlags } from '../../../shared/utils/languageUtils';
import { useTranslation } from 'react-i18next';
import { TabType } from '../../../shared/components/BottomTabBar';
import { WordEntity } from '../../../domain/entities/Word';
import { AILessonEntity } from '../../../domain/entities/AILesson';


const getLessonOrder = (lesson: AILessonEntity) => {
  const title = lesson.titleEn || lesson.title || '';
  const lessonNumber = title.match(/lesson\s*\:?\s*(\d+)/i)?.[1];
  if (lessonNumber) return Number(lessonNumber);
  if (lesson.displayOrder && lesson.displayOrder > 0) return lesson.displayOrder;
  return Number.MAX_SAFE_INTEGER;
};

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

  // 2. Calculate lesson progress from actual vocabulary/studied-word tables.
  const { data: lessonProgressMap = {} } = useQuery<Record<string, number>>({
    queryKey: ['lessonProgressMap', user?.id, lessons.map((lesson) => lesson.id)],
    queryFn: () => user?.id
      ? studyService.fetchLessonProgressMap(user.id, lessons.map((lesson) => lesson.id))
      : Promise.resolve({}),
    enabled: !!user?.id && lessons.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const { data: learnedWords = [], isLoading: isLearnedWordsLoading } = useQuery({
    queryKey: ['homeLearnedWords', user?.id, user?.nativeLang, user?.targetLang],
    queryFn: () => user?.id
      ? studyService.fetchStudiedWords(user.id, user.nativeLang, user.targetLang, 0, 20)
      : Promise.resolve([]),
    enabled: !!user?.id,
    staleTime: 1000 * 60,
  });

  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => {
      const aProgress = lessonProgressMap[a.id] || 0;
      const bProgress = lessonProgressMap[b.id] || 0;
      const aCompleted = aProgress >= 100 || (!!user?.id && a.userId === user.id && !!a.completedAt);
      const bCompleted = bProgress >= 100 || (!!user?.id && b.userId === user.id && !!b.completedAt);
      const aRank = aCompleted ? 2 : aProgress > 0 ? 0 : 1;
      const bRank = bCompleted ? 2 : bProgress > 0 ? 0 : 1;

      if (aRank !== bRank) return aRank - bRank;
      const aOrder = getLessonOrder(a);
      const bOrder = getLessonOrder(b);
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.createdAt.localeCompare(b.createdAt);
    });
  }, [lessons, lessonProgressMap, user?.id]);



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

  const handleSelectLearnedWord = useCallback(
    (word: WordEntity) => {
      if (word.lessonId) {
        router.push({ pathname: '/(tabs)/study', params: { lessonId: word.lessonId } });
      } else {
        router.push({ pathname: '/(tabs)/study', params: { tab: 'review' } });
      }
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

    lessons: sortedLessons,
    lessonProgressMap,
    learnedWords,
    isLearnedWordsLoading,
    isLessonsLoading,
    isLessonsError,
    refetchLessons,

    userFirstName,
    userInitials,

    handleSaveLanguage,
    handleSelectLesson,
    handleSelectLearnedWord,
    handleTabPress,
    router,
  };
}
