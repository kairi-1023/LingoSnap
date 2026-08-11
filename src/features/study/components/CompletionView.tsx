import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, BookOpen, Sparkles, RotateCcw } from 'lucide-react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { Button } from '../../../shared/components/Button';
import { Typography } from '../../../shared/components/Typography';
import { useStudyStore } from '../../../shared/stores/useStudyStore';
import { useThemeStore } from '../../../shared/stores/useThemeStore';

interface CompletionViewProps {
  onRestart?: () => void;
}

export const CompletionView: React.FC<CompletionViewProps> = React.memo(({ onRestart }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const xpEarned = useStudyStore((state) => state.xpEarned);
  const todayWords = useStudyStore((state) => state.todayWords);
  const resetSession = useStudyStore((state) => state.resetSession);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = useThemeStore((state) => state.theme);
  const { t } = useTranslation();

  const learnedCount = todayWords.length || 5;
  const gainedXp = xpEarned || 20;

  const handleRestartStudy = () => {
    resetSession();
    if (onRestart) {
      onRestart();
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { paddingBottom: 64 + insets.bottom + 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.innerContainer}>
        <View style={styles.contentGroup}>
          <View style={styles.contentContainer}>
            {/* 1. Sleek Modern Hero Success Icon Badge */}
            <View
              style={[
                styles.heroBadge,
                {
                  backgroundColor: theme.successBg,
                  borderColor: theme.successBorder,
                },
              ]}
            >
              <Check size={28} color={colors.primary} strokeWidth={3} />
            </View>

            {/* 2. Today's Result Header */}
            <Typography variant="screenTitle" color="textPrimary" align="center" style={styles.resultTitle}>
              {t('study.completionTitle', 'Great Job!')}
            </Typography>

            <Typography variant="caption" color="textSecondary" align="center" style={styles.resultSubtitle}>
              {t('study.completionSolo', 'You completed today\'s 5-minute study!')}
            </Typography>

            {/* 3. Refined Stat Cards Grid */}
            <View style={styles.statsContainer}>
              {/* Stat 1: Words Learned */}
              <View style={[styles.statCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                <View style={[styles.statIconBadge, { backgroundColor: theme.successBg }]}>
                  <BookOpen size={20} color={colors.primary} />
                </View>
                <Typography variant="cardTitle" color="textPrimary" style={styles.statValue} align="center">
                  {learnedCount}
                </Typography>
                <Typography variant="caption" color="textSecondary" align="center">
                  {t('study.wordsLearned', 'Words')}
                </Typography>
              </View>

              {/* Stat 2: XP Gained */}
              <View style={[styles.statCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                <View style={[styles.statIconBadge, { backgroundColor: theme.streakBg }]}>
                  <Sparkles size={20} color={colors.secondary} />
                </View>
                <Typography variant="cardTitle" color="textPrimary" style={styles.statValue} align="center">
                  +{gainedXp} XP
                </Typography>
                <Typography variant="caption" color="textSecondary" align="center">
                  {t('study.xpEarnedLabel', 'XP Gained')}
                </Typography>
              </View>
            </View>
          </View>
        </View>

        {/* 4. Action Buttons */}
        <View style={styles.buttonGroup}>
          <Button
            label={t('common.done', 'Done')}
            variant="primary"
            onPress={() => router.push('/(tabs)')}
            style={styles.primaryButton}
            icon={<Check size={20} color="#FFFFFF" />}
          />

          <Button
            label={t('study.restartStudy', 'Practice Again')}
            variant="secondary"
            onPress={handleRestartStudy}
            style={[styles.secondaryButton, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
            icon={<RotateCcw size={18} color={colors.primary} />}
          />
        </View>
      </View>
    </ScrollView>
  );
});

CompletionView.displayName = 'CompletionView';

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 12,
    paddingHorizontal: spacing.lg,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentGroup: {
    flex: 1,
    gap: 16,
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 4,
  },
  heroBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  resultTitle: {
    marginBottom: 4,
  },
  resultSubtitle: {
    lineHeight: 20,
    maxWidth: 320,
    marginBottom: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 1,
    textAlign: 'center',
  },
  buttonGroup: {
    width: '100%',
    gap: 8,
    marginTop: 20,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
});

export default CompletionView;

