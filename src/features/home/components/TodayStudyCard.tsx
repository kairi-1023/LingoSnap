import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Play } from 'lucide-react-native';
import { Typography } from '../../../shared/components/Typography';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { ThemeColors, useThemeStore } from '../../../shared/stores/useThemeStore';

interface TodayStudyCardProps {
  theme: ThemeColors;
  isCompleted: boolean;
  hasWrittenDiaryToday?: boolean;
  completedCount: number;
  targetWordCount: number;
  progressPercent: number;
  studyButtonText: string;
  onStartStudy: () => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const TodayStudyCard: React.FC<TodayStudyCardProps> = ({
  theme,
  isCompleted,
  hasWrittenDiaryToday,
  completedCount,
  targetWordCount,
  progressPercent,
  studyButtonText,
  onStartStudy,
  isLoading,
  isError,
  onRetry,
}) => {
  const { t } = useTranslation();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  if (isLoading) {
    return (
      <Card
        bg={isDarkMode ? 'rgba(92, 184, 92, 0.12)' : '#F6FCF7'}
        borderColor={isDarkMode ? 'rgba(92, 184, 92, 0.25)' : '#E3F5E3'}
        borderWidth={1}
        padding={24}
        radius="normal"
        elevation="soft"
        style={{ marginBottom: 16, height: 180, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="small" color={theme.primary} />
        <Typography variant="caption" color="textSecondary" style={{ marginTop: 12 }}>
          {t('common.loading')}
        </Typography>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card
        bg={isDarkMode ? 'rgba(92, 184, 92, 0.12)' : '#F6FCF7'}
        borderColor={isDarkMode ? 'rgba(92, 184, 92, 0.25)' : '#E3F5E3'}
        borderWidth={1}
        padding={24}
        radius="normal"
        elevation="soft"
        style={{ marginBottom: 16, height: 180, justifyContent: 'center', alignItems: 'center' }}
      >
        <Typography variant="body" color="textSecondary" style={{ marginBottom: 16, textAlign: 'center' }}>
          {t('errors.general')}
        </Typography>
        <Button
          label={t('common.retry')}
          variant="primary"
          onPress={onRetry}
          style={{ minHeight: 44, width: 120 }}
        />
      </Card>
    );
  }
  return (
    <Card
      bg={isDarkMode ? 'rgba(92, 184, 92, 0.12)' : '#F6FCF7'}
      borderColor={isDarkMode ? 'rgba(92, 184, 92, 0.25)' : '#E3F5E3'}
      borderWidth={1}
      padding={20}
      radius="normal"
      elevation="soft"
      style={{ marginBottom: 16 }}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isDarkMode ? 'rgba(92, 184, 92, 0.2)' : '#EBF9EB',
              borderColor: isDarkMode ? 'rgba(92, 184, 92, 0.35)' : '#D2F0D2',
            },
          ]}
        >
          <Typography variant="caption" color="primary" style={styles.badgeText}>
            {t('study.todayFlow')}
          </Typography>
        </View>

        <Typography variant="caption" color="primary" style={styles.wordCount}>
          {t('study.progress', { current: completedCount, total: targetWordCount })}
        </Typography>
      </View>

      {/* Summary Status Text */}
      <Typography variant="sectionTitle" style={styles.summary}>
        {isCompleted
          ? (hasWrittenDiaryToday ? t('study.completedAllFlow') : t('study.allDone'))
          : completedCount > 0
          ? t('study.almostThere')
          : t('study.readyForStudy')}
      </Typography>

      {/* Progress Bar Line */}
      <View
        style={[
          styles.progressTrack,
          { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#E3F5E3' },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            { width: `${progressPercent}%`, backgroundColor: theme.primary },
          ]}
        />
      </View>

      <Button
        label={studyButtonText}
        variant="primary"
        onPress={onStartStudy}
        leftIcon={<Play size={20} color="#FFFFFF" fill="#FFFFFF" />}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    minWidth: 0,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  wordCount: {
    fontWeight: '600',
    fontSize: 14,
    flexShrink: 1,
  },
  summary: {
    marginBottom: 10,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  },
  progressTrack: {
    width: '100%',
    height: 5,
    borderRadius: 9999,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 9999,
  },
});
