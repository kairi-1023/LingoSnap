import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../../../shared/components/Typography';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { spacing } from '../../../shared/theme/spacing';

interface QuizCanvasProps {
  children: React.ReactNode;
  isChecked?: boolean;
  isCorrect?: boolean;
  feedbackMessage?: string | null;
}

export const QuizCanvas: React.FC<QuizCanvasProps> = React.memo(({
  children,
  isChecked = false,
  isCorrect = false,
  feedbackMessage,
}) => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + spacing.md,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.contentWrapper}>
          {children}

          {/* Natural Flow Bottom Feedback Badge in Normal Document Flow */}
          {isChecked && !!feedbackMessage ? (
            <View
              style={[
                styles.feedbackBadge,
                {
                  backgroundColor: isCorrect ? theme.successBg : theme.streakBg,
                  borderColor: isCorrect ? theme.successBorder : theme.streakBorder,
                },
              ]}
            >
              <Typography
                variant="caption"
                style={{
                  fontWeight: '700',
                  color: isCorrect ? theme.primary : theme.streakText,
                  textAlign: 'center',
                  includeFontPadding: false,
                  textAlignVertical: 'center',
                }}
              >
                {feedbackMessage}
              </Typography>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
});

QuizCanvas.displayName = 'QuizCanvas';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: spacing.xs,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  feedbackBadge: {
    marginTop: spacing.md, // ~20dp natural spacing from Option D
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
