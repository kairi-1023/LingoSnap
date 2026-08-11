import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { Gift, CheckCircle2 } from 'lucide-react-native';
import { Typography } from '../../../shared/components/Typography';
import { Card } from '../../../shared/components/Card';
import { ThemeColors, useThemeStore } from '../../../shared/stores/useThemeStore';

interface DailyQuestCardProps {
  theme: ThemeColors;
  bothCompleted?: boolean;
  isCompleted: boolean;
}

export const DailyQuestCard: React.FC<DailyQuestCardProps> = ({
  theme,
  isCompleted,
}) => {
  const { t } = useTranslation();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const statusText = isCompleted
    ? t('home.rewardQuestCompleted', 'Goal Achieved!')
    : t('home.rewardStudyTogether', 'Daily Study Goal');

  return (
    <Card
      bg={isDarkMode ? 'rgba(92, 184, 92, 0.12)' : '#F7FCF7'}
      borderColor={isDarkMode ? 'rgba(92, 184, 92, 0.25)' : '#E3F5E3'}
      borderWidth={1}
      paddingHorizontal={16}
      paddingVertical={12}
      radius="normal"
      elevation="none"
      style={{ marginBottom: 16, minHeight: 52, justifyContent: 'center' }}
    >
      <View style={styles.contentRow}>
        <View style={styles.leftInfo}>
          <Gift size={18} color={theme.primary} style={styles.icon} />
          <Typography variant="bodyLarge" color="textPrimary" style={styles.rewardValue}>
            {t('home.xpBonus', '2× XP Bonus')}
          </Typography>
        </View>

        <View style={styles.rightStatus}>
          {isCompleted && <CheckCircle2 size={16} color={theme.primary} style={{ marginRight: 4 }} />}
          <Typography
            variant="caption"
            style={{
              fontWeight: '700',
              fontSize: 14,
              color: isCompleted ? theme.primary : theme.textSecondary,
            }}
          >
            {statusText}
          </Typography>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    marginRight: 2,
  },
  rewardLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
  rewardValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  rightStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default DailyQuestCard;
