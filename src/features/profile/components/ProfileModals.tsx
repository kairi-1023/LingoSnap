import React from 'react';
import { View, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { X, Upload, Trash2 } from 'lucide-react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { AppSheet } from '../../../shared/components/AppSheet';
import { Button } from '../../../shared/components/Button';
import { Typography } from '../../../shared/components/Typography';
import { Avatar } from '../../../shared/components/Avatar';
import { ThemeColors } from '../../../shared/stores/useThemeStore';
import { UserEntity } from '../../../domain/entities/User';

interface ProfileModalsProps {
  theme: ThemeColors;
  isModalVisible: boolean;
  onCloseModal: () => void;
  previewUri: string;
  userInitials: string;
  isCompressing: boolean;
  isUpdating: boolean;
  onPickLocalFile: () => void;
  customUrl: string;
  onChangeCustomUrl: (text: string) => void;
  onSaveAvatar: () => void;
  isNameModalVisible: boolean;
  onCloseNameModal: () => void;
  inputDisplayName: string;
  onChangeDisplayName: (text: string) => void;
  isSavingName: boolean;
  onSaveDisplayName: () => void;
  isPartnerModalVisible: boolean;
  isLogoutModalVisible: boolean;
  onCloseLogoutModal: () => void;
  isLoggingOut: boolean;
  onConfirmLogout: () => void;
  isDeleteModalVisible: boolean;
  onCloseDeleteModal: () => void;
  isDeletingAccount: boolean;
  onConfirmDelete: () => void;
  isGuestModalVisible: boolean;
  isDisplayLanguageModalVisible: boolean;
  onCloseDisplayLanguageModal: () => void;
  isLanguageModalVisible: boolean;
  onCloseLanguageModal: () => void;
  onCloseGuestModal: () => void;
}

export const ProfileModals: React.FC<ProfileModalsProps> = ({
  theme,
  isModalVisible,
  onCloseModal,
  previewUri,
  userInitials,
  isCompressing,
  isUpdating,
  onPickLocalFile,
  customUrl,
  onChangeCustomUrl,
  onSaveAvatar,
  isNameModalVisible,
  onCloseNameModal,
  inputDisplayName,
  onChangeDisplayName,
  isSavingName,
  onSaveDisplayName,
  isPartnerModalVisible,
  isLogoutModalVisible,
  onCloseLogoutModal,
  isLoggingOut,
  onConfirmLogout,
  isDeleteModalVisible,
  onCloseDeleteModal,
  isDeletingAccount,
  onConfirmDelete,
  isGuestModalVisible,
  isDisplayLanguageModalVisible,
  onCloseDisplayLanguageModal,
  isLanguageModalVisible,
  onCloseLanguageModal,
  onCloseGuestModal,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <AppSheet visible={isModalVisible} onClose={onCloseModal} title={t('settings.changeAvatar')}>
        <Typography variant="caption" color="textSecondary" style={{ marginBottom: 12 }}>
          {t('settings.changeAvatarDescription')}
        </Typography>

        {previewUri ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: previewUri }} style={styles.previewAvatar} />
          </View>
        ) : (
          <View style={styles.previewContainer}>
            <Avatar size={80} fallbackText={userInitials} bgColor={theme.primary} textColor="#FFFFFF" borderColor={theme.background} borderWidth={3} />
          </View>
        )}

        <TouchableOpacity
          style={[styles.uploadLocalButton, { backgroundColor: theme.successBg, borderColor: theme.successBorder }]}
          activeOpacity={0.8}
          onPress={onPickLocalFile}
        >
          <Upload size={18} color={theme.primary} style={{ marginRight: 8 }} />
          <Typography variant="bodyLarge" color="primary">{t('settings.selectPhoto')}</Typography>
        </TouchableOpacity>

        <TextInput
          style={[styles.customUrlInput, { backgroundColor: theme.cardBackground, borderColor: theme.border, color: theme.textPrimary }]}
          placeholder={t('settings.urlPlaceholder')}
          placeholderTextColor={theme.textMuted}
          value={customUrl}
          onChangeText={onChangeCustomUrl}
        />

        <Button
          label={isCompressing ? t('profile.compressingPhoto') : isUpdating ? t('settings.savingAvatar') : t('settings.saveAvatar')}
          variant="primary"
          disabled={isUpdating || isCompressing}
          onPress={onSaveAvatar}
        />
      </AppSheet>

      <AppSheet visible={isNameModalVisible} onClose={onCloseNameModal} title={t('settings.editDisplayName')}>
        <Typography variant="caption" color="textSecondary" style={{ marginBottom: 12 }}>
          {t('settings.editDisplayNameDescription')}
        </Typography>
        <TextInput
          style={[styles.customUrlInput, { backgroundColor: theme.cardBackground, borderColor: theme.border, color: theme.textPrimary }]}
          placeholder={t('settings.namePlaceholder')}
          placeholderTextColor={theme.textMuted}
          value={inputDisplayName}
          onChangeText={onChangeDisplayName}
          maxLength={30}
        />
        <Button
          label={isSavingName ? t('settings.savingName') : t('settings.saveDisplayName')}
          variant="primary"
          disabled={isSavingName}
          onPress={onSaveDisplayName}
        />
      </AppSheet>

      <AppSheet visible={isPartnerModalVisible} onClose={() => {}} title={t('settings.partnerProfile')}>
        <View style={styles.previewContainer}>
          <Avatar size={80} fallbackText="P" bgColor={theme.primary} textColor="#FFFFFF" borderColor={theme.background} borderWidth={3} />
        </View>
      </AppSheet>

      <AppSheet visible={isLogoutModalVisible} onClose={onCloseLogoutModal} title={t('settings.logout')} titleColor="accent" animationType="fade">
        <Typography variant="body" color="textPrimary" style={{ marginVertical: spacing.md, textAlign: 'center' }}>
          {t('settings.logoutConfirm')}
        </Typography>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Button label={t('common.cancel')} variant="secondary" onPress={onCloseLogoutModal} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label={isLoggingOut ? t('settings.loggingOut') : t('settings.logout')} variant="primary" style={{ backgroundColor: theme.accent }} disabled={isLoggingOut} onPress={onConfirmLogout} />
          </View>
        </View>
      </AppSheet>

      <AppSheet visible={isDeleteModalVisible} onClose={onCloseDeleteModal} title={t('settings.deleteAccount')} titleColor="accent" animationType="fade">
        <View style={[styles.securityBadgeBox, { backgroundColor: theme.errorBg, borderColor: theme.errorBorder }]}>
          <Trash2 size={32} color="#EF6C57" style={{ marginBottom: 6 }} />
          <Typography variant="cardTitle" color="accent" style={{ marginBottom: 4 }}>
            {t('settings.deleteAccountWarning')}
          </Typography>
          <Typography variant="caption" color="textSecondary" style={{ textAlign: 'center' }}>
            {t('settings.deleteAccountDescription')}
          </Typography>
        </View>
        <Typography variant="body" color="textPrimary" style={{ marginVertical: spacing.sm, textAlign: 'center' }}>
          {t('settings.deleteAccountConfirm')}
        </Typography>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <View style={{ flex: 1 }}>
            <Button label={t('common.cancel')} variant="secondary" onPress={onCloseDeleteModal} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label={isDeletingAccount ? t('settings.deleting') : t('settings.deleteAccount')} variant="accent" disabled={isDeletingAccount} onPress={onConfirmDelete} />
          </View>
        </View>
      </AppSheet>
    </>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  previewAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  uploadLocalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  customUrlInput: {
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  securityBadgeBox: {
    borderRadius: 18,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    marginVertical: spacing.sm,
  },
});
