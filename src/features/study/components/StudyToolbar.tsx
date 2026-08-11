import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { ProgressBar } from '../../../shared/components/ProgressBar';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

interface StudyToolbarProps {
  t: (...args: any[]) => any;
  currentIndex?: number;
  totalCount?: number;
}

export const StudyToolbar: React.FC<StudyToolbarProps> = React.memo(({
  t,
  currentIndex,
  totalCount,
}) => {
  const hasProgress = totalCount !== undefined && totalCount > 0 && currentIndex !== undefined;
  const progressRatio = hasProgress ? (currentIndex + 1) / totalCount : 0;

  return (
    <View style={styles.wrapper}>
      {hasProgress && (
        <View style={styles.headerSection}>
          <View style={styles.countRow}>
            <Typography variant="caption" color="textSecondary" style={{ fontWeight: '600' }}>
              {t('study.todayVocabulary', 'Today\'s Vocabulary')}
            </Typography>

            <Typography variant="caption" color="primary" style={{ fontWeight: '700' }}>
              {currentIndex + 1} / {totalCount}
            </Typography>
          </View>
          <ProgressBar progress={progressRatio} height={8} color={colors.primary} />
        </View>
      )}
    </View>
  );
});

StudyToolbar.displayName = 'StudyToolbar';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.xs,
  },
  headerSection: {
    marginBottom: 4,
    paddingHorizontal: spacing.xs,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});

