import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeHeader } from '../../../shared/components/HomeHeader';
import { BottomTabBar } from '../../../shared/components/BottomTabBar';
import { Typography } from '../../../shared/components/Typography';
import { spacing, layout } from '../../../shared/theme/spacing';
import { GuestAuthModal } from '../../../shared/components/GuestAuthModal';
import { LanguageSelectModal } from '../../../shared/components/LanguageSelectModal';
import { useTranslation } from 'react-i18next';
import { useHomeScreen } from '../hooks/useHomeScreen';
import { studyService } from '../../../shared/services/studyService';
import { LessonCard } from '../components/LessonCard';
import { ReviewWordsCard } from '../components/ReviewWordsCard';
import { TodayWordCard } from '../components/TodayWordCard';

export const HomeScreen: React.FC = React.memo(() => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const {
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
    learnedWords,
    isLearnedWordsLoading,
    userFirstName,
    userInitials,

    handleSaveLanguage,
    handleSelectLesson,
    handleSelectLearnedWord,
    handleTabPress,
    router,
  } = useHomeScreen();

  const nextLesson = lessons.find((lesson) => {
    const progress = lessonProgressMap[lesson.id] || 0;
    const isCompleted = progress >= 100 || (!!user?.id && lesson.userId === user.id && !!lesson.completedAt);
    return !isCompleted;
  }) || lessons[0];
  const nextLessonProgress = nextLesson
    ? Math.min(100, Math.max(0, lessonProgressMap[nextLesson.id] || 0))
    : 0;

  const { data: allVocabulary = [] } = useQuery({
    queryKey: ['homeTodayWordVocabulary', user?.nativeLang, user?.targetLang],
    queryFn: () => studyService.getAllVocabulary(user?.nativeLang, user?.targetLang, 0, 100),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });
  const learnedWordIds = new Set(learnedWords.flatMap((word) => [word.id, word.conceptId].filter(Boolean) as string[]));
  const todayWord = allVocabulary.find((word) => !learnedWordIds.has(word.id) && !learnedWordIds.has(word.conceptId || ''));

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.background}
      />

      <HomeHeader
        userName={userFirstName}
        userAvatarUrl={user?.avatarUrl || undefined}
        userInitials={userInitials}
        onProfilePress={() => router.push('/(tabs)/profile')}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 72 + insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabletWrapper}>
          <View style={styles.greetingSection}>
            <View style={styles.greetingHeaderRow}>
              <Typography
                variant="sectionTitle"
                ellipsizeMode="tail"
                style={styles.greetingTitle}
              >
                {t('home.greeting', { name: userFirstName })}
              </Typography>

              <Pressable
                style={({ pressed }) => [
                  styles.languageChip,
                  {
                    backgroundColor: isDarkMode ? 'rgba(92, 184, 92, 0.15)' : '#F0FDF4',
                    borderColor: isDarkMode ? 'rgba(92, 184, 92, 0.3)' : '#DCFCE7',
                  },
                  pressed && Platform.OS !== 'android' && { opacity: 0.7 },
                ]}
                android_ripple={{
                  color: 'rgba(92, 184, 92, 0.2)',
                  borderless: false,
                }}
                onPress={() => setIsLanguageModalVisible(true)}
                accessibilityRole="button"
              >
                <Typography
                  variant="caption"
                  style={[styles.languageChipText, { color: theme.primary }]}
                >
                  {langPairFlags.formatted}
                </Typography>
              </Pressable>
            </View>

            <Typography
              variant="body"
              color="textSecondary"
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.greetingSubtitle}
            >
              {t('home.studyPrompt')}
            </Typography>
          </View>

          {/* 1. PRIMARY: 5 Min Daily Lesson Hero Card */}
          {nextLesson && (
            <View style={styles.continueSection}>
              <LessonCard
                lesson={nextLesson}
                progressPercent={nextLessonProgress}
                theme={theme}
                onSelectLesson={handleSelectLesson}
              />
            </View>
          )}

          {/* 2. SECONDARY: 오늘의 한 단어 */}
          {todayWord && (
            <TodayWordCard
              theme={theme}
              word={todayWord}
              onPress={() => router.push({ pathname: '/(tabs)/study', params: { tab: 'todays_study' } })}
            />
          )}

          {/* 3. REVIEW: 내가 배웠던 단어 */}
          <ReviewWordsCard
            theme={theme}
            words={learnedWords}
            isLoading={isLearnedWordsLoading}
            onSelectWord={handleSelectLearnedWord}
          />
        </View>
      </ScrollView>



      <GuestAuthModal
        visible={isGuestModalVisible}
        onClose={() => setIsGuestModalVisible(false)}
        title={t('study.syncProgress')}
        subtitle={t('study.syncSubtitle')}
      />

      <LanguageSelectModal
        visible={isLanguageModalVisible}
        nativeLang={user?.nativeLang || 'ko'}
        targetLang={user?.targetLang || 'tl'}
        onClose={() => setIsLanguageModalVisible(false)}
        onSave={handleSaveLanguage}
      />

      <BottomTabBar
        activeTab="home"
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
});

HomeScreen.displayName = 'HomeScreen';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    flexGrow: 1,
  },
  tabletWrapper: {
    maxWidth: layout.maxContentWidthTablet,
    width: '100%',
    alignSelf: 'center',
  },
  greetingSection: {
    marginTop: 6,
    marginBottom: 12,
  },

  greetingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  greetingTitle: {
    flex: 1,
    marginRight: 4,
    minWidth: 0,
    fontSize: 19,
    fontWeight: '700',
  },
  languageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'center',
    minHeight: 28,
    overflow: 'hidden',
  },
  languageChipText: {
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  greetingSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  continueSection: {
    marginTop: 4,
  },
});





export default HomeScreen;
