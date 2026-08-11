import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ArrowRight, BookOpen, CheckCircle } from 'lucide-react-native';
import { Typography } from '../../../shared/components/Typography';
import { ProgressBar } from '../../../shared/components/ProgressBar';
import { spacing } from '../../../shared/theme/spacing';
import { colors } from '../../../shared/theme/colors';
import { Theme } from '../../../shared/theme/theme';
import { AILessonEntity } from '../../../domain/entities/AILesson';

interface LessonCardProps {
  lesson: AILessonEntity;
  progressPercent?: number;
  theme: Theme;
  onSelectLesson: (lessonId: string) => void;
}

import { useSettingsStore } from '../../../shared/stores/useSettingsStore';
import { getVocabularyImageUrl } from '../../../shared/utils/vocabularyImageMap';

export const LessonCard: React.FC<LessonCardProps> = React.memo(({
  lesson,
  progressPercent = 0,
  theme,
  onSelectLesson,
}) => {
  const displayLanguage = useSettingsStore((state) => state.displayLanguage);
  const isCompleted = !!lesson.completedAt || progressPercent >= 100;
  const imageUrl = getVocabularyImageUrl(lesson.titleEn || lesson.title || 'family');

  const cardTitle = displayLanguage === 'ko' ? (lesson.titleKo || lesson.title) : (lesson.titleEn || lesson.title);
  const cardDescription = displayLanguage === 'ko' ? (lesson.descriptionKo || lesson.description) : (lesson.descriptionEn || lesson.description);

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
      ]}
      activeOpacity={0.8}
      onPress={() => onSelectLesson(lesson.id)}
    >
      <View style={[styles.imageWrapper, { backgroundColor: theme.surfaceHighlight }]}>
        <Image
          source={imageUrl ? { uri: imageUrl } : undefined}
          style={styles.cardImage}
          resizeMode="contain"
          onError={(e) => console.warn('[LessonCard] Image load failed:', e.nativeEvent?.error)}
        />
        {isCompleted && (
          <View style={[styles.completedBadge, { backgroundColor: theme.successBg }]}>
            <CheckCircle size={14} color={colors.primary} />
            <Typography variant="micro" style={{ color: colors.primary, fontWeight: '700', marginLeft: 4 }}>
              완료
            </Typography>
          </View>
        )}
      </View>

      <View style={styles.contentWrapper}>
        <Typography variant="cardTitle" numberOfLines={1} style={[styles.title, { color: theme.textPrimary }]}>
          {cardTitle}
        </Typography>

        {!!cardDescription && (
          <Typography variant="caption" numberOfLines={2} style={[styles.description, { color: theme.textSecondary }]}>
            {cardDescription}
          </Typography>
        )}

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <ProgressBar progressPercentage={progressPercent} height={6} />
          </View>
          <Typography variant="micro" style={[styles.progressText, { color: theme.textSecondary }]}>
            {Math.round(progressPercent)}%
          </Typography>
        </View>
      </View>

      <View style={styles.arrowIconWrapper}>
        <ArrowRight size={20} color={theme.textSecondary} />
      </View>
    </TouchableOpacity>
  );
});

LessonCard.displayName = 'LessonCard';

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginRight: spacing.md,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  completedBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    borderRadius: 8,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 2,
  },
  description: {
    marginBottom: spacing.xs,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  progressTrack: {
    flex: 1,
  },
  progressText: {
    fontWeight: '600',
    minWidth: 32,
    textAlign: 'right',
  },
  arrowIconWrapper: {
    marginLeft: spacing.xs,
  },
});
