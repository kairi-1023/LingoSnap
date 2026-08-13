import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Typography } from '../../../shared/components/Typography';
import { ProgressBar } from '../../../shared/components/ProgressBar';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { useStudyStore } from '../../../shared/stores/useStudyStore';
import { spacing } from '../../../shared/theme/spacing';

interface CompactHeaderProps {
  title: string;
  onBackPress: () => void;
  showProgress?: boolean;
  progressPercentage?: number;
  currentStep?: number;
  totalCount?: number;
}

export const CompactHeader: React.FC<CompactHeaderProps> = React.memo(({
  title,
  onBackPress,
  showProgress = true,
  progressPercentage,
  currentStep: customStep,
  totalCount: customTotal,
}) => {
  const { theme } = useThemeStore();
  const totalCount = typeof customTotal === 'number' && customTotal > 0 ? customTotal : 10;
  const currentStep = typeof customStep === 'number' ? customStep : 1;
  const progressRatio = totalCount > 0 ? Math.min(1, Math.max(0, currentStep / totalCount)) : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={onBackPress}
        accessibilityLabel="Go back"
        accessibilityRole="button"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <ChevronLeft size={24} color={theme.textPrimary} />
      </TouchableOpacity>

      <Typography variant="cardTitle" color="textPrimary" style={styles.title}>
        {title}
      </Typography>

      {showProgress ? (
        <View style={styles.progressGroup}>
          <Typography variant="caption" color="primary" style={{ fontWeight: '700', fontSize: 14 }}>
            {currentStep} / {totalCount}
          </Typography>
          <View style={styles.progressBarWrapper}>
            <ProgressBar progress={progressRatio} height={6} color={theme.primary} />
          </View>
        </View>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
});

CompactHeader.displayName = 'CompactHeader';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    height: 48,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
  },
  progressGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  progressBarWrapper: {
    width: 48,
  },
  placeholder: {
    width: 32,
  },
});
