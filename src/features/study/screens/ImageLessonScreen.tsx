import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  useWindowDimensions,
  BackHandler,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Volume2, Turtle, Star, Eye, EyeOff, BookOpen } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { spacing, layout, radius } from '../../../shared/theme/spacing';
import { colors } from '../../../shared/theme/colors';
import { Typography } from '../../../shared/components/Typography';
import { Button } from '../../../shared/components/Button';
import { SkeletonCard } from '../../../shared/components/Skeleton';
import { EmptyState } from '../../../shared/components/EmptyState';
import { CompactHeader } from '../components/CompactHeader';

import { useAuthStore } from '../../../shared/stores/useAuthStore';
import { useStudyStore } from '../../../shared/stores/useStudyStore';
import { useSettingsStore } from '../../../shared/stores/useSettingsStore';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { lessonService } from '../../../application/services/lessonService';
import { progressService } from '../../../application/services/progressService';
import { studyService } from '../../../shared/services/studyService';
import { ttsService } from '../../../shared/services/ttsService';
import { saveStudiedWordToLocal } from '../../../shared/utils/studiedWordStorage';
import { getVocabularyImageUrl } from '../../../shared/utils/vocabularyImageMap';
import { parseTtsAudioUrl } from '../../../shared/utils/ttsStorage';
import { WordEntity } from '../../../domain/entities/Word';
import { LessonVocabulary } from '../../../domain/entities/LessonVocabulary';

export type ScreenState = 'learning' | 'sentence_learning';

interface ImageLessonScreenProps {
  lessonId?: string;
  onBack?: () => void;
  onNavigateToQuiz?: (lessonId: string) => void;
}

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

// IPA Pronunciation Formatting Normalizer: Guarantees 100% consistent /.../ slash format
function formatPhonetic(rawPhonetic?: string): string {
  if (!rawPhonetic) return '';
  const cleaned = rawPhonetic.trim().replace(/^[\[\/\\]+|[\]\/\\]+$/g, '');
  if (!cleaned) return '';
  return `/${cleaned}/`;
}

// Android Material Design Standard Specs
const MAIN_ICON_SIZE = 22; // Target Word main audio & favorite icon size (22dp)
const SMALL_ICON_SIZE = 16; // Sub-action clear icon size (16dp)
const MAIN_CHIP_SIZE = 48; // Android standard minimum touch target size (48x48dp)
const SMALL_CHIP_SIZE = 34; // Refined sub-action chip size (34x34dp)
const CHIP_RADIUS = radius.button; // Standard button border radius (16px)

export const ImageLessonScreen: React.FC<ImageLessonScreenProps> = React.memo(({
  lessonId = '11111111-1111-1111-1111-111111111111',
  onBack,
  onNavigateToQuiz,
}) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const insets = useSafeAreaInsets();

  const { height: windowHeight } = useWindowDimensions();

  // Responsive Image Viewport Height Scale for Android Screen Heights
  const imageHeight = useMemo(() => {
    if (windowHeight < 680) return 150; // Short screen compression (e.g. 360x640)
    if (windowHeight >= 850) return 220; // Tall screen expansion (e.g. 412x915)
    return 185; // Standard screen (e.g. 360x800, 390x844)
  }, [windowHeight]);

  // Dynamic Word Typography Scaling (Prevents word wrap break for long target words)
  const getWordFontSize = useCallback((wordStr?: string) => {
    if (!wordStr) return 32;
    const len = wordStr.length;
    if (len <= 8) return 32;
    if (len <= 12) return 26;
    return 22;
  }, []);

  const favoritesMap = useStudyStore((state) => state.favoritesMap);
  const setFavoriteStatus = useStudyStore((state) => state.setFavoriteStatus);

  const nativeLang = user?.nativeLang || 'ko';
  const targetLang = user?.targetLang || 'en';
  const displayLanguage = useSettingsStore((state) => state.displayLanguage);

  const isEnglishUser = useMemo(() => {
    return (nativeLang || 'ko').toLowerCase().startsWith('en');
  }, [nativeLang]);

  // i18n Multi-language UI Text Dictionary
  const uiText = useMemo(() => {
    if (isEnglishUser) {
      return {
        headerTitle: 'Lesson',
        revealMeaning: 'Reveal Meaning',
        nextWord: 'Next Word',
        startQuiz: 'Start Quiz',
        exampleLabel: 'Example',
        errorTitle: 'Unable to load lesson words',
        errorSubtitle: 'Word list is empty or a network error occurred.',
        retry: 'Retry',
        activeRecallToggle: 'Toggle Active Recall',
        playAudio: 'Play audio',
        playSlowAudio: 'Play slow audio (0.75x)',
        toggleFavorite: 'Toggle favorite',
      };
    }
    return {
      headerTitle: '학습',
      revealMeaning: '뜻 확인하기',
      nextWord: '다음 단어',
      startQuiz: '복습 퀴즈 시작하기',
      exampleLabel: '예문',
      errorTitle: '학습 단어를 불러올 수 없습니다',
      errorSubtitle: '레슨 단어 목록이 비어 있거나 네트워크 오류입니다.',
      retry: '다시 시도',
      activeRecallToggle: 'Active Recall 모드 토글',
      playAudio: '정속 음성 들려주기',
        playSlowAudio: '느린 음성 (0.75x)',
      toggleFavorite: '즐겨찾기 토글',
    };
  }, [isEnglishUser]);

  // Local State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const [isMeaningRevealed, setIsMeaningRevealed] = useState(false);
  const [enableActiveRecall, setEnableActiveRecall] = useState(true);

  // Single Audio Auto-Play Guard per Word Index
  const hasPlayedAudioRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  // Screen Unmount & Audio Cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      ttsService.stop();
    };
  }, []);

  // Unified Navigation Back Handler with TTS Cleanup
  const handleBack = useCallback(() => {
    ttsService.stop();
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/study');
    }
  }, [onBack, router]);

  // Android Hardware Back Listener
  useEffect(() => {
    const onHardwareBack = () => {
      handleBack();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => subscription.remove();
  }, [handleBack]);

  // TanStack Query: Fetch lesson vocabulary list
  const { data: rawLessonVocabs = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['lessonVocabularies', lessonId],
    queryFn: () => lessonService.getLessonVocabularies(lessonId),
    enabled: !!lessonId,
    staleTime: 0,
  });

  const { data: lesson } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => lessonService.getLessonById(lessonId),
    enabled: !!lessonId,
    staleTime: 1000 * 60 * 5,
  });

  const lessonTitle = displayLanguage === 'ko'
    ? lesson?.titleKo || lesson?.title || uiText.headerTitle
    : lesson?.titleEn || lesson?.title || uiText.headerTitle;

  // Map to unified Data Contract (LessonVocabulary)
  const lessonVocabularies: LessonVocabulary[] = useMemo(() => {
    return rawLessonVocabs.map((item) => {
      const vocab = item.vocabulary;
      const word = vocab ? getLangField(vocab, 'word', targetLang) || vocab.conceptCode : 'Word';
      const wordEn = vocab ? getLangField(vocab, 'word', 'en') || word : word;
      const meaning = vocab ? getLangField(vocab, 'word', nativeLang) || 'Meaning' : 'Meaning';
      const image_url = getVocabularyImageUrl(wordEn || vocab?.conceptCode || word);
      const example_sentence = vocab ? getLangField(vocab, 'example', targetLang) : '';
      const example_native = vocab ? getLangField(vocab, 'example', nativeLang) : '';
      const rawPhonetic = vocab ? getLangField(vocab, 'phonetic', targetLang) || getLangField(vocab, 'phonetic', 'en') : undefined;
      const phonetic = formatPhonetic(rawPhonetic);
      const tts_audio_url = vocab?.ttsAudioUrl || (vocab as any)?.tts_audio_url || undefined;

      return {
        id: item.vocabularyId || item.id,
        vocabularyId: item.vocabularyId,
        conceptCode: vocab?.conceptCode,
        category: vocab?.category,
        difficultyLevel: vocab?.difficultyLevel,
        word,
        imageWord: wordEn,
        meaning,
        image_url,
        example_sentence,
        example_native: example_native || undefined,
        phonetic: phonetic || undefined,
        tts_audio_url: tts_audio_url || undefined,
      };
    });
  }, [rawLessonVocabs, targetLang, nativeLang]);

  const totalCount = lessonVocabularies.length;
  const currentVocab: LessonVocabulary | undefined = lessonVocabularies[currentIndex];
  const isLastWord = currentIndex === totalCount - 1;

  // Audio Playback Helpers
  const handlePlayAudio = useCallback((text?: string, rate = 1.0, type: 'word' | 'example' = 'word', forceTts = false) => {
    if (!text) return;
    const conceptCode = currentVocab?.conceptCode || currentVocab?.word;
    const category = currentVocab?.category || 'greetings';
    const difficulty = currentVocab?.difficultyLevel || 'beginner';

    const rawAudioUrl = parseTtsAudioUrl(currentVocab?.tts_audio_url, targetLang, type, conceptCode, category, difficulty) || undefined;
    ttsService.speak({
      text,
      language: targetLang,
      audioUrl: rawAudioUrl,
      rate,
      forceTts,
    });
  }, [targetLang, currentVocab]);

  const handlePlaySlowAudio = useCallback((text?: string, type: 'word' | 'example' = 'word') => {
    if (!text) return;
    const conceptCode = currentVocab?.conceptCode || currentVocab?.word;
    const category = currentVocab?.category || 'greetings';
    const difficulty = currentVocab?.difficultyLevel || 'beginner';

    const slowType = type === 'word' ? 'word_slow' : 'example_slow' as const;
    const rawAudioUrl = parseTtsAudioUrl(currentVocab?.tts_audio_url, targetLang, slowType, conceptCode, category, difficulty) || undefined;
    ttsService.speak({ text, language: targetLang, audioUrl: rawAudioUrl, rate: 1.0 });
  }, [targetLang, currentVocab]);

  // Image prefetching
  useEffect(() => {
    setIsImageLoaded(false);
    setHasImageError(false);
    setIsMeaningRevealed(false);
    if (currentVocab?.image_url) {
      Image.prefetch(currentVocab.image_url).catch(() => {});
    }
    const nextVocab = lessonVocabularies[currentIndex + 1];
    if (nextVocab?.image_url) {
      Image.prefetch(nextVocab.image_url).catch(() => {});
    }
  }, [currentIndex, currentVocab?.image_url, lessonVocabularies]);

  // Single Auto Audio Playback Guard: Guarantees 1-time audio playback per word index
  useEffect(() => {
    // Browsers reject audio started from an effect without a user gesture.
    if (Platform.OS === 'web') return;
    if (hasPlayedAudioRef.current === currentIndex) return;
    if (!currentVocab?.word) return;

    let timer: NodeJS.Timeout;
    const playAudioOnce = () => {
      if (hasPlayedAudioRef.current !== currentIndex) {
        hasPlayedAudioRef.current = currentIndex;
        try {
          handlePlayAudio(currentVocab.word, 1.0);
        } catch (_err) {
          // Silent catch for browser autoplay restrictions before user gesture
        }
      }
    };

    if (isImageLoaded) {
      playAudioOnce();
    } else {
      timer = setTimeout(() => {
        playAudioOnce();
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentIndex, currentVocab?.word, isImageLoaded, handlePlayAudio]);

  // Persistence
  useEffect(() => {
    if (currentVocab?.word) {
      const userId = user?.id || 'guest_user';
      const wordEntity: WordEntity = {
        id: currentVocab.id,
        conceptId: currentVocab.id,
        wordTarget: currentVocab.word,
        imageWord: currentVocab.imageWord || currentVocab.word,
        wordNative: currentVocab.meaning,
        phonetic: currentVocab.phonetic || null,
        exampleSentence: currentVocab.example_sentence || null,
        exampleTarget: currentVocab.example_sentence || null,
        exampleNative: currentVocab.meaning,
        category: 'daily',
        isReview: true,
        createdAt: new Date().toISOString(),
        nativeLang,
        targetLang,
      };

      saveStudiedWordToLocal(userId, wordEntity);
    }
  }, [currentIndex, currentVocab, user?.id, nativeLang, targetLang]);

  // Next Word Progression
  const handleNextWord = useCallback(async () => {
    ttsService.stop();
    if (!isLastWord) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      if (isSubmitting) return;
      setIsSubmitting(true);

      try {
        if (user?.id) {
          if (lessonId) {
            await lessonService.markLessonComplete(lessonId);
            await progressService.updateLessonProgress(user.id, lessonId, 100);

            useStudyStore.getState().setTodayWords(
              lessonVocabularies.map((vocabItem): WordEntity => ({
                id: vocabItem.vocabularyId || vocabItem.id,
                conceptId: vocabItem.vocabularyId || vocabItem.id,
                wordTarget: vocabItem.word,
                wordNative: vocabItem.meaning,
                phonetic: vocabItem.phonetic || null,
                exampleSentence: vocabItem.example_sentence || null,
                exampleTarget: vocabItem.example_sentence || null,
                exampleNative: vocabItem.example_native || null,
                category: vocabItem.category || 'daily',
                isReview: false,
                createdAt: new Date().toISOString(),
                nativeLang,
                targetLang,
              }))
            );
          }
          await studyService.finishStudySession(user.id);
        }
      } catch (err) {
        console.warn('[ImageLessonScreen] Lesson completion update warning:', err);
      } finally {
        if (!isMountedRef.current) return;
        setIsSubmitting(false);
        if (onNavigateToQuiz) {
          onNavigateToQuiz(lessonId);
        } else {
          router.push({
            pathname: '/quiz',
            params: { lessonId },
          });
        }
      }
    }
  }, [isLastWord, isSubmitting, user?.id, lessonId, lessonVocabularies, nativeLang, targetLang, onNavigateToQuiz, router]);

  const handleMainButtonClick = useCallback(() => {
    if (enableActiveRecall && !isMeaningRevealed) {
      setIsMeaningRevealed(true);
    } else {
      handleNextWord();
    }
  }, [enableActiveRecall, isMeaningRevealed, handleNextWord]);

  const progressPercentage = totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;
  const isFavorite = currentVocab ? !!favoritesMap[currentVocab.id] : false;

  const handleToggleFavorite = useCallback(async () => {
    if (!currentVocab) return;
    const isFav = !!favoritesMap[currentVocab.id];
    setFavoriteStatus(currentVocab.id, !isFav);
    if (user?.id) {
      try {
        await studyService.toggleFavorite(user.id, currentVocab.id);
      } catch {
        if (isMountedRef.current) {
          setFavoriteStatus(currentVocab.id, isFav);
        }
      }
    }
  }, [currentVocab, favoritesMap, setFavoriteStatus, user?.id]);

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
        <CompactHeader title={lessonTitle} onBackPress={handleBack} />
        <View style={styles.loadingContainer}>
          <SkeletonCard />
        </View>
      </SafeAreaView>
    );
  }

  // Error & Empty State
  if (isError || totalCount === 0 || !currentVocab) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
        <CompactHeader title={lessonTitle} onBackPress={handleBack} />
        <View style={styles.errorContainer}>
          <EmptyState
            icon={<BookOpen size={36} color={theme.textSecondary} />}
            title={uiText.errorTitle}
            subtitle={uiText.errorSubtitle}
            actionLabel={uiText.retry}
            onAction={refetch}
          />
        </View>
      </SafeAreaView>
    );
  }

  const bottomInsetMargin = Math.max(insets.bottom, spacing.md);
  const scrollBottomPadding = bottomInsetMargin + 88;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.background} />

      {/* Top Header with Multi-language Dynamic Title */}
      <CompactHeader
        title={lessonTitle}
        onBackPress={handleBack}
        showProgress={true}
        currentStep={currentIndex + 1}
        totalCount={totalCount}
        progressPercentage={progressPercentage}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.responsiveContainer}>
          {/* 1. Situation Image Viewport Anchor */}
          <View style={[styles.situationViewport, { height: imageHeight, backgroundColor: '#FFFFFF', borderColor: theme.border }]}>
            {currentVocab.image_url && !hasImageError ? (
              <Image
                source={{ uri: currentVocab.image_url }}
                style={styles.situationImage}
                resizeMode="contain"
                onLoadEnd={() => setIsImageLoaded(true)}
                onError={() => { setHasImageError(true); setIsImageLoaded(true); }}
              />
            ) : (
              <View style={styles.noImageContainer}>
                {hasImageError && (
                  <Typography variant="caption" color="textSecondary" align="center">
                    {isEnglishUser ? 'Image not available' : '이미지가 없습니다'}
                  </Typography>
                )}
              </View>
            )}
          </View>

          {/* 2. Hybrid Center Flow Stage Canvas */}
          <View style={styles.contentCanvas}>
            {/* Native Meaning Section */}
            <View style={styles.meaningSection}>
              <TouchableOpacity
                style={styles.meaningCenterGroup}
                onPress={() => {
                  if (enableActiveRecall && !isMeaningRevealed) {
                    setIsMeaningRevealed(true);
                  }
                }}
                activeOpacity={enableActiveRecall && !isMeaningRevealed ? 0.7 : 1}
              >
                {enableActiveRecall && !isMeaningRevealed ? (
                  <View style={styles.blindPlaceholderBar} />
                ) : (
                  <Typography variant="sectionTitle" align="center" style={[styles.nativeMeaningText, { color: theme.textPrimary }]}>
                    {currentVocab.meaning}
                  </Typography>
                )}
              </TouchableOpacity>

              {/* Fixed Right Anchor Eye Switch Button */}
              <TouchableOpacity
                style={[
                  styles.smallChipButton,
                  styles.eyeSwitchAbsoluteRight,
                  { backgroundColor: theme.paperBg, borderColor: theme.paperBorder },
                ]}
                onPress={() => {
                  if (enableActiveRecall && !isMeaningRevealed) {
                    setIsMeaningRevealed(true);
                  } else {
                    setEnableActiveRecall((prev) => !prev);
                    setIsMeaningRevealed(false);
                  }
                }}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel={enableActiveRecall && !isMeaningRevealed ? uiText.revealMeaning : uiText.activeRecallToggle}
                accessibilityRole="button"
              >
                {enableActiveRecall && !isMeaningRevealed ? (
                  <Eye size={SMALL_ICON_SIZE} color={theme.textPrimary} />
                ) : (
                  <EyeOff size={SMALL_ICON_SIZE} color={theme.textSecondary} />
                )}
              </TouchableOpacity>
            </View>

            {/* Target Word Hero Typography */}
            <Typography
              variant="hero"
              align="center"
              style={[
                styles.targetWordText,
                {
                  color: theme.textPrimary,
                  fontSize: getWordFontSize(currentVocab.word),
                },
              ]}
            >
              {currentVocab.word}
            </Typography>

            {/* Phonetic Pronunciation Typography */}
            {!!currentVocab.phonetic && (
              <Typography variant="body" align="center" style={[styles.phoneticText, { color: theme.textSecondary }]}>
                {currentVocab.phonetic}
              </Typography>
            )}

            {/* Word Action Toolbar */}
            <View style={styles.audioActionRowCenter}>
              {/* Normal Speed TTS */}
              <TouchableOpacity
                style={[styles.mainChipButton, { backgroundColor: theme.paperBg, borderColor: theme.paperBorder }]}
                onPress={() => handlePlayAudio(currentVocab.word, 1.0)}
                activeOpacity={0.7}
                accessibilityLabel={uiText.playAudio}
                accessibilityRole="button"
              >
                <Volume2 size={MAIN_ICON_SIZE} color={theme.textPrimary} />
              </TouchableOpacity>

              {/* Slow Turtle TTS */}
              <TouchableOpacity
                style={[styles.mainChipButton, { backgroundColor: theme.paperBg, borderColor: theme.paperBorder }]}
                onPress={() => handlePlaySlowAudio(currentVocab.word)}
                activeOpacity={0.7}
                accessibilityLabel={uiText.playSlowAudio}
                accessibilityRole="button"
              >
                <Turtle size={MAIN_ICON_SIZE} color={colors.primary} />
              </TouchableOpacity>

              {/* Favorite Star Action */}
              <TouchableOpacity
                style={[styles.mainChipButton, { backgroundColor: theme.paperBg, borderColor: theme.paperBorder }]}
                onPress={handleToggleFavorite}
                activeOpacity={0.7}
                accessibilityLabel={uiText.toggleFavorite}
                accessibilityRole="button"
              >
                <Star
                  size={MAIN_ICON_SIZE}
                  color={isFavorite ? '#F59E0B' : theme.textPrimary}
                  fill={isFavorite ? '#F59E0B' : 'transparent'}
                />
              </TouchableOpacity>
            </View>

            {/* Contextual Sentence Block */}
            {!!currentVocab.example_sentence && (
              <View style={[styles.sentenceContainer, { borderTopColor: theme.border }]}>
                <View style={styles.sentenceHeaderRow}>
                  <Typography variant="caption" style={[styles.sentenceLabel, { color: theme.textSecondary }]}>
                    {uiText.exampleLabel}
                  </Typography>

                  {/* Sentence Sub-Audio Action Row */}
                  <View style={styles.sentenceAudioGroup}>
                    <TouchableOpacity
                      style={[styles.smallChipButton, { backgroundColor: theme.paperBg, borderColor: theme.paperBorder }]}
                      onPress={() => handlePlayAudio(currentVocab.example_sentence, 1.0, 'example')}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel={uiText.playAudio}
                      accessibilityRole="button"
                    >
                      <Volume2 size={SMALL_ICON_SIZE} color={theme.textPrimary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.smallChipButton, { backgroundColor: theme.paperBg, borderColor: theme.paperBorder }]}
                      onPress={() => handlePlaySlowAudio(currentVocab.example_sentence, 'example')}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel={uiText.playSlowAudio}
                      accessibilityRole="button"
                    >
                      <Turtle size={SMALL_ICON_SIZE} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <Typography variant="cardTitle" style={[styles.exampleTargetText, { color: theme.textPrimary }]}>
                  {currentVocab.example_sentence}
                </Typography>

                {(!enableActiveRecall || isMeaningRevealed) && !!currentVocab.example_native && (
                  <Typography variant="body" style={[styles.exampleNativeText, { color: theme.textPrimary }]}>
                    {currentVocab.example_native}
                  </Typography>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Single Ergonomic 56dp Bottom Action Footer */}
      <View style={[styles.footerContainer, { backgroundColor: theme.background, paddingBottom: bottomInsetMargin }]}>
        <Button
          title={
            enableActiveRecall && !isMeaningRevealed
              ? uiText.revealMeaning
              : isLastWord
              ? uiText.startQuiz
              : uiText.nextWord
          }
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          onPress={handleMainButtonClick}
        />
      </View>
    </SafeAreaView>
  );
});

ImageLessonScreen.displayName = 'ImageLessonScreen';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing['2xl'] * 2,
  },
  responsiveContainer: {
    maxWidth: layout.maxContentWidthTablet,
    width: '100%',
    alignSelf: 'center',
    paddingTop: spacing.xs,
  },
  mainChipButton: {
    width: MAIN_CHIP_SIZE, // Android standard 48x48dp Touch Target
    height: MAIN_CHIP_SIZE,
    borderRadius: CHIP_RADIUS, // Standard 16px radius
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallChipButton: {
    width: SMALL_CHIP_SIZE, // Refined 34x34dp Sub-Action Touch Target
    height: SMALL_CHIP_SIZE,
    borderRadius: radius.md, // Standard 12px radius
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  situationViewport: {
    width: '100%',
    borderRadius: radius.cardLg,
    overflow: 'hidden',
    marginBottom: spacing.md, // 16px spacing between Image & Content
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Soft organic border line
  },
  situationImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  contentCanvas: {
    width: '100%',
    paddingHorizontal: spacing.xs,
  },
  meaningSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm, // Refined 8px spacing for breathing space
    minHeight: 48,
    position: 'relative',
    width: '100%',
  },
  meaningCenterGroup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeSwitchAbsoluteRight: {
    position: 'absolute',
    right: 0,
  },
  blindPlaceholderBar: {
    height: 32,
    width: 140,
  },
  nativeMeaningText: {
    fontWeight: '700',
    fontSize: 22,
    lineHeight: 28,
  },
  targetWordText: {
    letterSpacing: -0.5,
    marginBottom: 2, // Tight coupling with phonetic
    lineHeight: 38,
  },
  phoneticText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  audioActionRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm, // Unified 8pt grid gap
    marginTop: spacing.sm, // Refined 8px top margin (12px total from phonetic)
    marginBottom: spacing.md, // Refined 16px bottom margin for compact flow
  },
  sentenceContainer: {
    paddingTop: spacing.md, // 16px top padding
    borderTopWidth: 1,
    marginTop: 0, // Removed redundant margin for 24px total separation
  },
  sentenceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sentenceLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  sentenceAudioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm, // Unified 8pt grid gap
  },
  exampleTargetText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    marginTop: 2,
  },
  exampleNativeText: {
    marginTop: spacing.xs,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 0, // Removed top border line for clean seamless bottom surface
  },
});

export default ImageLessonScreen;
