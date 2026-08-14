import React from 'react';
import { View, StyleSheet, Image, Pressable, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, CheckCircle, Clock, Play } from 'lucide-react-native';
import { Typography } from '../../../shared/components/Typography';
import { spacing } from '../../../shared/theme/spacing';
import { colors } from '../../../shared/theme/colors';
import { ThemeColors, useThemeStore } from '../../../shared/stores/useThemeStore';
import { AILessonEntity } from '../../../domain/entities/AILesson';
import { useSettingsStore } from '../../../shared/stores/useSettingsStore';
import { useAuthStore } from '../../../shared/stores/useAuthStore';
import { getVocabularyImageUrl } from '../../../shared/utils/vocabularyImageMap';
import { Card } from '../../../shared/components/Card';


interface LessonCardProps {
  lesson: AILessonEntity;
  lessonNumber?: number;
  progressPercent?: number;
  theme: ThemeColors;
  variant?: 'hero' | 'simple';
  onSelectLesson: (lessonId: string) => void;
}

export const LessonCard: React.FC<LessonCardProps> = React.memo(({
  lesson,
  lessonNumber,
  progressPercent = 0,
  theme,
  variant = 'simple',
  onSelectLesson,
}) => {
  const { t } = useTranslation();
  const displayLanguage = useSettingsStore((state) => state.displayLanguage);
  const user = useAuthStore((state) => state.user);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const isCompleted = progressPercent >= 100 || (!!user?.id && lesson.userId === user.id && !!lesson.completedAt);

  const imageUrl = getVocabularyImageUrl(
    lesson.representativeWord || lesson.titleEn || lesson.title || 'family'
  );

  const rawTitle = displayLanguage === 'ko' ? (lesson.titleKo || lesson.title) : (lesson.titleEn || lesson.title);
  const cleanTitle = rawTitle ? rawTitle.replace(/^Lesson\s*\d+[:.\s]*/i, '').trim() : '';
  const cardTitle = lessonNumber ? `Lesson ${lessonNumber}: ${cleanTitle}` : rawTitle;
  const cardDescription = displayLanguage === 'ko' ? (lesson.descriptionKo || lesson.description) : (lesson.descriptionEn || lesson.description);

  const isStarted = progressPercent > 0 && !isCompleted;
  const clampedProgress = Math.min(100, Math.max(0, progressPercent));

  if (variant === 'simple') {
    return (
      <Card
        radius="large"
        padding={8}
        bg={theme.cardBackground}
        borderColor={theme.border}
        elevation="soft"
        style={styles.simpleContainer}
      >
        <Pressable
          onPress={() => onSelectLesson(lesson.id)}
          accessibilityRole="button"
          accessibilityLabel={cardTitle}
          android_ripple={{
            color: isDarkMode
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.06)',
          }}
          style={[
            styles.simplePressable,
            {
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}
        >
          {/* IMAGE */}
          <View
            style={[
              styles.simpleImageWrapper,
              {
                borderColor: theme.border,
              },
            ]}
          >
            <Image
              source={imageUrl ? { uri: imageUrl } : undefined}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </View>

          {/* TEXT */}
          <View style={styles.simpleContentWrapper}>
            <Typography
              numberOfLines={1}
              style={[
                styles.simpleTitle,
                { color: theme.textPrimary },
              ]}
            >
              {lessonNumber
                ? `Lesson ${lessonNumber}: ${cardTitle}`
                : cardTitle}
            </Typography>

            {!!cardDescription && (
              <Typography
                numberOfLines={1}
                style={[
                  styles.simpleDescription,
                  { color: theme.textSecondary },
                ]}
              >
                {cardDescription}
              </Typography>
            )}
          </View>

          {/* ARROW */}
          <View
            style={[
              styles.simpleIconBadge,
              {
                backgroundColor: theme.fillSubtle,
              },
            ]}
          >
            <ArrowRight
              size={22}
              color={theme.textSecondary}
              strokeWidth={2}
            />
          </View>
        </Pressable>
      </Card>
    );
  }

  return (
    <Card
      radius="large"
      padding="md"
      bg={theme.cardBackground}
      borderColor={isStarted ? colors.primary : theme.border}
      elevation="medium"
      style={styles.heroContainer}
    >
      <Pressable
        style={({ pressed }) => [
          styles.pressableInner,
          pressed && Platform.OS !== 'android' && { opacity: 0.9, transform: [{ scale: 0.99 }] },
        ]}
        android_ripple={{
          color: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(92, 184, 92, 0.14)',
          borderless: false,
        }}
        onPress={() => onSelectLesson(lesson.id)}
        accessibilityRole="button"
        accessibilityLabel={cardTitle}
      >
        {/* 상단 5 Min Daily Lesson 뱃지 */}
        <View style={styles.topBadgeRow}>
          <View style={[styles.heroBadge, { backgroundColor: theme.fillSubtle }]}>
            <Clock size={13} color={colors.primary} />
            <Typography variant="caption" style={[styles.heroBadgeText, { color: theme.textSecondary }]}>
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
            <Typography variant="cardTitle" numberOfLines={2} style={[styles.title, { color: theme.textPrimary }]}>
              {cardTitle}
            </Typography>

            {!!cardDescription && (
              <Typography variant="caption" numberOfLines={2} style={[styles.description, { color: theme.textSecondary }]}>
                {cardDescription}
              </Typography>
            )}
          </View>
        </View>

        {/* 진행률 바 (진행중일 때만) */}
        {isStarted && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeaderRow}>
              <Typography variant="caption" style={{ color: theme.textSecondary, fontSize: 12 }}>
                {t('home.lessonProgress', { defaultValue: '진행도' })}
              </Typography>
              <Typography variant="caption" style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>
                {`${Math.round(clampedProgress)}%`}
              </Typography>
            </View>
            <View style={[styles.progressBarTrack, { backgroundColor: theme.fillSubtle }]}>
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
    marginBottom: 14,
  },

  simplePressable: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: 96,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },

  simpleImageWrapper: {
    width: 76,
    height: 76,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    flexShrink: 0,
    marginRight: 16,
  },

  simpleContentWrapper: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },

  simpleTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    marginBottom: 5,
  },

  simpleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },

  simpleIconBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginLeft: 12,
  },
  heroContainer: {
    marginBottom: 12,
  },
  pressableInner: {
    width: '100%',
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
    aspectRatio: 1,
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
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    justifyContent: 'center',
    marginRight: 8,
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
    minHeight: 48,
    paddingVertical: 10,
    paddingHorizontal: 12,
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





