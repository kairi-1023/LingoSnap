import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useThemeStore } from '../stores/useThemeStore';
import { useTranslation } from 'react-i18next';
import { Typography } from './Typography';

// Official Google 'G' Icon Component
const GoogleSvgIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <Path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
    />
    <Path
      fill="#FBBC05"
      d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
    />
    <Path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
    />
  </Svg>
);

interface SocialAuthButtonProps {
  provider?: 'google';
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
  provider = 'google',
  onPress,
  loading = false,
  disabled = false,
  style,
}) => {
  const { t } = useTranslation();
  const { theme } = useThemeStore();

  const containerStyle: ViewStyle = {
    backgroundColor: theme.cardBackground,
    borderColor: theme.border,
    borderWidth: 1,
  };

  const textStyle: TextStyle = { color: theme.textPrimary };
  const label = t('auth.googleSignIn');

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, containerStyle, disabled && styles.disabled, style]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.textPrimary} />
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.iconWrapper}>
            <GoogleSvgIcon />
          </View>
          <Typography variant="bodyLarge" style={[textStyle, { fontWeight: '600' }]}>
            {label}
          </Typography>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  disabled: {
    opacity: 0.6,
  },
});

