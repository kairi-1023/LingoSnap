import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import { Typography } from './Typography';
import { useThemeStore } from '../stores/useThemeStore';

export interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = React.memo(({
  title,
  showBackButton = true,
  onBackPress,
  rightElement,
  style,
}) => {
  const { t } = useTranslation();
  const theme = useThemeStore((state) => state.theme);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }, style]}>
      {showBackButton ? (
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={onBackPress}
          accessibilityLabel={t('common.close')}
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      {title ? (
        <Typography variant="cardTitle" align="center" style={[styles.title, { color: theme.textPrimary }]}>
          {title}
        </Typography>
      ) : (
        <View style={styles.titlePlaceholder} />
      )}

      {rightElement ? (
        <View style={styles.rightContainer}>{rightElement}</View>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
});

Header.displayName = 'Header';

// NOTE: Top safe-area inset is handled by the parent screen's SafeAreaView
// (react-native-safe-area-context) on both iOS and Android.
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  placeholder: {
    width: 36,
  },
  title: {
    flex: 1,
  },
  titlePlaceholder: {
    flex: 1,
  },
  rightContainer: {
    width: 36,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default Header;
