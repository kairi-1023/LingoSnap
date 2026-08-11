import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Volume2, Turtle } from 'lucide-react-native';
import { Typography } from '../../../shared/components/Typography';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { spacing } from '../../../shared/theme/spacing';

interface ExampleSentenceSectionProps {
  sentenceText: string;
  hasValidSentence: boolean;
  isPlayingExampleNormal?: boolean;
  isPlayingExampleSlow?: boolean;
  onPlayExampleNormal?: () => void;
  onPlayExampleSlow?: () => void;
  // Fallbacks for backwards compatibility
  isPlayingExample?: boolean;
  onPlayExample?: () => void;
  nativeTranslation?: string | null;
  t?: (...args: any[]) => any;
}

export const ExampleSentenceSection: React.FC<ExampleSentenceSectionProps> = React.memo(({
  sentenceText,
  hasValidSentence,
  isPlayingExampleNormal = false,
  isPlayingExampleSlow = false,
  onPlayExampleNormal,
  onPlayExampleSlow,
  isPlayingExample = false,
  onPlayExample,
  nativeTranslation,
  t,
}) => {
  const { theme } = useThemeStore();
  const defaultNoExample = t ? t('study.noExampleSentence') : 'No example sentence';
  const playAccessibilityLabel = t ? t('study.playExamplePronunciation') : 'Play example audio';
  const playSlowAccessibilityLabel = t ? t('study.playExampleSlowly', 'Play example slowly (0.75x)') : 'Play example slowly (0.75x)';

  const handleNormal = onPlayExampleNormal || onPlayExample || (() => {});
  const handleSlow = onPlayExampleSlow || (() => {});

  const isNormalActive = isPlayingExampleNormal || isPlayingExample;
  const isSlowActive = isPlayingExampleSlow;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.insetSurface,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.contentRow}>
        <View style={styles.textColumn}>
          {/* Target Language Example Sentence */}
          <Typography variant="body" color="textPrimary" style={styles.exampleText}>
            {sentenceText || defaultNoExample}
          </Typography>

          {/* Native Language Translation (Compact & Always Visible) */}
          {nativeTranslation ? (
            <Typography variant="caption" color="textSecondary" style={styles.translationText}>
              {nativeTranslation}
            </Typography>
          ) : null}
        </View>

        {/* Inline Audio Action Buttons (Normal Speaker + Slow Turtle Pill) */}
        {hasValidSentence && (
          <View style={[styles.audioButtonWrapper, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <TouchableOpacity
              style={[
                styles.iconButton,
                {
                  backgroundColor: isNormalActive ? theme.successBg : 'transparent',
                  borderColor: isNormalActive ? theme.primary : 'transparent',
                },
              ]}
              activeOpacity={0.7}
              onPress={handleNormal}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 4 }}
              accessibilityLabel={playAccessibilityLabel}
              accessibilityRole="button"
            >
              <Volume2
                size={20}
                color={isNormalActive ? theme.primary : theme.textSecondary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.iconButton,
                {
                  backgroundColor: isSlowActive ? theme.successBg : 'transparent',
                  borderColor: isSlowActive ? theme.primary : 'transparent',
                },
              ]}
              activeOpacity={0.7}
              onPress={handleSlow}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 6 }}
              accessibilityLabel={playSlowAccessibilityLabel}
              accessibilityRole="button"
            >
              <Turtle
                size={22}
                color={isSlowActive ? theme.primary : theme.textSecondary}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
});

ExampleSentenceSection.displayName = 'ExampleSentenceSection';

const styles = StyleSheet.create({
  container: {
    width: 'auto',
    marginHorizontal: -6,
    marginBottom: -6,
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  textColumn: {
    flex: 1,
    gap: 6,
  },
  exampleText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.4,
  },
  translationText: {
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  audioButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
