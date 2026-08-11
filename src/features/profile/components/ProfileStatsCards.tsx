import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { spacing } from '../../../shared/theme/spacing';
import { Typography } from '../../../shared/components/Typography';
import { ThemeColors } from '../../../shared/stores/useThemeStore';

interface ProfileStatsCardsProps {
  theme: ThemeColors;
  xpEarned: number;
  todayWordsLength: number;
}

export const ProfileStatsCards: React.FC<ProfileStatsCardsProps> = ({
  theme,
  xpEarned,
  todayWordsLength,
}) => {
  return (
    <View style={styles.statsGrid}>
      <View style={[styles.statCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <View style={[styles.statIconBadge, { backgroundColor: theme.streakBg }]}>
          <Typography variant="caption">⚡</Typography>
        </View>
        <Typography variant="cardTitle" style={[styles.statValue, { color: theme.textPrimary }]}>
          {xpEarned || 20} XP
        </Typography>
        <Typography variant="caption" style={[styles.statLabel, { color: theme.textSecondary }]}>
          Total XP
        </Typography>
      </View>

      <View style={[styles.statCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <View style={[styles.statIconBadge, { backgroundColor: theme.successBg }]}>
          <BookOpen size={18} color="#5CB85C" />
        </View>
        <Typography variant="cardTitle" style={[styles.statValue, { color: theme.textPrimary }]}>
          {todayWordsLength || 5}
        </Typography>
        <Typography variant="caption" style={[styles.statLabel, { color: theme.textSecondary }]}>
          Learned
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  statIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});
