import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Turtle, ChevronDown, Volume2 } from 'lucide-react-native';
import { Typography } from '../../../shared/components/Typography';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { useAuthStore } from '../../../shared/stores/useAuthStore';
import { colors } from '../../../shared/theme/colors';
import { ttsService } from '../../../shared/services/ttsService';
import { parseTtsAudioUrl } from '../../../shared/utils/ttsStorage';
import { WordEntity } from '../../../domain/entities/Word';
import { spacing } from '../../../shared/theme/spacing';
import { FavoriteButton } from './FavoriteButton';
import { ExampleSentenceSection } from './ExampleSentenceSection';
import { STUDY_CATEGORIES, CategoryId } from '../../../shared/constants/categories';

interface StudyWordCardProps {
  word: WordEntity;
  isReview?: boolean;
  activeCategory?: string;
  onSelectCategory?: (catId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  t?: (...args: any[]) => any;
}

export const StudyWordCard: React.FC<StudyWordCardProps> = React.memo(({
  word,
  isReview = false,
  activeCategory = 'all',
  onSelectCategory,
  isFavorite = false,
  onToggleFavorite,
  t,
}) => {
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);

  const [isPlayingAudioNormal, setIsPlayingAudioNormal] = useState(false);
  const [isPlayingAudioSlow, setIsPlayingAudioSlow] = useState(false);
  const [isPlayingExampleNormal, setIsPlayingExampleNormal] = useState(false);
  const [isPlayingExampleSlow, setIsPlayingExampleSlow] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    setIsPlayingAudioNormal(false);
    setIsPlayingAudioSlow(false);
    setIsPlayingExampleNormal(false);
    setIsPlayingExampleSlow(false);
  }, [word.id]);

  const currentCategoryObj = STUDY_CATEGORIES.find((c) => c.id === activeCategory) || STUDY_CATEGORIES[0];
  const categoryLabel = t ? t(`study.categories.${currentCategoryObj.id}`, currentCategoryObj.label) : currentCategoryObj.label;

  const handleSelectCategoryItem = (catId: CategoryId) => {
    setIsCategoryModalOpen(false);
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  const targetTextNorm = word?.wordTarget?.trim().toLowerCase() || '';
  const exampleTargetNorm = (word?.exampleTarget || word?.exampleSentence || '').trim().toLowerCase();
  const isSentenceDuplicate = word?.category === 'sentence' || (!!targetTextNorm && !!exampleTargetNorm && targetTextNorm === exampleTargetNorm);

  const handleAudioPlay = () => {
    setIsPlayingExampleNormal(false);
    setIsPlayingExampleSlow(false);
    setIsPlayingAudioSlow(false);
    setIsPlayingAudioNormal(true);
    const targetLanguage = user?.targetLang || word.targetLang || 'en';
    const audioUrl = parseTtsAudioUrl(
      word.ttsAudioUrl,
      targetLanguage,
      'word',
      word.conceptId || word.id,
      word.category,
      word.difficultyLevel,
    );
    ttsService.speak({
      text: word.wordTarget,
      language: targetLanguage,
      audioUrl,
      rate: 1.0,
      onEnd: () => setIsPlayingAudioNormal(false),
      onError: () => setIsPlayingAudioNormal(false),
    });
  };

  const handleSlowAudioPlay = () => {
    setIsPlayingExampleNormal(false);
    setIsPlayingExampleSlow(false);
    setIsPlayingAudioNormal(false);
    setIsPlayingAudioSlow(true);
    const targetLanguage = user?.targetLang || word.targetLang || 'en';
    const audioUrl = parseTtsAudioUrl(
      word.ttsAudioUrl,
      targetLanguage,
      'word_slow',
      word.conceptId || word.id,
      word.category,
      word.difficultyLevel,
    );
    ttsService.speak({
      text: word.wordTarget,
      language: targetLanguage,
      audioUrl,
      rate: 1.0,
      onEnd: () => setIsPlayingAudioSlow(false),
      onError: () => setIsPlayingAudioSlow(false),
    });
  };

  const sentenceText = (word?.exampleTarget || word?.exampleSentence || '').trim();
  const hasValidSentence = !!sentenceText && sentenceText !== '\u201cNo example sentence provided.\u201d';

  const handleExampleAudioPlay = () => {
    if (!hasValidSentence) return;
    setIsPlayingAudioNormal(false);
    setIsPlayingAudioSlow(false);
    setIsPlayingExampleSlow(false);
    setIsPlayingExampleNormal(true);
    const targetLanguage = user?.targetLang || word.targetLang || 'en';
    const audioUrl = parseTtsAudioUrl(
      word.ttsAudioUrl,
      targetLanguage,
      'example',
      word.conceptId || word.id,
      word.category,
      word.difficultyLevel,
    );
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
    if (!hasValidSentence) return;
    setIsPlayingAudioNormal(false);
    setIsPlayingAudioSlow(false);
    setIsPlayingExampleNormal(false);
    setIsPlayingExampleSlow(true);
    const targetLanguage = user?.targetLang || word.targetLang || 'en';
    const audioUrl = parseTtsAudioUrl(
      word.ttsAudioUrl,
      targetLanguage,
      'example_slow',
      word.conceptId || word.id,
      word.category,
      word.difficultyLevel,
    );
    ttsService.speak({
      text: sentenceText,
      language: targetLanguage,
      audioUrl,
      rate: 1.0,
      onEnd: () => setIsPlayingExampleSlow(false),
      onError: () => setIsPlayingExampleSlow(false),
    });
  };

  const playPronunciationLabel = t ? t('study.playPronunciation') : 'Play pronunciation';

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      {/* Card Header: Left = Status Badge & Category Picker, Right = Favorite */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeftGroup}>
          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isReview ? theme.streakBg : theme.successBg,
                borderColor: isReview ? theme.streakBorder : theme.successBorder,
              },
            ]}
          >
            <Typography
              variant="caption"
              style={{
                fontWeight: '700',
                color: isReview ? theme.streakText : colors.primary,
                fontSize: 14,
              }}
            >
              {t ? t(isReview ? 'study.reviewWord' : 'study.newWord') : isReview ? 'Review' : 'New'}
            </Typography>
          </View>

          {/* Category Dropdown Badge */}
          {onSelectCategory && (
            <TouchableOpacity
              style={[
                styles.categoryBadge,
                {
                  backgroundColor: theme.insetSurface,
                  borderColor: theme.border,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => setIsCategoryModalOpen(true)}
              accessibilityLabel={t ? t('study.changeCategory', 'Change Category') : 'Change Category'}
              accessibilityRole="button"
            >
              <Typography variant="caption" color="textPrimary" style={{ fontWeight: '600', fontSize: 14 }}>
                {categoryLabel}
              </Typography>
              <ChevronDown size={16} color={theme.textSecondary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.headerRightActions}>
          {onToggleFavorite && (
            <FavoriteButton
              isFavorite={isFavorite}
              onToggle={onToggleFavorite}
              size={40}
              accessibilityLabel={t ? t(isFavorite ? 'study.removeFromFavorites' : 'study.addToFavorites') : 'Toggle Favorite'}
            />
          )}
        </View>
      </View>

      {/* 1. Hero Word Section (Target Word -> Combined Phonetic & Audio Chip -> Native Meaning) */}
      <View style={styles.wordHeroContainer}>
        {/* Main Target Word */}
        <Typography variant="hero" color="textPrimary" align="center" style={styles.targetWord}>
          {word.wordTarget}
        </Typography>

        {/* Phonetic & Audio Interactive Chip + Slow Mode Turtle Pill Container */}
        <View style={[styles.audioPillContainer, { backgroundColor: theme.insetSurface, borderColor: theme.border }]}>
          <TouchableOpacity
            style={[
              styles.combinedPhoneticChip,
              {
                backgroundColor: isPlayingAudioNormal ? theme.successBg : 'transparent',
                borderColor: isPlayingAudioNormal ? theme.primary : 'transparent',
              },
            ]}
            activeOpacity={0.7}
            onPress={handleAudioPlay}
            accessibilityLabel={playPronunciationLabel}
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
          >
            <Volume2
              size={22}
              color={isPlayingAudioNormal ? theme.primary : theme.textSecondary}
            />
            {word.phonetic ? (
              <Typography
                variant="caption"
                align="center"
                style={[
                  styles.phoneticChipText,
                  { color: isPlayingAudioNormal ? theme.primary : theme.textSecondary },
                ]}
              >
                {word.phonetic}
              </Typography>
            ) : null}
          </TouchableOpacity>

          <View style={[styles.pillDivider, { backgroundColor: theme.border }]} />

          <TouchableOpacity
            style={[
              styles.slowAudioButton,
              {
                backgroundColor: isPlayingAudioSlow ? theme.successBg : 'transparent',
                borderColor: isPlayingAudioSlow ? theme.primary : 'transparent',
              },
            ]}
            activeOpacity={0.7}
            onPress={handleSlowAudioPlay}
            accessibilityLabel={t ? t('study.slowMode', 'Play slowly (0.75x)') : 'Play slowly (0.75x)'}
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}
          >
            <Turtle
              size={24}
              color={isPlayingAudioSlow ? theme.primary : theme.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Native Language Meaning */}
        <Typography variant="cardTitle" color="textSecondary" align="center" style={styles.nativeWord}>
          {word.wordNative}
        </Typography>
      </View>

      {/* 2. Example Sentence Section */}
      {!isSentenceDuplicate && (
        <ExampleSentenceSection
          sentenceText={sentenceText}
          hasValidSentence={hasValidSentence}
          isPlayingExampleNormal={isPlayingExampleNormal}
          isPlayingExampleSlow={isPlayingExampleSlow}
          onPlayExampleNormal={handleExampleAudioPlay}
          onPlayExampleSlow={handleSlowExampleAudioPlay}
          nativeTranslation={word.exampleNative}
          t={t}
        />
      )}

      {/* Category Selection Modal */}
      <Modal
        visible={isCategoryModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCategoryModalOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsCategoryModalOpen(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                <Typography variant="cardTitle" color="textPrimary" style={{ marginBottom: spacing.sm }}>
                  {t ? t('study.selectCategory', 'Select Category') : 'Select Category'}
                </Typography>
                {STUDY_CATEGORIES.map((cat) => {
                  const isSelected = cat.id === activeCategory;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.modalItem,
                        {
                          backgroundColor: isSelected ? theme.successBg : 'transparent',
                          borderColor: isSelected ? theme.primary : 'transparent',
                        },
                      ]}
                      onPress={() => handleSelectCategoryItem(cat.id)}
                    >
                      <Typography
                        variant="body"
                        color={isSelected ? 'primary' : 'textPrimary'}
                        style={{ fontWeight: isSelected ? '700' : '400' }}
                      >
                        {t ? t(`study.categories.${cat.id}`, cat.label) : cat.label}
                      </Typography>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
});

StudyWordCard.displayName = 'StudyWordCard';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    marginVertical: 8,
    minHeight: 180,
    justifyContent: 'space-between',
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
    marginBottom: 16,
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    height: 40,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  audioPillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 4,
    marginVertical: 6,
  },
  pillDivider: {
    width: 1,
    height: 20,
    marginHorizontal: 2,
  },
  slowAudioButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  wordHeroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginVertical: 6,
  },
  targetWord: {
    letterSpacing: 0.5,
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 6,
  },
  combinedPhoneticChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  phoneticChipText: {
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.4,
  },
  nativeWord: {
    marginTop: 8,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    padding: spacing.md,
    borderWidth: 1,
  },
  modalItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 2,
  },
});
