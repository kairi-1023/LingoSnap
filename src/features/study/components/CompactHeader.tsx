import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Typography } from '../../../shared/components/Typography';
import { ProgressBar } from '../../../shared/components/ProgressBar';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { useStudyStore } from '../../../shared/stores/useStudyStore';
import { spacing } from '../../../shared/theme/spacing';
import { useWindowSizeClass } from '../../../shared/hooks/useWindowSizeClass';

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
  const { isLandscape } = useWindowSizeClass();
  const totalCount = typeof customTotal === 'number' && customTotal > 0 ? customTotal : 10;
  const currentStep = typeof customStep === 'number' ? customStep : 1;
  const progressRatio = totalCount > 0 ? Math.min(1, Math.max(0, currentStep / totalCount)) : 0;

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape, { backgroundColor: theme.background }]}>
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={onBackPress}
        accessibilityLabel={title ? `${title} 화면에서 뒤로 가기` : '뒤로 가기'}
        accessibilityRole="button"
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <ChevronLeft size={24} color={theme.textPrimary} />
      </TouchableOpacity>

      <Typography
        variant="cardTitle"
        color="textPrimary"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={styles.title}
      >
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
  containerLandscape: {
    height: 38,
    paddingTop: 2,
    paddingBottom: 2,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: 8,
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
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
