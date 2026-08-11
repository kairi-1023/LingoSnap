import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { Typography } from '../../../shared/components/Typography';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { colors } from '../../../shared/theme/colors';

interface QuizOptionButtonProps {
  option: string;
  index: number;
  isSelected: boolean;
  isChecked: boolean;
  isCorrectAnswer: boolean;
  onSelect: () => void;
  selectedOptionText: string | null;
  correctAnswer: string;
  t: (...args: any[]) => any;
}

export const QuizOptionButton: React.FC<QuizOptionButtonProps> = ({
  option,
  index,
  isSelected,
  isChecked,
  isCorrectAnswer,
  onSelect,
  t,
}) => {
  const { theme } = useThemeStore();

  let buttonStyle: any[] = [styles.optionButton, { backgroundColor: theme.chipSurface, borderColor: theme.border }];
  let radioStyle: any[] = [styles.optionRadio, { backgroundColor: theme.insetSurface, borderColor: theme.border }];
  let textColor: 'primary' | 'textPrimary' | 'secondary' = 'textPrimary';

  if (!isChecked) {
    if (isSelected) {
      buttonStyle.push({ borderColor: colors.primary, backgroundColor: theme.successBg });
      radioStyle.push({ borderColor: colors.primary, backgroundColor: colors.primary });
      textColor = 'primary';
    }
  } else {
    if (isCorrectAnswer) {
      buttonStyle.push({ borderColor: colors.primary, backgroundColor: theme.successBg });
      radioStyle.push({ borderColor: colors.primary, backgroundColor: colors.primary });
      textColor = 'primary';
    } else if (isSelected && !isCorrectAnswer) {
      buttonStyle.push({ borderColor: theme.streakBorder, backgroundColor: theme.streakBg });
      radioStyle.push({ borderColor: theme.streakText, backgroundColor: theme.streakText });
      textColor = 'secondary';
    }
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      activeOpacity={0.85}
      disabled={isChecked}
      onPress={onSelect}
    >
      <View style={styles.optionContent}>
        <View style={radioStyle}>
          {isChecked && isCorrectAnswer ? (
            <CheckCircle2 size={15} color="#FFFFFF" />
          ) : (
            <Typography
              variant="caption"
              color={isSelected || (isChecked && isCorrectAnswer) ? 'white' : 'textSecondary'}
              style={styles.radioText}
            >
              {String.fromCharCode(65 + index)}
            </Typography>
          )}
        </View>

        <Typography
          variant="bodyLarge"
          color={textColor}
          numberOfLines={1}
          style={styles.optionText}
        >
          {option}
        </Typography>

        {isChecked && isCorrectAnswer && (
          <View style={[styles.inlineBadgeBase, { backgroundColor: theme.successBg, borderColor: theme.successBorder }]}>
            <Typography variant="caption" style={[styles.badgeText, { color: colors.primary }]}>
              {t('study.correctAnswer', 'Correct')}
            </Typography>
          </View>
        )}

        {isChecked && isSelected && !isCorrectAnswer && (
          <View style={[styles.inlineBadgeBase, { backgroundColor: theme.streakBg, borderColor: theme.streakBorder }]}>
            <Typography variant="caption" style={[styles.badgeText, { color: theme.streakText }]}>
              {t('study.goodTryBadge', 'Good Try')}
            </Typography>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    height: 56, // Exactly 56dp Option height for Android Touch Target
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioText: {
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    letterSpacing: 0.3,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  inlineBadgeBase: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    marginLeft: 6,
  },
  badgeText: {
    fontWeight: '700',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
