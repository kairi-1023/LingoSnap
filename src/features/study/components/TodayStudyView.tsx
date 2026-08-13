import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import { BookOpen } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { spacing } from '../../../shared/theme/spacing';
import { Typography } from '../../../shared/components/Typography';
import { SkeletonCard } from '../../../shared/components/Skeleton';
import { EmptyState } from '../../../shared/components/EmptyState';
import { useHomeScreen } from '../../home/hooks/useHomeScreen';
import { LessonCard } from '../../home/components/LessonCard';

export const TodayStudyView: React.FC = React.memo(() => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const {
    user,
    theme,
    lessons,
    lessonProgressMap,
    isLessonsLoading,
    isLessonsError,
    refetchLessons,
    handleSelectLesson,
  } = useHomeScreen();


  const getLessonOrder = (lesson: typeof lessons[number]) => {
    const title = lesson.titleEn || lesson.title || '';
    const lessonNumber = title.match(/lesson\s*\:?\s*(\d+)/i)?.[1];
    return lessonNumber ? Number(lessonNumber) : lesson.displayOrder || Number.MAX_SAFE_INTEGER;
  };

  const sortByLessonOrder = (a: typeof lessons[number], b: typeof lessons[number]) => {
    const aOrder = getLessonOrder(a);
    const bOrder = getLessonOrder(b);
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.createdAt.localeCompare(b.createdAt);
  };

  const isLessonCompleted = useCallback(
    (lesson: typeof lessons[number]) => {
      const progress = lessonProgressMap[lesson.id] || 0;
      if (progress >= 100) return true;
      if (lesson.userId && user?.id && lesson.userId === user.id && !!lesson.completedAt) return true;
      return false;
    },
    [lessonProgressMap, user?.id]
  );

  const incompleteLessons = lessons
    .filter((lesson) => !isLessonCompleted(lesson))
    .sort(sortByLessonOrder);
  const completedLessons = lessons
    .filter((lesson) => isLessonCompleted(lesson))
    .sort(sortByLessonOrder);


  const renderLessonCard = (lesson: typeof lessons[number]) => (
    <LessonCard
      key={lesson.id}
      lesson={lesson}
      progressPercent={lessonProgressMap[lesson.id] || 0}
      theme={theme}
      variant="simple"
      onSelectLesson={handleSelectLesson}
    />
  );


  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { paddingBottom: 64 + insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.lessonSection}>
        <Typography variant="sectionTitle" style={[styles.sectionHeaderTitle, { color: theme.textPrimary }]}> 
          {t('study.recommendedLessons')}
        </Typography>
        <Typography variant="body" color="textSecondary" style={{ marginBottom: spacing.md }}>
          {t('study.recommendedLessonsSubtitle')}
        </Typography>

        {isLessonsLoading ? (
          <View style={styles.skeletonList}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : isLessonsError ? (
          <EmptyState
            icon={<BookOpen size={28} color={theme.textSecondary} />}
            title={t('study.lessonsLoadErrorTitle')}
            subtitle={t('study.lessonsLoadErrorSubtitle')}
            actionLabel={t('common.retry', 'Retry')}
            onAction={refetchLessons}
          />
        ) : lessons.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={28} color={theme.textSecondary} />}
            title={t('study.noLessonsTitle')}
            subtitle={t('study.noLessonsSubtitle')}
            actionLabel={t('common.refresh', 'Refresh')}
            onAction={refetchLessons}
          />
        ) : (
          <>
            {incompleteLessons.length > 0 && (
              <View style={styles.lessonGroup}>
                <Typography variant="cardTitle" style={[styles.groupTitle, { color: theme.textPrimary }]}>
                  {t('study.incompleteLessons')}
                </Typography>
                <View style={styles.lessonList}>{incompleteLessons.map(renderLessonCard)}</View>
              </View>
            )}

            {completedLessons.length > 0 && (
              <View style={styles.lessonGroup}>
                <Typography variant="cardTitle" style={[styles.groupTitle, { color: theme.textPrimary }]}>
                  {t('study.completedLessons')}
                </Typography>
                <View style={styles.lessonList}>{completedLessons.map(renderLessonCard)}</View>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
});

TodayStudyView.displayName = 'TodayStudyView';

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  lessonSection: {
    marginTop: spacing.xs,
  },
  sectionHeaderTitle: {
    marginBottom: 4,
  },
  skeletonList: {
    gap: spacing.md,
  },
  lessonList: {
    gap: spacing.sm,
  },
  lessonGroup: {
    marginBottom: spacing.lg,
  },
  groupTitle: {
    marginBottom: spacing.sm,
  },
});

export default TodayStudyView;
