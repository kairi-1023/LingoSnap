import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
  Animated,
  GestureResponderEvent,
  Platform,
} from 'react-native';
import { useThemeStore } from '../stores/useThemeStore';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label?: string;
  title?: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

const ButtonComponent: React.FC<ButtonProps> = React.memo(({
  label: labelProp,
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  icon,
  accessibilityLabel,
  accessibilityHint,
  style,
}) => {
  const label = labelProp || title || '';
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const theme = useThemeStore((state) => state.theme);

  // Press Scale Animation (Scale down to 0.97 on press)
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1.0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  // Dimensions by Size (Standard Primary Button height: 56px, radius: 16px)
  const getSizeStyles = (): { container: string; text: string } => {
    switch (size) {
      case 'sm':
        return { container: 'h-[44px] px-4 rounded-[14px]', text: 'text-[12px]' };
      case 'lg':
        return { container: 'h-[56px] px-8 rounded-[16px]', text: 'text-[16px]' };
      case 'md':
      default:
        return { container: 'h-[56px] px-6 rounded-[16px]', text: 'text-[14px]' };
    }
  };

  // Variant Styles
  const getVariantStyles = (): string => {
    if (disabled) {
      return 'bg-disabledBg border-transparent';
    }
    switch (variant) {
      case 'primary':
        return 'bg-primary border-transparent active:opacity-90';
      case 'secondary':
        return 'bg-surface border border-borderDefault active:bg-surfaceSecondary';
      case 'accent':
        return 'bg-accent border-transparent active:opacity-90';
      case 'ghost':
        return 'bg-transparent border-transparent active:bg-surfaceSecondary';
    }
  };

  // Text Color by Variant & State (Dark Mode Responsive)
  const getTextColor = (): string => {
    if (disabled) return 'text-disabledText';
    switch (variant) {
      case 'secondary':
        return 'text-textPrimary';
      case 'ghost':
        return 'text-primary';
      case 'primary':
      case 'accent':
      default:
        return 'text-white';
    }
  };

  const sizeStyle = getSizeStyles();
  const isInteractionDisabled = disabled || loading;

  // Theme-aware overrides: tailwind.config.js color tokens are static light-mode
  // values (no dark: mapping), so the secondary variant must use theme store colors.
  const themedContainerStyle: ViewStyle | undefined =
    variant === 'secondary' && !disabled
      ? { backgroundColor: theme.surface, borderColor: theme.border }
      : variant === 'primary' && !disabled
      ? { backgroundColor: theme.buttonPrimary }
      : undefined;

  const themedTextStyle =
    variant === 'secondary' && !disabled ? { color: theme.textPrimary } : undefined;

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        fullWidth ? { width: '100%' } : { alignSelf: 'flex-start' },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={isInteractionDisabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{
          disabled: isInteractionDisabled,
          busy: loading,
        }}
        className={`justify-center items-center flex-row gap-2 ${sizeStyle.container} ${
          fullWidth ? 'w-full' : 'self-start'
        } ${getVariantStyles()}`}
        style={[themedContainerStyle, style]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'secondary' || variant === 'ghost' ? theme.textPrimary : '#FFFFFF'}
          />
        ) : (
          <>
            {leftIcon}
            <Text className={`${sizeStyle.text} font-semibold ${getTextColor()}`} style={[themedTextStyle, Platform.OS === 'android' ? { includeFontPadding: false } : undefined]} numberOfLines={1} adjustsFontSizeToFit>
              {label}
            </Text>
            {rightIcon || icon}
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

ButtonComponent.displayName = 'Button';
export const Button = ButtonComponent;
