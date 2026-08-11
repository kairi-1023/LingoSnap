import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useThemeStore } from '../../../shared/stores/useThemeStore';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  accessibilityLabel: string;
  size?: number;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = React.memo(({
  isFavorite,
  onToggle,
  accessibilityLabel,
  size = 32,
}) => {
  const theme = useThemeStore((state) => state.theme);

  const iconSize = Math.round(size * 0.55);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: 10,
          backgroundColor: theme.insetSurface,
          borderColor: theme.border,
        },
      ]}
      activeOpacity={0.7}
      onPress={onToggle}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        <Path
          fill={isFavorite ? theme.accent : 'none'}
          stroke={theme.accent}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        />
      </Svg>
    </TouchableOpacity>
  );
});

FavoriteButton.displayName = 'FavoriteButton';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
