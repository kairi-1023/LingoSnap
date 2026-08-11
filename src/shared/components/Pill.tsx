import React from 'react';
import { View, Text, ViewStyle, Platform } from 'react-native';

export type PillVariant = 'xp' | 'neutral';

export interface PillProps {
  label: string;
  value?: string | number;
  icon?: string;
  variant?: PillVariant;
  style?: ViewStyle;
}

import { Typography } from './Typography';

export const Pill: React.FC<PillProps> = ({
  label,
  value,
  icon,
  variant = 'neutral',
  style,
}) => {
  const getPillStyle = () => {
    switch (variant) {
      case 'xp':
        return {
          container: 'bg-[#FFF7E6] border-[#FFE0A3]',
          iconText: '⚡',
          valueColor: 'secondary' as const,
        };
      case 'neutral':
      default:
        return {
          container: 'bg-[#F9FAFB] border-[#E5E7EB]',
          iconText: '📌',
          valueColor: 'textPrimary' as const,
        };
    }
  };

  const pillTheme = getPillStyle();

  return (
    <View
      className={`px-3.5 py-1.5 rounded-full border flex-row items-center gap-1.5 self-start ${pillTheme.container}`}
      style={style}
    >
      <Typography variant="caption" color="textPrimary">
        {icon || pillTheme.iconText}
      </Typography>
      <Typography variant="caption" color="textPrimary">
        {label}
      </Typography>
      {value !== undefined && (
        <Typography variant="caption" color={pillTheme.valueColor} style={{ fontWeight: '600' }}>
          {value}
        </Typography>
      )}
    </View>
  );
};
