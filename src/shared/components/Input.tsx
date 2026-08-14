import React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  View,
  ViewStyle,
  Platform,
} from 'react-native';
import { useThemeStore } from '../stores/useThemeStore';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export interface InputProps extends RNTextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

/**
 * Standardized Input Component (Single source of truth for text entry).
 * Enforces DESIGN.md tokens: Height 48, Radius 14, Padding 16, Font 14,
 * and includes Android font padding & theme contrast protection.
 */
export const Input = React.forwardRef<RNTextInput, InputProps>(({
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  placeholderTextColor,
  accessibilityLabel,
  accessibilityHint,
  placeholder,
  ...props
}, ref) => {
  const { theme } = useThemeStore();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
        },
        containerStyle,
      ]}
    >
      {leftIcon && <View style={styles.leftIconBox} importantForAccessibility="no">{leftIcon}</View>}

      <RNTextInput
        ref={ref}
        style={[
          styles.input,
          { color: theme.textPrimary },
          style,
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor || colors.textMuted}
        accessibilityLabel={accessibilityLabel || placeholder}
        accessibilityHint={accessibilityHint}
        {...Platform.select({ android: { includeFontPadding: false } })}
        {...props}
      />

      {rightIcon && <View style={styles.rightIconBox}>{rightIcon}</View>}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 10,
  },
  leftIconBox: {
    marginRight: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconBox: {
    marginLeft: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Input;
