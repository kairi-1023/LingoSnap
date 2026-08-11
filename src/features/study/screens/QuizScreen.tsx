import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw, BookOpen, Volume2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { spacing, layout } from '../../../shared/theme/spacing';
import { colors } from '../../../shared/theme/colors';
import { Typography } from '../../../shared/components/Typography';
import { Button } from '../../../shared/components/Button';
import { SkeletonCard } from '../../../shared/components/Skeleton';
import { EmptyState } from '../../../shared/components/EmptyState';
import { CompactHeader } from '../components/CompactHeader';
import { BottomTabBar, TabType } from '../../../shared/components/BottomTabBar';

import { useAuthStore } from '../../../shared/stores/useAuthStore';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { quizService } from '../../../application/services/quizService';
import { reviewService } from '../../../application/services/reviewService';
import { progressService } from '../../../application/services/progressService';
import { soundService } from '../../../shared/services/soundService';
import { ttsService } from '../../../shared/services/ttsService';

import { AIQuizQuestionEntity } from '../../../domain/entities/AIQuiz';

import { aiLessonRepository } from '../../../infrastructure/supabase/aiLessonRepository';
import { shuffle } from '../../../shared/utils/arrayUtils';
import { getVocabularyImageUrl } from '../../../shared/utils/vocabularyImageMap';

function getLangField<T extends Record<string, any>>(obj: T, prefix: string, langCode: string): string {
  if (!obj) return '';
  const cap = langCode.charAt(0).toUpperCase() + langCode.slice(1).toLowerCase();
  const camelKey = `${prefix}${cap}`;
  const snakeKey = `${prefix}_${langCode.toLowerCase()}`;

  if (camelKey in obj && obj[camelKey]) return String(obj[camelKey]);
  if (snakeKey in obj && obj[snakeKey]) return String(obj[snakeKey]);

  const fallbackCamel = `${prefix}En`;
  const fallbackSnake = `${prefix}_en`;
  if (fallbackCamel in obj && obj[fallbackCamel]) return String(obj[fallbackCamel]);
  if (fallbackSnake in obj && obj[fallbackSnake]) return String(obj[fallbackSnake]);

  return '';
}

export type QuizScreenState = 'loading' | 'question' | 'correct' | 'incorrect' | 'completed';

interface QuizScreenProps {
  quizId?: string;
  lessonId?: string;
  onBack?: () => void;
  onNavigateToReview?: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = React.memo(({
  quizId = 'c0000000-0000-0000-0000-000000000001',
  lessonId = 'c0000000-0000-0000-0000-000000000001',
  onBack,
  onNavigateToReview,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);

  // 1. Local React State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenState, setScreenState] = useState<QuizScreenState>('question');
  const [selectedOption, setSelectedOption] = useState<any | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. TanStack Query: Fetch Lesson Vocabularies to build 10 Image-to-Word Quiz Questions
  const { data: rawLessonVocabs = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['lessonVocabulariesQuiz', lessonId],
    queryFn: () => aiLessonRepository.getLessonVocabularies(lessonId),
    enabled: !!lessonId,
    staleTime: 0,
  });

  const questions: AIQuizQuestionEntity[] = useMemo(() => {
    const targetLang = user?.targetLang || 'en';
    const nativeLang = user?.nativeLang || 'ko';

    const words = rawLessonVocabs.map((item) => {
      const vocab = item.vocabulary;
      const word = vocab ? getLangField(vocab, 'word', targetLang) || vocab.conceptCode : 'Word';
      const wordEn = vocab ? getLangField(vocab, 'word', 'en') || word : word;
      const meaning = vocab ? getLangField(vocab, 'word', nativeLang) || 'Meaning' : 'Meaning';
      const rawImage = vocab?.imageUrl || undefined;
      const imageUrl = getVocabularyImageUrl(wordEn || vocab?.conceptCode || word, rawImage);
      return { id: item.vocabularyId || item.id, word, meaning, imageUrl };
    });

    const finalWords = words;

    return finalWords.slice(0, 10).map((item, idx) => {
      const otherWords = finalWords.filter((w) => w.word !== item.word).map((w) => w.word);
      const shuffledOthers = shuffle(otherWords).slice(0, 3);
      const options = shuffle([item.word, ...shuffledOthers]);

      return {
        id: `q_${idx + 1}`,
        quizId: quizId || 'lesson-quiz',
        questionType: 'IMAGE_TO_WORD',
        questionText: t('quiz.selectWordForImage', '이 사진에 해당하는 단어를 선택하세요.'),
        correctAnswer: item.word,
        options,
        questionData: {
          imageUrl: item.imageUrl,
          vocabularyId: item.id,
          word: item.word,
          meaning: item.meaning,
        },
        createdAt: new Date().toISOString(),
      };
    });
  }, [rawLessonVocabs, user?.targetLang, user?.nativeLang, quizId, t]);

  const totalQuestions = questions.length;
  const currentQuestion: AIQuizQuestionEntity | undefined = questions[currentIndex];

  // Normalize Question Type
  const normalizedType: 'IMAGE_TO_WORD' | 'WORD_TO_IMAGE' | 'SENTENCE_COMPLETION' = useMemo(() => {
    if (!currentQuestion) return 'IMAGE_TO_WORD';
    const typeStr = String(currentQuestion.questionType).toUpperCase();
    if (typeStr.includes('WORD_TO_IMAGE')) return 'WORD_TO_IMAGE';
    if (typeStr.includes('SENTENCE') || typeStr.includes('CLOZE')) return 'SENTENCE_COMPLETION';
    return 'IMAGE_TO_WORD';
  }, [currentQuestion]);

  // Parse Options
  const parsedOptions: any[] = useMemo(() => {
    if (!currentQuestion?.options) return [];
    if (Array.isArray(currentQuestion.options)) return currentQuestion.options;
    return [];
  }, [currentQuestion]);

  // 3. Handle Next Question / Quiz Final Completion
  const handleNextQuestion = useCallback(async () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setScreenState('question');
    } else {
      // Final Completion
      setIsSubmitting(true);
      const finalScorePct = Math.round((correctAnswersCount / (totalQuestions || 1)) * 100);

      try {
        if (user?.id && lessonId) {
          await quizService.createQuiz({
            lessonId,
            userId: user.id,
            score: finalScorePct,
            completed: true,
          });
          await progressService.updateLessonProgress(user.id, lessonId, finalScorePct);
        }
      } catch (err) {
        console.warn('[QuizScreen] Final quiz submission warning:', err);
      } finally {
        setIsSubmitting(false);
        setScreenState('completed');
      }
    }
  }, [currentIndex, totalQuestions, correctAnswersCount, user?.id, lessonId]);

  // 4. Handle Option Selection & SRS Review Update
  const handleSelectOption = useCallback(async (option: any) => {
    if (screenState !== 'question' || !currentQuestion) return;

    setSelectedOption(option);
    const selectedText = typeof option === 'string' ? option : option?.text || option?.word || option?.url || '';
    const isCorrect = selectedText.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

    const vocabularyId = currentQuestion.questionData?.vocabularyId || currentQuestion.id;

    const targetLang = user?.targetLang || 'en';
    let hasAdvanced = false;

    const advanceToNext = () => {
      if (hasAdvanced) return;
      hasAdvanced = true;
      setTimeout(() => {
        handleNextQuestion();
      }, 950);
    };

    ttsService.speak({
      text: currentQuestion.correctAnswer,
      language: targetLang,
      onEnd: advanceToNext,
      onError: advanceToNext,
    });

    // Safety fallback timer if onEnd is delayed on some web browsers
    setTimeout(advanceToNext, 2000);

    if (isCorrect) {
      setScreenState('correct');
      setCorrectAnswersCount((prev) => prev + 1);
      soundService.playCorrectSound();
      if (user?.id && vocabularyId) {
        try {
          await reviewService.upsertReviewItem(user.id, vocabularyId, 'easy');
        } catch (err) {
          console.warn('[QuizScreen] SRS Easy rating update warning:', err);
        }
      }
    } else {
      setScreenState('incorrect');
      soundService.playIncorrectSound();
      if (user?.id && vocabularyId) {
        try {
          await reviewService.upsertReviewItem(user.id, vocabularyId, 'forgot');
        } catch (err) {
          console.warn('[QuizScreen] SRS Forgot rating update warning:', err);
        }
      }
    }
  }, [screenState, currentQuestion, user?.id, user?.targetLang, handleNextQuestion]);

  const handleRestartQuiz = useCallback(() => {
    setCurrentIndex(0);
    setCorrectAnswersCount(0);
    setSelectedOption(null);
    setScreenState('question');
  }, []);

  const handleBottomTabPress = useCallback(
    (tab: TabType) => {
      if (tab === 'home') router.push('/(tabs)');
      else if (tab === 'study') router.push('/(tabs)/study');
      else if (tab === 'review') router.push({ pathname: '/(tabs)/study', params: { tab: 'review' } });
      else if (tab === 'dictionary') router.push({ pathname: '/(tabs)/study', params: { tab: 'dictionary' } });
      else if (tab === 'profile') router.push('/(tabs)/profile');
    },
    [router]
  );

  const progressPercentage = totalQuestions > 0 ? ((currentIndex + (screenState === 'completed' ? 1 : 0)) / totalQuestions) * 100 : 0;
  const finalScorePercentage = Math.round((correctAnswersCount / (totalQuestions || 1)) * 100);

  // 5. Loading State
  if (isLoading || screenState === 'loading') {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <CompactHeader title={t('quiz.title', 'Quiz')} onBackPress={onBack || (() => router.back())} />
        <View style={styles.centerContainer}>
          <SkeletonCard />
        </View>
      </SafeAreaView>
    );
  }

  // 6. Error & Empty State
  if (isError || totalQuestions === 0 || !currentQuestion) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <CompactHeader title={t('quiz.title', 'Quiz')} onBackPress={onBack || (() => router.back())} />
        <View style={styles.centerContainer}>
          <EmptyState
            icon={<BookOpen size={36} color={theme.textSecondary} />}
            title={t('quiz.errorTitle', '퀴즈 문항을 불러올 수 없습니다')}
            subtitle={t('quiz.errorSubtitle', '사전 생성된 퀴즈 문항이 없거나 네트워크 오류입니다.')}
            actionLabel={t('common.retry', '다시 시도')}
            onAction={refetch}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.background} />

      <CompactHeader
        title={t('quiz.title', 'Quiz')}
        onBackPress={onBack || (() => router.back())}
        showProgress={true}
        progressPercentage={progressPercentage}
        currentStep={screenState === 'completed' ? totalQuestions : currentIndex + 1}
        totalCount={totalQuestions}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.tabletWrapper}>
            {screenState !== 'completed' ? (
              <>
                {/* 1. IMAGE_TO_WORD Question Type */}
                {normalizedType === 'IMAGE_TO_WORD' && (
                  <View style={styles.questionSection}>
                    {!!currentQuestion.questionData?.imageUrl && (
                      <View style={[styles.quizImageCard, { backgroundColor: '#FFFFFF', borderColor: theme.border }]}>
                        <Image
                          source={{ uri: currentQuestion.questionData.imageUrl }}
                          style={styles.quizImage}
                          resizeMode="contain"
                        />
                      </View>
                    )}
                    <Typography variant="sectionTitle" style={[styles.questionTitle, { color: theme.textPrimary }]}>
                      {currentQuestion.questionText || t('quiz.selectWordForImage', '이 사진에 해당하는 단어를 선택하세요.')}
                    </Typography>
                  </View>
                )}

                {/* 2. WORD_TO_IMAGE Question Type */}
                {normalizedType === 'WORD_TO_IMAGE' && (
                  <View style={styles.questionSection}>
                    <View style={[styles.wordCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                      <Typography variant="screenTitle" style={[styles.wordTitle, { color: colors.primary }]}>
                        {currentQuestion.questionText || currentQuestion.questionData?.word || 'Word'}
                      </Typography>
                    </View>
                    <Typography variant="cardTitle" style={[styles.questionTitle, { color: theme.textPrimary }]}>
                      {t('quiz.selectImageForWord', '알맞은 상황 사진을 선택하세요.')}
                    </Typography>
                  </View>
                )}

                {/* 3. SENTENCE_COMPLETION Question Type */}
                {normalizedType === 'SENTENCE_COMPLETION' && (
                  <View style={styles.questionSection}>
                    <View style={[styles.clozeCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                      <Typography variant="sectionTitle" style={[styles.clozeText, { color: theme.textPrimary }]}>
                        {currentQuestion.questionText || 'I ___ an apple.'}
                      </Typography>
                    </View>
                    <Typography variant="body" style={[styles.questionTitle, { color: theme.textSecondary }]}>
                      {t('quiz.selectWordForBlank', '빈칸에 들어갈 알맞은 단어를 선택하세요.')}
                    </Typography>
                  </View>
                )}

                {/* 4. Options Grid / List */}
                <View style={styles.optionsContainer}>
                  {normalizedType === 'WORD_TO_IMAGE' ? (
                    <View style={styles.imageGrid}>
                      {parsedOptions.map((opt, idx) => {
                        const optUrl = typeof opt === 'string' ? opt : opt?.url || opt?.imageUrl;
                        const isSelected = selectedOption === opt;
                        const isCorrectOpt = optUrl === currentQuestion.correctAnswer;

                        let borderColor = theme.border;
                        if (screenState === 'correct' && isCorrectOpt) borderColor = colors.success;
                        if (screenState === 'incorrect' && isSelected) borderColor = colors.error;

                        return (
                          <TouchableOpacity
                            key={idx}
                            style={[
                              styles.imageOptionCard,
                              { backgroundColor: '#FFFFFF', borderColor, borderWidth: isSelected || (screenState === 'correct' && isCorrectOpt) ? 3 : 1 },
                            ]}
                            onPress={() => handleSelectOption(opt)}
                            disabled={screenState !== 'question'}
                            activeOpacity={0.8}
                          >
                            <Image source={{ uri: optUrl }} style={styles.optionGridImage} resizeMode="contain" />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : (
                    <View style={styles.textOptionList}>
                      {parsedOptions.map((opt, idx) => {
                        const optText = typeof opt === 'string' ? opt : opt?.text || opt?.word || '';
                        const isSelected = selectedOption === opt;
                        const isCorrectOpt = optText.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();

                        let backgroundColor = theme.cardBackground;
                        let borderColor = theme.border;
                        let textColor = theme.textPrimary;
                        let badgeIcon = null;

                        if ((screenState === 'correct' || screenState === 'incorrect') && isCorrectOpt) {
                          backgroundColor = '#E8F5E9';
                          borderColor = colors.success;
                          textColor = '#2E7D32';
                          badgeIcon = <CheckCircle2 size={20} color={colors.success} />;
                        } else if (screenState === 'incorrect' && isSelected && !isCorrectOpt) {
                          backgroundColor = '#FFEBEE';
                          borderColor = colors.error;
                          textColor = '#C62828';
                          badgeIcon = <XCircle size={20} color={colors.error} />;
                        }

                        return (
                          <TouchableOpacity
                            key={idx}
                            style={[
                              styles.textOptionCard,
                              { backgroundColor, borderColor, borderWidth: isSelected || isCorrectOpt ? 2 : 1 },
                            ]}
                            onPress={() => handleSelectOption(opt)}
                            disabled={screenState !== 'question'}
                            activeOpacity={0.7}
                          >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: spacing.sm }}>
                              <Typography variant="body" style={[styles.optionText, { color: textColor, flex: 1, textAlign: 'center' }]}>
                                {optText}
                              </Typography>
                              {badgeIcon}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>

                {/* 5. Immediate Natural Feedback Card */}
                {screenState === 'correct' && (
                  <TouchableOpacity
                    style={[styles.feedbackCard, { backgroundColor: '#E8F5E9', borderColor: colors.success }]}
                    activeOpacity={0.8}
                    onPress={() => ttsService.speak({ text: currentQuestion.correctAnswer, language: user?.targetLang || 'en' })}
                  >
                    <CheckCircle2 size={24} color={colors.success} />
                    <View style={{ marginLeft: 8, flex: 1 }}>
                      <Typography variant="cardTitle" style={{ color: '#2E7D32', includeFontPadding: false, textAlignVertical: 'center' }}>
                        {t('quiz.correctFeedback', '정답입니다! ({{word}})', { word: currentQuestion.correctAnswer })}
                      </Typography>
                    </View>
                    <Volume2 size={20} color="#2E7D32" />
                  </TouchableOpacity>
                )}

                {screenState === 'incorrect' && (
                  <TouchableOpacity
                    style={[styles.feedbackCard, { backgroundColor: '#FFEBEE', borderColor: colors.error }]}
                    activeOpacity={0.8}
                    onPress={() => ttsService.speak({ text: currentQuestion.correctAnswer, language: user?.targetLang || 'en' })}
                  >
                    <XCircle size={24} color={colors.error} />
                    <View style={{ marginLeft: 8, flex: 1 }}>
                      <Typography variant="cardTitle" style={{ color: '#C62828', includeFontPadding: false, textAlignVertical: 'center' }}>
                        {t('quiz.incorrectFeedback', '아쉽네요!')}
                      </Typography>
                      <Typography variant="caption" style={{ color: '#C62828', marginTop: 2, includeFontPadding: false, textAlignVertical: 'center' }}>
                        {t('quiz.correctAnswerLabel', '정답: {{word}}', { word: currentQuestion.correctAnswer })}
                      </Typography>
                    </View>
                    <Volume2 size={20} color="#C62828" />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              /* State 5: Quiz Completed Final Score View */
              <View style={styles.completedContainer}>
                <View style={[styles.trophyBadge, { backgroundColor: theme.paperBg }]}>
                  <Trophy size={56} color={colors.secondary} strokeWidth={2} />
                </View>

                <Typography variant="screenTitle" style={[styles.completedTitle, { color: theme.textPrimary }]}>
                  {t('quiz.completedTitle', '퀴즈 완료!')}
                </Typography>
                <Typography variant="body" style={[styles.completedSub, { color: theme.textSecondary }]}>
                  {t('quiz.completedSubtitle', '수고하셨습니다. 이번 퀴즈의 최종 성적입니다.')}
                </Typography>

                <View style={[styles.scoreCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                  <Typography variant="hero" style={{ color: colors.primary }}>
                    {finalScorePercentage}%
                  </Typography>
                  <Typography variant="caption" style={{ color: theme.textSecondary, marginTop: 4 }}>
                    {t('quiz.scoreDetail', '{{total}}문제 중 {{correct}}문제 정답', { total: totalQuestions, correct: correctAnswersCount })}
                  </Typography>
                </View>

                <View style={styles.actionButtonGroup}>
                  <Button
                    title={t('quiz.goToReview', '복습하기로 이동')}
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight size={20} color="#FFFFFF" />}
                    onPress={() => {
                      if (onNavigateToReview) onNavigateToReview();
                      else router.push({ pathname: '/(tabs)/study', params: { tab: 'review' } });
                    }}
                  />
                  <TouchableOpacity style={styles.restartBtn} onPress={handleRestartQuiz}>
                    <RotateCcw size={16} color={theme.textSecondary} />
                    <Typography variant="caption" style={{ color: theme.textSecondary, marginLeft: 6 }}>
                      {t('quiz.tryAgain', '다시 풀기')}
                    </Typography>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {screenState === 'completed' && (
          <BottomTabBar activeTab="study" onTabPress={handleBottomTabPress} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

QuizScreen.displayName = 'QuizScreen';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing['2xl'] * 2,
  },
  tabletWrapper: {
    maxWidth: layout.maxContentWidthTablet,
    width: '100%',
    alignSelf: 'center',
    paddingTop: spacing.xs,
  },
  questionSection: {
    alignItems: 'center',
    marginBottom: 20, // Exactly 20dp Image/Question spacing
  },
  quizImageCard: {
    width: '100%',
    height: 145, // ~145dp responsive image height
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16, // Exactly 16dp Image -> Question spacing
    borderWidth: 1,
    padding: spacing.xs,
  },
  quizImage: {
    width: '100%',
    height: '100%',
  },
  questionTitle: {
    textAlign: 'center',
    marginTop: spacing.xs,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  wordCard: {
    width: '100%',
    padding: spacing.xl,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  wordTitle: {
    fontSize: 36,
    fontWeight: '700',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  clozeCard: {
    width: '100%',
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  clozeText: {
    textAlign: 'center',
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  imageOptionCard: {
    width: '48%',
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    padding: spacing.xs,
  },
  optionGridImage: {
    width: '100%',
    height: '100%',
  },
  textOptionList: {
    gap: 12, // Exactly 12dp Option gap
  },
  textOptionCard: {
    height: 56, // Exactly 56dp Option height
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  feedbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 20, // Exactly ~20dp Option D -> Feedback spacing
    marginBottom: spacing.lg,
  },
  completedContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  trophyBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  completedTitle: {
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  completedSub: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  scoreCard: {
    width: '100%',
    padding: spacing.xl,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  actionButtonGroup: {
    width: '100%',
    gap: spacing.md,
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
});

export default QuizScreen;
