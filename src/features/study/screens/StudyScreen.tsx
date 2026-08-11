import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { spacing, layout } from '../../../shared/theme/spacing';
import { SegmentedControl, SegmentItem } from '../../../shared/components/SegmentedControl';
import { BottomTabBar, TabType } from '../../../shared/components/BottomTabBar';
import { TodayStudyView } from '../components/TodayStudyView';
import { QuizView } from '../components/QuizView';
import { ReviewView } from '../components/ReviewView';
import { CompletionView } from '../components/CompletionView';
import { DictionaryView } from '../components/DictionaryView';
import { CompactHeader } from '../components/CompactHeader';
import { useStudyStore } from '../../../shared/stores/useStudyStore';
import { useAuthStore } from '../../../shared/stores/useAuthStore';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { studyService } from '../../../shared/services/studyService';

type StudySubTab = 'todays_study' | 'review' | 'dictionary';
type StepState = 'word_learning' | 'quiz' | 'review' | 'dictionary' | 'completion';

import { ImageLessonScreen } from './ImageLessonScreen';

export const StudyScreen: React.FC = React.memo(() => {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: StudySubTab; lessonId?: string }>();

  if (params.lessonId) {
    return (
      <ImageLessonScreen
        lessonId={params.lessonId}
        onBack={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/(tabs)');
        }}
        onNavigateToQuiz={() => router.push({ pathname: '/quiz', params: { lessonId: params.lessonId } })}
      />
    );
  }
  const theme = useThemeStore((state) => state.theme);
  const { t } = useTranslation();

  // State Management
  const [activeSubTab, setActiveSubTab] = useState<StudySubTab>('todays_study');
  const [stepState, setStepState] = useState<StepState>('word_learning');
  const [reviewCount, setReviewCount] = useState(0);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    studyService.getDueReviewWords(user?.id, user?.nativeLang, user?.targetLang)
      .then((words) => {
        setReviewCount(words.length);
      })
      .catch((err) => {
        console.warn('[StudyScreen] Failed to get due review words:', err);
      });
  }, [user?.id, user?.nativeLang, user?.targetLang]);

  const studySubTabs = React.useMemo<SegmentItem<StudySubTab>[]>(
    () => [
      { id: 'todays_study', label: t('study.learn') },
      { id: 'review', label: t('study.review', { count: reviewCount }) },
      { id: 'dictionary', label: t('study.dictionary') },
    ],
    [t, reviewCount]
  );

  const handleSubTabChange = React.useCallback((tab: StudySubTab) => {
    setActiveSubTab(tab);
    if (tab === 'todays_study') {
      setStepState('word_learning');
    } else if (tab === 'review') {
      setStepState('review');
    } else if (tab === 'dictionary') {
      setStepState('dictionary');
    }
  }, []);

  useEffect(() => {
    if (params.tab && (params.tab === 'todays_study' || params.tab === 'review' || params.tab === 'dictionary')) {
      handleSubTabChange(params.tab);
    }
  }, [params.tab, handleSubTabChange]);

  const handleBottomTabPress = React.useCallback(
    (tab: TabType) => {
      if (tab === 'home') router.push('/(tabs)');
      else if (tab === 'study') handleSubTabChange('todays_study');
      else if (tab === 'review') handleSubTabChange('review');
      else if (tab === 'dictionary') handleSubTabChange('dictionary');
      else if (tab === 'profile') router.push('/(tabs)/profile');
    },
    [router, handleSubTabChange]
  );

  const handleCompleteStudyStep = React.useCallback(() => setStepState('quiz'), []);
  const handleCompleteQuizStep = React.useCallback(() => setStepState('completion'), []);
  const handleCompleteReview = React.useCallback(() => setStepState('completion'), []);
  const handleRestart = React.useCallback(() => {
    setActiveSubTab('todays_study');
    setStepState('word_learning');
  }, []);

  const currentBottomTab: TabType =
    activeSubTab === 'review' ? 'review' : activeSubTab === 'dictionary' ? 'dictionary' : 'study';

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.background} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.tabletWrapper}>
          {/* Top Compact Header */}
          <CompactHeader
            title={t('study.studyCenter')}
            onBackPress={() => router.push('/(tabs)')}
            showProgress={false}
          />

          {/* Main Active Step View Container */}
          <View style={styles.mainContent}>
            {stepState === 'word_learning' && (
              <TodayStudyView
                onCompleteStudyStep={handleCompleteStudyStep}
              />
            )}

            {stepState === 'quiz' && (
              <QuizView
                onCompleteQuizStep={handleCompleteQuizStep}
              />
            )}

            {stepState === 'review' && (
              <ReviewView
                onCompleteReview={handleCompleteReview}
              />
            )}

            {stepState === 'dictionary' && <DictionaryView />}

            {stepState === 'completion' && (
              <CompletionView
                onRestart={handleRestart}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Fixed Bottom Navigation Bar Component */}
      <BottomTabBar activeTab={currentBottomTab} onTabPress={handleBottomTabPress} />
    </SafeAreaView>
  );
});

StudyScreen.displayName = 'StudyScreen';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  tabletWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxContentWidthTablet,
    alignSelf: 'center',
  },
  segmentedWrapper: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  mainContent: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
  },
});

export default StudyScreen;
