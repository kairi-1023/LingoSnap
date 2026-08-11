import React from 'react';
import { Text as RNText, TextStyle, TextProps as RNTextProps, Platform } from 'react-native';
import { typography, TypographyVariants } from '../theme/typography';
import { useThemeStore } from '../stores/useThemeStore';

export type TextColorVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'textPrimary'
  | 'textSecondary'
  | 'white';

export interface TypographyProps extends RNTextProps {
  variant?: TypographyVariants;
  color?: TextColorVariant;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
}

/**
 * Global Standardized Typography Component
 * Enforces unified font sizes, font weights, and line heights across all screens.
 * Automatically adapts text colors to Dark Mode theme contrast.
 */
export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'textPrimary',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const { theme } = useThemeStore();
  const variantStyle = typography[variant] || typography.body;

  const dynamicColorMap: Record<TextColorVariant, string> = {
    primary: theme.primary,
    secondary: theme.secondary,
    accent: theme.accent,
    textPrimary: theme.textPrimary,
    textSecondary: theme.textSecondary,
    white: '#FFFFFF',
  };

  const textColor = dynamicColorMap[color] || theme.textPrimary;

  return (
    <RNText
      style={[
        variantStyle,
        { color: textColor, textAlign: align, ...Platform.select({ android: { includeFontPadding: false } }) },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Typography;
