import React from 'react';
import { View, StyleSheet, Image, Pressable, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, CheckCircle, Clock, Play } from 'lucide-react-native';
import { Typography } from '../../../shared/components/Typography';
import { spacing } from '../../../shared/theme/spacing';
import { colors } from '../../../shared/theme/colors';
import { ThemeColors } from '../../../shared/stores/useThemeStore';
import { AILessonEntity } from '../../../domain/entities/AILesson';
import { useSettingsStore } from '../../../shared/stores/useSettingsStore';
import { useAuthStore } from '../../../shared/stores/useAuthStore';
import { getVocabularyImageUrl } from '../../../shared/utils/vocabularyImageMap';
import { Card } from '../../../shared/components/Card';


interface LessonCardProps {
  lesson: AILessonEntity;
  progressPercent?: number;
  theme: ThemeColors;
  variant?: 'hero' | 'simple';
  onSelectLesson: (lessonId: string) => void;
}

export const LessonCard: React.FC<LessonCardProps> = React.memo(({
  lesson,
  progressPercent = 0,
  theme,
  variant = 'hero',
  onSelectLesson,
}) => {
  const { t } = useTranslation();
  const displayLanguage = useSettingsStore((state) => state.displayLanguage);
  const user = useAuthStore((state) => state.user);
  const isCompleted = progressPercent >= 100 || (!!user?.id && lesson.userId === user.id && !!lesson.completedAt);

  const imageUrl = getVocabularyImageUrl(
    lesson.representativeWord || lesson.titleEn || lesson.title || 'family'
  );

  const cardTitle = displayLanguage === 'ko' ? (lesson.titleKo || lesson.title) : (lesson.titleEn || lesson.title);
  const cardDescription = displayLanguage === 'ko' ? (lesson.descriptionKo || lesson.description) : (lesson.descriptionEn || lesson.description);

  const isStarted = progressPercent > 0 && !isCompleted;
  const clampedProgress = Math.min(100, Math.max(0, progressPercent));

  if (variant === 'simple') {
    return (
      <Card
        radius="normal"
        padding={0}
        bg={theme.cardBackground}
        borderColor={isStarted ? colors.primary : theme.border}
        elevation="soft"
        style={styles.simpleContainer}
      >
        <Pressable
          style={({ pressed }) => [
            styles.simplePressable,
            pressed && Platform.OS !== 'android' && { opacity: 0.85 },
          ]}
          android_ripple={{
            color: theme.isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            borderless: false,
          }}
          onPress={() => onSelectLesson(lesson.id)}
          accessibilityRole="button"
          accessibilityLabel={cardTitle}
        >
          <View style={[styles.simpleImageWrapper, { backgroundColor: '#FFFFFF', borderColor: theme.border }]}>
            <Image
              source={imageUrl ? { uri: imageUrl } : undefined}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.contentWrapper}>
            <Typography variant="cardTitle" numberOfLines={1} style={[styles.simpleTitle, { color: theme.textPrimary }]}>
              {cardTitle}
            </Typography>

            {!!cardDescription && (
              <Typography variant="caption" numberOfLines={1} style={[styles.description, { color: theme.textSecondary }]}>
                {cardDescription}
              </Typography>
            )}
          </View>

          <View style={styles.simpleActionArea}>
            {isCompleted ? (
              <View style={[styles.simpleIconBadge, { backgroundColor: theme.successBg }]}>
                <CheckCircle size={16} color={colors.primary} />
              </View>
            ) : (
              <View style={[styles.simpleIconBadge, { backgroundColor: theme.fillSubtle }]}>
                <ArrowRight size={16} color={theme.textSecondary} />
              </View>
            )}
          </View>
        </Pressable>
      </Card>
    );
  }

  return (
    <Card
      radius="large"
      padding={0}
      bg={theme.isDarkMode ? theme.cardBackground : '#F4F9F4'}
      borderColor={isStarted ? colors.primary : '#D8ECD8'}
      elevation="medium"
      style={styles.heroContainer}
    >
      <Pressable
        style={({ pressed }) => [
          styles.pressableInner,
          pressed && Platform.OS !== 'android' && { opacity: 0.9, transform: [{ scale: 0.99 }] },
        ]}
        android_ripple={{
          color: theme.isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(92, 184, 92, 0.14)',
          borderless: false,
        }}
        onPress={() => onSelectLesson(lesson.id)}
        accessibilityRole="button"
        accessibilityLabel={cardTitle}
      >
        {/* 상단 5 Min Daily Lesson 뱃지 */}
        <View style={styles.topBadgeRow}>
          <View style={[styles.heroBadge, { backgroundColor: colors.primary + '20' }]}>
            <Clock size={14} color={colors.primary} />
            <Typography variant="caption" style={styles.heroBadgeText}>
              {isCompleted
                ? t('study.lessonCompleted')
                : isStarted
                ? t('home.continueLesson')
                : '5 Min Daily Lesson'}
            </Typography>
          </View>

          {isCompleted && (
            <View style={[styles.completedStatusBadge, { backgroundColor: theme.successBg }]}>
              <CheckCircle size={14} color={colors.primary} />
            </View>
          )}
        </View>

        {/* 본문 콘텐츠 & 일러스트 썸네일 */}
        <View style={styles.mainBody}>
          <View style={[styles.imageWrapper, { backgroundColor: '#FFFFFF', borderColor: theme.border }]}>
            <Image
              source={imageUrl ? { uri: imageUrl } : undefined}
              style={styles.cardImage}
              resizeMode="contain"
              onError={(e) => console.warn('[LessonCard] Image load failed:', e.nativeEvent?.error)}
            />
          </View>

          <View style={styles.contentWrapper}>
            <Typography variant="cardTitle" numberOfLines={1} style={[styles.title, { color: theme.textPrimary }]}>
              {cardTitle}
            </Typography>

            {!!cardDescription && (
              <Typography variant="caption" numberOfLines={1} style={[styles.description, { color: theme.textSecondary }]}>
                {cardDescription}
              </Typography>
            )}
          </View>
        </View>

        {/* 진행률 바 (진행중일 때만) */}
        {isStarted && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeaderRow}>
              <Typography variant="micro" style={{ color: theme.textSecondary }}>
                {t('home.lessonProgress', { defaultValue: '진행도' })}
              </Typography>
              <Typography variant="micro" style={{ color: colors.primary, fontWeight: '700' }}>
                {`${Math.round(clampedProgress)}%`}
              </Typography>
            </View>
            <View style={[styles.progressBarTrack, { backgroundColor: theme.isDarkMode ? theme.fillSubtle : '#E2F0E2' }]}>
              <View
                style={[
                  styles.progressBarFill,
                  { backgroundColor: colors.primary, width: `${clampedProgress}%` },
                ]}
              />
            </View>
          </View>
        )}

        {/* 하단 Primary Action CTA Button (Height: 48dp) */}
        <View style={[styles.ctaButton, { backgroundColor: colors.primary }]}>
          {isCompleted ? (
            <>
              <BookOpen size={18} color="#FFFFFF" />
              <Typography variant="body" style={styles.ctaText}>
                {t('home.reviewWords', { defaultValue: '다시 학습하기' })}
              </Typography>
            </>
          ) : (
            <>
              <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
              <Typography variant="body" style={styles.ctaText}>
                {isStarted
                  ? t('home.continueLesson', { defaultValue: '레슨 이어하기' })
                  : t('home.startNextLesson', { defaultValue: '다음 레슨 시작하기' })}
              </Typography>
              <ArrowRight size={18} color="#FFFFFF" style={{ marginLeft: 2 }} />
            </>
          )}
        </View>
      </Pressable>
    </Card>
  );
});


LessonCard.displayName = 'LessonCard';

const styles = StyleSheet.create({
  simpleContainer: {
    marginBottom: 8,
  },
  simplePressable: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  simpleImageWrapper: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#FAFAFA',
  },
  simpleTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  simpleActionArea: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simpleIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContainer: {
    marginBottom: 12,
  },
  pressableInner: {
    padding: spacing.md,
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 5,
  },
  heroBadgeText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  completedStatusBadge: {
    padding: 3,
    borderRadius: 10,
  },
  mainBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  imageWrapper: {
    width: 68,
    height: 68,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#FAFAFA',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {

    fontSize: 18,
    lineHeight: 23,
    fontWeight: '700',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    lineHeight: 17,
  },
  progressSection: {
    marginTop: 6,
    marginBottom: 6,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  ctaButton: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});





