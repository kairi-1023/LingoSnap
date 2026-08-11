import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { Typography } from '../../../shared/components/Typography';
import { useThemeStore } from '../../../shared/stores/useThemeStore';

interface AudioPlayButtonProps {
  isPlaying: boolean;
  onPress: () => void;
  label?: string;
  size?: number;
  accessibilityLabel: string;
  chip?: boolean;
  style?: ViewStyle;
}

export const AudioPlayButton: React.FC<AudioPlayButtonProps> = React.memo(({
  isPlaying,
  onPress,
  label,
  size = 22,
  accessibilityLabel,
  chip = true,
  style,
}) => {
  const theme = useThemeStore((state) => state.theme);

  if (chip) {
    return (
      <TouchableOpacity
        style={[
          styles.chip,
          {
            backgroundColor: isPlaying ? theme.successBg : theme.insetSurface,
            borderColor: isPlaying ? theme.primary : theme.border,
          },
        ]}
        activeOpacity={0.7}
        onPress={onPress}
        hitSlop={{ top: 6, bottom: 6, left: 10, right: 10 }}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
      >
        <Volume2
          size={size}
          color={isPlaying ? theme.primary : theme.textSecondary}
        />
        {label ? (
          <Typography variant="caption" style={{ fontWeight: '600', color: isPlaying ? theme.primary : theme.textSecondary }}>
            {label}
          </Typography>
        ) : null}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.touchTarget, style]}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      <Volume2
        size={24}
        color={isPlaying ? theme.primary : theme.textSecondary}
      />
    </TouchableOpacity>
  );
});

AudioPlayButton.displayName = 'AudioPlayButton';

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 22,
    borderWidth: 1,
    gap: 6,
    height: 44,
  },
  touchTarget: {
    minWidth: 56,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
