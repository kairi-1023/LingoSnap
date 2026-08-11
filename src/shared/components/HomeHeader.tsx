import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useThemeStore as useAppThemeStore } from '../stores/useThemeStore';
import { Avatar } from './Avatar';
import { Typography } from './Typography';

interface HomeHeaderProps {
  userName?: string;
  userAvatarUrl?: string;
  userInitials?: string;
  onProfilePress?: () => void;
  style?: ViewStyle;
}

export const HomeHeader: React.FC<HomeHeaderProps> = React.memo(({
  userName = 'Together Lingo',
  userAvatarUrl,
  userInitials = 'U',
  onProfilePress,
  style,
}) => {
  const { t } = useTranslation();
  const theme = useAppThemeStore((state) => state.theme);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }, style]}>
      <TouchableOpacity
        style={styles.leftSection}
        activeOpacity={0.8}
        onPress={onProfilePress}
        accessibilityLabel={t('home.profile')}
        accessibilityRole="button"
      >
        <View style={styles.avatarContainer}>
          <Avatar size={36} imageUrl={userAvatarUrl} fallbackText={userInitials} bgColor={colors.primary} textColor="#FFFFFF" borderColor={theme.background} borderWidth={2} />
        </View>

        <Typography variant="cardTitle" color="textPrimary" numberOfLines={1}>
          {userName}
        </Typography>
      </TouchableOpacity>
    </View>
  );
});

HomeHeader.displayName = 'HomeHeader';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 10,
    paddingBottom: 14,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  avatarContainer: {
    marginRight: 10,
  },
});

export default HomeHeader;
