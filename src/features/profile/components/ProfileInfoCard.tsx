import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, Edit2, Sparkles, ChevronRight } from 'lucide-react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { Typography } from '../../../shared/components/Typography';
import { Avatar } from '../../../shared/components/Avatar';
import { Button } from '../../../shared/components/Button';
import { ThemeColors } from '../../../shared/stores/useThemeStore';
import { UserEntity } from '../../../domain/entities/User';

interface ProfileInfoCardProps {
  theme: ThemeColors;
  user: UserEntity | null;
  userName: string;
  userInitials: string;
  nativeLang: string;
  targetLang: string;
  onOpenAvatarModal: () => void;
  onOpenNameModal: () => void;
  onGuestSignIn: () => void;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  theme,
  user,
  userName,
  userInitials,
  nativeLang,
  targetLang,
  onOpenAvatarModal,
  onOpenNameModal,
  onGuestSignIn,
}) => {
  return (
    <>
      <View style={[styles.profileCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <TouchableOpacity
          style={styles.avatarButtonContainer}
          activeOpacity={0.8}
          onPress={onOpenAvatarModal}
        >
          <Avatar size={76} imageUrl={user?.avatarUrl} fallbackText={userInitials} bgColor={theme.primary} textColor="#FFFFFF" borderColor={theme.background} borderWidth={3} />
          <View style={styles.cameraBadge}>
            <Camera size={13} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.userNameContainer}
          activeOpacity={0.7}
          onPress={onOpenNameModal}
        >
          <Typography variant="sectionTitle" style={[styles.userNameText, { color: theme.textPrimary }]}>
            {userName}
          </Typography>
          <View style={[styles.editIconBadge, { backgroundColor: theme.successBg }]}>
            <Edit2 size={13} color="#5CB85C" />
          </View>
        </TouchableOpacity>

        <View style={styles.badgeRowContainer}>
          <View style={[styles.levelBadge, { backgroundColor: theme.streakBg, borderColor: theme.streakBorder }]}>
            <Typography variant="caption" style={[styles.levelBadgeText, { color: theme.streakText }]}>
              {nativeLang} ➔ {targetLang}
            </Typography>
          </View>
        </View>
      </View>

      {user?.isGuest && (
        <TouchableOpacity
          style={[styles.guestBannerCard, { backgroundColor: theme.successBg, borderColor: theme.successBorder }]}
          activeOpacity={0.8}
          onPress={onGuestSignIn}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Sparkles size={18} color="#5CB85C" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Typography variant="bodyLarge" color="primary">
                {'Save Streak'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {'Sign in to sync'}
              </Typography>
            </View>
          </View>
          <ChevronRight size={18} color="#5CB85C" />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    borderRadius: 24,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 24,
  },
  avatarButtonContainer: {
    position: 'relative',
    marginBottom: spacing.xs,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  editIconBadge: {
    marginLeft: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  badgeRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  guestBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 24,
  },
});
