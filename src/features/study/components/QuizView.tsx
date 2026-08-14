import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Vibration,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookOpen } from 'lucide-react-native';
import { spacing } from '../../../shared/theme/spacing';
import { Typography } from '../../../shared/components/Typography';
import { EmptyState } from '../../../shared/components/EmptyState';

import { useStudyStore } from '../../../shared/stores/useStudyStore';
import { useAuthStore } from '../../../shared/stores/useAuthStore';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { studyService } from '../../../shared/services/studyService';
import { soundService } from '../../../shared/services/soundService';
import { ttsService } from '../../../shared/services/ttsService';
import { parseTtsAudioUrl } from '../../../shared/utils/ttsStorage';
import { getVocabularyImageUrl } from '../../../shared/utils/vocabularyImageMap';
import { SrsRating } from '../../../domain/repositories/IStudyRepository';
import { QuizOptionButton } from './QuizOptionButton';
import { QuizCanvas } from './QuizCanvas';
import { useWindowSizeClass } from '../../../shared/hooks/useWindowSizeClass';

interface QuizViewProps {
  onCompleteQuizStep: () => void;
}

export const QuizView: React.FC<QuizViewProps> = React.memo(({ onCompleteQuizStep }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const todayWords = useStudyStore((state) => state.todayWords);
  const theme = useThemeStore((state) => state.theme);
  const { isShortHeight } = useWindowSizeClass();

  const isSmallScreen = isShortHeight;

  // Responsive Quiz Image Height Range (130dp ~ 150dp smoothly)
  const responsiveImageHeight = useMemo(() => {
    if (isShortHeight) return 130;
    return 140;
  }, [isShortHeight]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Async Safety & Session Guard Refs
  const transitionLockRef = useRef(false);
  const autoNextTimerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());
  const activeSessionIdRef = useRef<number>(Date.now());

  // Clean up timers & TTS audio on unmount or Back navigation
  useEffect(() => {
    const currentSessionId = Date.now();
    activeSessionIdRef.current = currentSessionId;
    questionStartTimeRef.current = currentSessionId;
    transitionLockRef.current = false;

    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }

    return () => {
      activeSessionIdRef.current = 0; // Invalidate session
      if (autoNextTimerRef.current) {
        clearTimeout(autoNextTimerRef.current);
        autoNextTimerRef.current = null;
      }
      ttsService.stop();
    };
  }, [questionIndex]);

  const userFirstName = user?.displayName || 'You';

  const activeQuizzes = useMemo(() => {
    return studyService.generateQuizzes(todayWords, userFirstName);
  }, [todayWords, userFirstName]);

  const currentQuiz = activeQuizzes[questionIndex];
  const totalQuestions = activeQuizzes.length || 1;

  // Supabase DB & Local Image Map Matching for Quiz Answer Word
  const quizImageUrl = useMemo(() => {
    if (!currentQuiz?.word) return undefined;
    const wordTarget = currentQuiz.word.wordTarget || currentQuiz.word.conceptId || '';
    return getVocabularyImageUrl(wordTarget);
  }, [currentQuiz?.word]);

  const handleNextQuestion = useCallback(async () => {
    if (transitionLockRef.current) return;
    transitionLockRef.current = true;

    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }

    ttsService.stop();

    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
    } else {
      setIsSubmitting(true);
      try {
        if (user?.id) {
          await studyService.finishStudySession(user.id);
        }
      } catch (err) {
        console.warn('[QuizView] finishStudySession failed, skipping to completion view:', err);
      } finally {
        setIsSubmitting(false);
        transitionLockRef.current = false;
      }
      onCompleteQuizStep();
    }
  }, [questionIndex, totalQuestions, user?.id, onCompleteQuizStep]);

  const handleSelectOption = useCallback((index: number) => {
    if (isChecked || transitionLockRef.current) return;
    const thisSessionId = activeSessionIdRef.current;

    setSelectedOption(index);
    setIsChecked(true);

    const isCorrect = currentQuiz.options[index] === currentQuiz.correctAnswer;
    const targetLanguage = user?.targetLang || currentQuiz.word?.targetLang || 'en';
    const audioUrl = parseTtsAudioUrl(
      currentQuiz.word?.ttsAudioUrl,
      targetLanguage,
      'word',
      currentQuiz.word?.conceptId || currentQuiz.word?.id,
      currentQuiz.word?.category,
      currentQuiz.word?.difficultyLevel,
    );

    // Safe progression helper with session ID guard (Targeting ~950ms total feedback visibility)
    const scheduleNextTransition = (delayMs: number) => {
      if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = setTimeout(() => {
        // Prevent stale callbacks if user navigated away
        if (activeSessionIdRef.current === thisSessionId) {
          handleNextQuestion();
        }
      }, delayMs);
    };

    // Default 950ms feedback visibility window for normal cases
    scheduleNextTransition(950);

    const speakOptions = {
      text: currentQuiz.correctAnswer,
      language: targetLanguage,
      audioUrl,
      onEnd: () => {
        if (activeSessionIdRef.current === thisSessionId) {
          scheduleNextTransition(500); // 500ms grace after TTS finishes
        }
      },
      onError: () => {
        if (activeSessionIdRef.current === thisSessionId) {
          scheduleNextTransition(800);
        }
      },
    };

    if (isCorrect) {
      soundService.playCorrectSound();
      ttsService.speak(speakOptions);
    } else {
      Vibration.vibrate([0, 150, 100, 150]);
      soundService.playIncorrectSound();
      ttsService.speak(speakOptions);
    }

    if (user?.id && currentQuiz?.word) {
      const conceptId = currentQuiz.word.conceptId || currentQuiz.word.id;
      const elapsedMs = Date.now() - questionStartTimeRef.current;
      const slowResponse = elapsedMs > 3000;
      const rating: SrsRating = isCorrect
        ? slowResponse ? 'hard' : 'easy'
        : 'forgot';
      
      studyService.updateWordSrsResult(user.id, conceptId, rating).catch((err) => {
        console.warn('[QuizView] Failed to update SRS result:', err);
      });
    }
  }, [isChecked, currentQuiz, user?.targetLang, user?.id, handleNextQuestion]);

  if (!currentQuiz) {
    return (
      <EmptyState
        icon={<BookOpen size={28} color={theme.primary} />}
        title={t('study.preparingQuiz', 'Preparing Quiz')}
        subtitle={t('study.loadingQuestions', 'Loading questions...')}
      />
    );
  }

  const selectedOptionText = selectedOption !== null ? currentQuiz.options[selectedOption] : null;
  const isUserCorrect = isChecked && selectedOptionText === currentQuiz.correctAnswer;

  const rawQuestion = currentQuiz?.scenarioQuestion || currentQuiz?.word?.wordNative || '';
  const isClozeQuestion = currentQuiz?.type === 'cloze' || rawQuestion.includes('___');

  // Clean Concise Question Wording without Answer Clues
  const questionText = isClozeQuestion
    ? `${t('study.quizClozeQuestion', 'Fill in the blank')}\n"${rawQuestion.replace(/^Fill in the blank:\s*"?|"?$/gi, '').trim()}"`
    : t('study.selectWordForImage', '이 사진에 해당하는 단어를 선택하세요.');

  const feedbackMessage = isUserCorrect
    ? t('study.quizCorrect', { word: currentQuiz.word?.wordNative || '', answer: currentQuiz.correctAnswer })
    : t('study.quizIncorrect', { word: currentQuiz.word?.wordNative || '', answer: currentQuiz.correctAnswer });

  return (
    <View style={styles.container}>
      <QuizCanvas
        isChecked={isChecked}
        isCorrect={isUserCorrect}
        feedbackMessage={feedbackMessage}
      >
        <View style={styles.questionCardGroup}>
          {/* Question Card Block */}
          <View
            style={[
              styles.questionCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: isChecked ? (isUserCorrect ? theme.primary : theme.secondary) : theme.border,
                padding: isSmallScreen ? 14 : 18,
              },
            ]}
          >
            {/* Status Badge Row */}
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: isChecked
                      ? (isUserCorrect ? theme.successBg : theme.streakBg)
                      : (currentQuiz?.word?.isReview ? theme.streakBg : theme.successBg),
                    borderColor: isChecked
                      ? (isUserCorrect ? theme.successBorder : theme.streakBorder)
                      : (currentQuiz?.word?.isReview ? theme.streakBorder : theme.successBorder),
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  style={styles.badgeText}
                >
                  {isChecked
                    ? (isUserCorrect ? t('study.perfectAnswer', 'Correct Answer') : t('study.goodTry', 'Good Try'))
                    : (currentQuiz?.word?.isReview ? t('study.reviewWord', 'Review') : t('study.newWord', 'New'))}
                </Typography>
              </View>
            </View>

            {/* Matched Pure White Canvas Situation Image Viewport */}
            {!!quizImageUrl && (
              <View style={[styles.quizImageCard, { height: responsiveImageHeight, backgroundColor: '#FFFFFF', borderColor: theme.border }]}>
                <Image
                  source={{ uri: quizImageUrl }}
                  style={styles.quizImage}
                  resizeMode="contain"
                  onError={(e) => console.warn('[QuizView] Image load failed:', e.nativeEvent?.error)}
                />
              </View>
            )}

            {/* Clean Concise Question Text */}
            <Typography variant="cardTitle" color="textPrimary" align="center" style={styles.questionText}>
              {questionText}
            </Typography>
          </View>

          {/* 4 Answer Options Container (Standardized 56dp height & 12dp gap) */}
          <View style={styles.optionsContainer}>
            {currentQuiz.options.map((option, index) => (
              <QuizOptionButton
                key={index}
                option={option}
                index={index}
                isSelected={selectedOption === index}
                isChecked={isChecked}
                isCorrectAnswer={option === currentQuiz.correctAnswer}
                onSelect={() => handleSelectOption(index)}
                selectedOptionText={selectedOptionText}
                correctAnswer={currentQuiz.correctAnswer}
                t={t}
              />
            ))}
          </View>
        </View>
      </QuizCanvas>
    </View>
  );
});

QuizView.displayName = 'QuizView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  questionCardGroup: {
    flex: 1,
    justifyContent: 'center',
  },
  questionCard: {
    borderRadius: 24,
    borderWidth: 1,
    marginVertical: 4,
    shadowColor: '#2F3437',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  quizImageCard: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    padding: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizImage: {
    width: '100%',
    height: '100%',
  },
  questionText: {
    letterSpacing: 0.3,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    marginVertical: 4,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  optionsContainer: {
    gap: 12, // Exactly 12dp Option gap
    marginTop: 20, // Exactly 20dp Question -> Options spacing
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    height: 26,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontWeight: '700',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default QuizView;
