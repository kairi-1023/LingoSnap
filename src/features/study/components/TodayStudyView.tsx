import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../../../shared/theme/spacing';
import { Typography } from '../../../shared/components/Typography';
import { SkeletonCard } from '../../../shared/components/Skeleton';
import { EmptyState } from '../../../shared/components/EmptyState';
import { useTranslation } from 'react-i18next';
import { useHomeScreen } from '../../home/hooks/useHomeScreen';
import { LessonCard } from '../../home/components/LessonCard';

interface TodayStudyViewProps {
  onCompleteStudyStep: () => void;
}

export const TodayStudyView: React.FC<TodayStudyViewProps> = React.memo(() => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const {
    theme,
    lessons,
    lessonProgressMap,
    isLessonsLoading,
    isLessonsError,
    refetchLessons,
    handleSelectLesson,
  } = useHomeScreen();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { paddingBottom: 64 + insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.lessonSection}>
        <Typography variant="h2" style={[styles.sectionHeaderTitle, { color: theme.textPrimary }]}>
          추천 레슨 (Recommended Lessons)
        </Typography>
        <Typography variant="body" color="textSecondary" style={{ marginBottom: spacing.md }}>
          시각적 사진과 함께 학습할 레슨을 선택해 보세요. (각 10개 어휘 학습 + 퀴즈)
        </Typography>

        {isLessonsLoading ? (
          <View style={styles.skeletonList}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : isLessonsError ? (
          <EmptyState
            title="레슨을 불러올 수 없습니다"
            description="네트워크 연결 상태를 확인하고 다시 시도해 주세요."
            actionLabel="다시 시도"
            onAction={refetchLessons}
          />
        ) : lessons.length === 0 ? (
          <EmptyState
            title="사용 가능한 레슨이 없습니다"
            description="새로운 어휘 레슨이 준비 중입니다. 잠시 후 다시 확인해 주세요."
            actionLabel="새로고침"
            onAction={refetchLessons}
          />
        ) : (
          <View style={styles.lessonList}>
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progressPercent={lessonProgressMap[lesson.id] || 0}
                theme={theme}
                onSelectLesson={handleSelectLesson}
              />
            ))}
          </View>
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
});

export default TodayStudyView;
