import React from 'react';
import { View, ViewProps, TouchableOpacity, Text, ViewStyle } from 'react-native';

const isColorValue = (v: string) => v.startsWith('#') || v.startsWith('rgba') || v.startsWith('rgb');

export interface CardProps extends ViewProps {
  radius?: 'normal' | 'large';
  padding?: 'sm' | 'md' | 'lg' | number;
  bg?: string;
  borderColor?: string;
  borderWidth?: number;
  elevation?: 'none' | 'soft' | 'medium';
  shadowColor?: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  children?: React.ReactNode;
}

export interface CardBodyProps {
  children: React.ReactNode;
}

export interface CardFooterProps {
  children: React.ReactNode;
}

import { Typography } from './Typography';

const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, rightElement, children }) => {
  if (children) {
    return <View className="flex-row items-center justify-between mb-3">{children}</View>;
  }
  return (
    <View className="flex-row items-center justify-between mb-3">
      <View className="flex-1 mr-2">
        {title && (
          <Typography variant="cardTitle" color="textPrimary">
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="caption" color="textSecondary" style={{ marginTop: 2 }}>
            {subtitle}
          </Typography>
        )}
      </View>
      {rightElement && <View>{rightElement}</View>}
    </View>
  );
};

const CardBody: React.FC<CardBodyProps> = ({ children }) => {
  return <View className="my-1">{children}</View>;
};

const CardFooter: React.FC<CardFooterProps> = ({ children }) => {
  return <View className="mt-3 pt-3 border-t border-borderDefault flex-row items-center justify-between">{children}</View>;
};

const PADDING_MAP: Record<string, number> = { sm: 12, md: 16, lg: 24 };

export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
} = ({
  radius = 'normal',
  padding = 'md',
  bg = 'bg-surface',
  borderColor = 'border-borderDefault',
  borderWidth,
  elevation = 'none',
  shadowColor,
  selected = false,
  disabled = false,
  onPress,
  children,
  style,
  ...props
}) => {
  const borderRadius = radius === 'large' ? 24 : 20;
  const paddingVal = typeof padding === 'number' ? padding : (PADDING_MAP[padding] || 16);

  const bgIsColor = isColorValue(bg);
  const borderIsColor = isColorValue(borderColor);

  const dynamicStyle: ViewStyle = {
    padding: paddingVal,
    borderRadius,
  };
  if (borderWidth !== undefined) dynamicStyle.borderWidth = borderWidth;
  if (bgIsColor) dynamicStyle.backgroundColor = bg;
  if (borderIsColor) dynamicStyle.borderColor = borderColor;

  const elevationStyle: ViewStyle = (() => {
    const sc = shadowColor || '#2F3437';
    switch (elevation) {
      case 'soft':
        return { shadowColor: sc, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 };
      case 'medium':
        return { shadowColor: sc, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 };
      default:
        return {};
    }
  })();

  const twClassName = [
    'border',
    disabled ? 'bg-disabledBg border-borderDefault opacity-60' : '',
    !disabled && selected ? 'bg-surfaceSecondary border-primary' : '',
    !disabled && !selected && !bgIsColor ? bg : '',
    !disabled && !selected && !borderIsColor ? borderColor : '',
  ].filter(Boolean).join(' ') || undefined;

  const cardContent = (
    <View
      className={twClassName}
      style={[elevationStyle, dynamicStyle, style]}
      {...props}
    >
      {children}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
