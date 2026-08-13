import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { layout } from '../../../shared/theme/spacing';
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

const StudyHubScreen: React.FC = React.memo(() => {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: StudySubTab; lessonId?: string }>();
  const theme = useThemeStore((state) => state.theme);
  const { t } = useTranslation();

  // State Management
  const [activeSubTab, setActiveSubTab] = useState<StudySubTab>('todays_study');
  const [stepState, setStepState] = useState<StepState>('word_learning');
  const [reviewCount, setReviewCount] = useState(0);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      router.replace('/(tabs)');
      return true;
    });

    return () => subscription.remove();
  }, [router]);

  useEffect(() => {
    studyService.getDueReviewWords(user?.id, user?.nativeLang, user?.targetLang)
      .then((words) => {
        setReviewCount(words.length);
      })
      .catch((err) => {
        console.warn('[StudyScreen] Failed to get due review words:', err);
      });
  }, [user?.id, user?.nativeLang, user?.targetLang]);

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
              <TodayStudyView />
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

StudyHubScreen.displayName = 'StudyHubScreen';

export const StudyScreen: React.FC = React.memo(() => {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: StudySubTab; lessonId?: string }>();

  if (params.lessonId) {
    return (
      <ImageLessonScreen
        lessonId={params.lessonId}
        onBack={() => {
          router.replace('/(tabs)/study');
        }}
        onNavigateToQuiz={() => router.push({ pathname: '/quiz', params: { lessonId: params.lessonId } })}
      />
    );
  }

  return <StudyHubScreen />;
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
  mainContent: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
  },
});

export default StudyScreen;
