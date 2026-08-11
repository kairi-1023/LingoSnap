import React from 'react';
import { View, ViewStyle, DimensionValue, StyleSheet } from 'react-native';

import { colors } from '../theme/colors';

export interface ProgressBarProps {
  progress: number; // 0.0 to 1.0
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = colors.primary,
  backgroundColor = colors.border,
  height = 10,
  style,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage: DimensionValue = `${clampedProgress * 100}%`;

  const isHexColor = color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl');
  const isHexBg = backgroundColor.startsWith('#') || backgroundColor.startsWith('rgb') || backgroundColor.startsWith('hsl');

  return (
    <View
      style={[
        styles.track,
        { height, backgroundColor: isHexBg ? backgroundColor : colors.border },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: percentage,
            backgroundColor: isHexColor ? color : colors.primary,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 9999,
  },
});

export default ProgressBar;
