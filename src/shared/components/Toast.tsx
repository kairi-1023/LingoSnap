import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../stores/useThemeStore';
import { Typography } from './Typography';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
}

const TOAST_TYPE_MAP = {
  success: { bg: 'successBg', border: 'successBorder', text: 'successText' } as const,
  error:   { bg: 'errorBg',   border: 'errorBorder',   text: 'accent' } as const,
  warning: { bg: 'streakBg',  border: 'streakBorder',  text: 'warningText' } as const,
  info:    { bg: 'fillSubtle', border: 'border',       text: 'textPrimary' } as const,
};

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
}) => {
  const insets = useSafeAreaInsets();
  const theme = useThemeStore((state) => state.theme);
  const opacityAnim = React.useRef(new Animated.Value(0)).current;
  const translateYAnim = React.useRef(new Animated.Value(-16)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(translateYAnim, { toValue: 0, friction: 12, tension: 50, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 12, tension: 50, useNativeDriver: true }),
      ]).start();

      if (duration <= 0) return;

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(translateYAnim, { toValue: -12, duration: 200, useNativeDriver: true }),
        ]).start(() => { if (onDismiss) onDismiss(); });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const tokens = TOAST_TYPE_MAP[type] || TOAST_TYPE_MAP.info;

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { top: insets.top + 16, opacity: opacityAnim, transform: [{ translateY: translateYAnim }, { scale: scaleAnim }] },
      ]}
      pointerEvents="none"
    >
      <View
        style={[
          styles.toast,
          {
            backgroundColor: (theme as any)[tokens.bg],
            borderColor: (theme as any)[tokens.border],
          },
        ]}
      >
        <Typography variant="body" style={{ color: (theme as any)[tokens.text], fontWeight: '600' }} align="center">
          {message}
        </Typography>
      </View>
    </Animated.View>
  );
};

Toast.displayName = 'Toast';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 99999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toast: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#2F3437',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    fontSize: 14,
  },
});

export default Toast;
