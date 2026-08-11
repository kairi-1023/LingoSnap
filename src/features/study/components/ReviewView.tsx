import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2 } from 'lucide-react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { ProgressBar } from '../../../shared/components/ProgressBar';
import { Typography } from '../../../shared/components/Typography';
import { SkeletonCard } from '../../../shared/components/Skeleton';
import { EmptyState } from '../../../shared/components/EmptyState';
import { useStudyStore } from '../../../shared/stores/useStudyStore';
import { useAuthStore } from '../../../shared/stores/useAuthStore';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { studyService } from '../../../shared/services/studyService';
import { ttsService } from '../../../shared/services/ttsService';
import { parseTtsAudioUrl } from '../../../shared/utils/ttsStorage';
import { SrsRating } from '../../../domain/repositories/IStudyRepository';
import { WordEntity } from '../../../domain/entities/Word';
import { FavoriteButton } from './FavoriteButton';
import { AudioPlayButton } from './AudioPlayButton';
import { ExampleSentenceSection } from './ExampleSentenceSection';

interface ReviewViewProps {
  onCompleteReview: () => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({ onCompleteReview }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const favoritesMap = useStudyStore((state) => state.favoritesMap);
  const setFavoritesMap = useStudyStore((state) => state.setFavoritesMap);
  const setFavoriteStatus = useStudyStore((state) => state.setFavoriteStatus);
  const { isDarkMode, theme } = useThemeStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewList, setReviewList] = useState<WordEntity[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingExampleNormal, setIsPlayingExampleNormal] = useState(false);
  const [isPlayingExampleSlow, setIsPlayingExampleSlow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Card opacity animation for fast interaction
  const cardOpacity = useSharedValue(1);

  const isMountedRef = React.useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      ttsService.stop();
    };
  }, []);

  useEffect(() => {
    async function loadReviewWords() {
      setIsLoading(true);
      try {
        const words = await studyService.getDueReviewWords(user?.id, user?.nativeLang, user?.targetLang);
        if (isMountedRef.current) {
          setReviewList(words);
        }

        if (user?.id) {
          const favWords = await studyService.getFavoriteWords(user.id, user?.nativeLang, user?.targetLang);
          if (isMountedRef.current) {
            const map: Record<string, boolean> = {};
            favWords.forEach((w) => {
              map[w.id] = true;
            });
            setFavoritesMap(map);
          }
        }
      } catch (err) {
        // ignore
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    }

    loadReviewWords();
    return () => {
      isMountedRef.current = false;
    };
  }, [user?.id, setFavoritesMap]);

  const currentItem = reviewList[currentIndex];
  const activeCount = reviewList.length || 1;
  const progressRatio = reviewList.length > 0 ? (currentIndex + 1) / activeCount : 0;
  const isFavorite = currentItem ? !!favoritesMap[currentItem.id] : false;

  const targetTextNorm = currentItem?.wordTarget?.trim().toLowerCase() || '';
  const exampleTargetNorm = (currentItem?.exampleTarget || currentItem?.exampleSentence || '').trim().toLowerCase();
  const isSentenceDuplicate = currentItem?.category === 'sentence' || (!!targetTextNorm && !!exampleTargetNorm && targetTextNorm === exampleTargetNorm);

  const toggleFavorite = async () => {
    if (!currentItem) return;
    const nextFav = !isFavorite;
    setFavoriteStatus(currentItem.id, nextFav);

    if (user?.id) {
      try {
        await studyService.toggleFavorite(user.id, currentItem.id);
      } catch (err) {
        setFavoriteStatus(currentItem.id, !nextFav);
      }
    }
  };

  const handleAudioPlay = () => {
    if (!currentItem) return;
    setIsPlayingExampleNormal(false);
    setIsPlayingExampleSlow(false);
    setIsPlayingAudio(true);
    const targetLanguage = user?.targetLang || currentItem.targetLang || 'en';
    const audioUrl = parseTtsAudioUrl(currentItem.ttsAudioUrl, targetLanguage, 'word');
    ttsService.speak({
      text: currentItem.wordTarget,
      language: targetLanguage,
      audioUrl,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const sentenceText = (currentItem?.exampleTarget || currentItem?.exampleSentence || '').trim();
  const hasValidSentence = !!sentenceText && sentenceText !== '\u201cNo example sentence provided.\u201d';

  const handleExampleAudioPlay = () => {
    if (!currentItem || !hasValidSentence) return;
    setIsPlayingAudio(false);
    setIsPlayingExampleSlow(false);
    setIsPlayingExampleNormal(true);
    const targetLanguage = user?.targetLang || currentItem.targetLang || 'example';
    const audioUrl = parseTtsAudioUrl(currentItem.ttsAudioUrl, targetLanguage, 'example');
    ttsService.speak({
      text: sentenceText,
      language: targetLanguage,
      audioUrl,
      rate: 1.0,
      onEnd: () => setIsPlayingExampleNormal(false),
      onError: () => setIsPlayingExampleNormal(false),
    });
  };

  const handleSlowExampleAudioPlay = () => {
    if (!currentItem || !hasValidSentence) return;
    setIsPlayingAudio(false);
    setIsPlayingExampleNormal(false);
    setIsPlayingExampleSlow(true);
    const targetLanguage = user?.targetLang || currentItem.targetLang || 'example';
    const audioUrl = parseTtsAudioUrl(currentItem.ttsAudioUrl, targetLanguage, 'example');
    ttsService.speak({
      text: sentenceText,
      language: targetLanguage,
      audioUrl,
      rate: 0.85,
      onEnd: () => setIsPlayingExampleSlow(false),
      onError: () => setIsPlayingExampleSlow(false),
    });
  };

  const handleRatingAction = (rating: SrsRating) => {
    // Fast interaction feedback animation
    cardOpacity.value = withTiming(0.4, { duration: 100 }, () => {
      cardOpacity.value = withTiming(1, { duration: 150 });
    });

    if (!currentItem) return;

    // Record SRS spaced repetition result in background with 3-stage rating
    if (user?.id && (currentItem.conceptId || currentItem.id)) {
      studyService
        .updateWordSrsResult(user.id, currentItem.conceptId || currentItem.id, rating)
        .catch((err) => {
          console.warn('[ReviewView] Failed to update SRS result:', err);
        });
    }

    if (currentIndex < reviewList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      onCompleteReview();
    }
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  if (isLoading && reviewList.length === 0) {
    return (
      <View style={[styles.container, { paddingVertical: 16 }]}>
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  if (!currentItem) {
    return (
      <EmptyState
        icon={<CheckCircle2 size={28} color={colors.primary} />}
        title={t('study.allCaughtUp')}
        subtitle={t('study.allCaughtUpSubtitle')}
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        // Dynamic bottom clearance for the fixed BottomTabBar (DESIGN.md §7.2)
        { paddingBottom: 64 + insets.bottom + 16 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.innerContainer}>
        <View style={styles.contentGroup}>
          {/* 1. Today's Review Count & Progress Indicator */}
          <View style={styles.headerSection}>
            <View style={styles.countRow}>
              <Typography variant="caption" color="textSecondary" style={{ fontWeight: '600' }}>
                {t('study.wordsDue', { count: activeCount })}
              </Typography>
              <Typography variant="caption" color="primary" style={{ fontWeight: '700' }}>
                {currentIndex + 1} / {activeCount}
              </Typography>
            </View>
            <ProgressBar progress={progressRatio} height={8} color={colors.primary} />
          </View>

          {/* 2. Vocabulary Flash Card */}
          <Animated.View style={[styles.reviewCard, animatedCardStyle, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <AudioPlayButton
                isPlaying={isPlayingAudio}
                onPress={handleAudioPlay}
                chip={false}
                accessibilityLabel={t('study.playPronunciation')}
              />
              <FavoriteButton
                isFavorite={isFavorite}
                onToggle={toggleFavorite}
                accessibilityLabel={t(isFavorite ? 'study.removeFromFavorites' : 'study.addToFavorites')}
              />
            </View>

            {/* Question Word Display: Target Learning Language */}
            <View style={styles.wordBody}>
              <Typography variant="hero" color="textPrimary" align="center" style={styles.nativeWord}>
                {currentItem.wordTarget}
              </Typography>
              {currentItem.phonetic && (
                <View style={[styles.pronunciationTag, { backgroundColor: theme.insetSurface, borderColor: theme.border }]}>
                  <Typography variant="caption" color="textSecondary" align="center">
                    {currentItem.phonetic}
                  </Typography>
                </View>
              )}

              {showAnswer ? (
                <View style={styles.answerBox}>
                  <Typography variant="sectionTitle" color="textPrimary" align="center" style={styles.targetWord}>
                    {currentItem.wordNative}
                  </Typography>
                  {!isSentenceDuplicate && (
                    <ExampleSentenceSection
                      sentenceText={sentenceText}
                      hasValidSentence={hasValidSentence}
                      isPlayingExampleNormal={isPlayingExampleNormal}
                      isPlayingExampleSlow={isPlayingExampleSlow}
                      onPlayExampleNormal={handleExampleAudioPlay}
                      onPlayExampleSlow={handleSlowExampleAudioPlay}
                      nativeTranslation={currentItem.exampleNative}
                      t={t}
                    />
                  )}
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.revealButton, { backgroundColor: theme.insetSurface, borderColor: theme.border }]}
                  activeOpacity={0.8}
                  onPress={() => setShowAnswer(true)}
                >
                  <Typography variant="bodyLarge" color="primary">
                    {t('study.tapToReveal')}
                  </Typography>
                </TouchableOpacity>
              )}
            </View>

            {/* 3. Inset Minimal Rating Buttons (Inside Card Footer) */}
            <View style={styles.cardFooterRatingContainer}>
              <TouchableOpacity
                style={[
                  styles.minimalRatingButton,
                  {
                    backgroundColor: theme.fillSubtle,
                    borderColor: theme.border,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => handleRatingAction('forgot')}
              >
                <Typography variant="caption" style={{ fontWeight: '700', color: theme.textPrimary }}>
                  {t('study.forgot')}
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.minimalRatingButton,
                  {
                    backgroundColor: theme.streakBg,
                    borderColor: theme.streakBorder,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => handleRatingAction('hard')}
              >
                <Typography variant="caption" style={{ fontWeight: '700', color: theme.warningText }}>
                  {t('study.hard')}
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.minimalRatingButton,
                  {
                    backgroundColor: theme.successBg,
                    borderColor: theme.successBorder,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => handleRatingAction('easy')}
              >
                <Typography variant="caption" style={{ fontWeight: '700', color: colors.primary }}>
                  {t('study.easy')}
                </Typography>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  contentGroup: {
    gap: 12,
    marginBottom: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerSection: {
    marginBottom: 8,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reviewCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    marginVertical: 6,
    minHeight: 180,
    justifyContent: 'space-between',
    // Subtle shadow (DESIGN.md §7.4)
    shadowColor: '#2F3437',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  wordBody: {
    alignItems: 'center',
    marginVertical: 10,
  },
  nativeWord: {
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  pronunciationTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 6,
  },
  revealButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 10,
  },
  answerBox: {
    alignItems: 'stretch',
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 0,
    paddingVertical: 2,
  },
  targetWord: {
    marginBottom: 4,
  },
  cardFooterRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  minimalRatingButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

export default ReviewView;
