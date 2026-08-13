import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { BottomTabBar } from '../../../shared/components/BottomTabBar';
import { Toast, ToastType } from '../../../shared/components/Toast';
import { Header } from '../../../shared/components/Header';
import { Typography } from '../../../shared/components/Typography';
import { GuestAuthModal } from '../../../shared/components/GuestAuthModal';
import { LanguageSelectModal } from '../../../shared/components/LanguageSelectModal';
import { LanguageDisplaySelect } from '../../../shared/components/LanguageDisplaySelect';
import { authService } from '../../../shared/services/authService';
import { ProfileInfoCard } from '../components/ProfileInfoCard';
import { ProfileModals } from '../components/ProfileModals';
import { SettingsSection } from '../components/SettingsSection';
import { AccountSection } from '../components/AccountSection';

import { useAuthStore } from '../../../shared/stores/useAuthStore';
import { useSettingsStore } from '../../../shared/stores/useSettingsStore';
import { studyService } from '../../../shared/services/studyService';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { getLanguageDisplay } from '../../../shared/constants/languages';
import { useTranslation } from 'react-i18next';

const getLangDisplay = (codeOrName?: string) => getLanguageDisplay(codeOrName);

import { useProfileScreen } from '../hooks/useProfileScreen';

export const ProfileScreen: React.FC = React.memo(() => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const {
    user,
    learnedCount,
    isDarkMode,
    theme,
    themeColors,
    isModalVisible,
    setIsModalVisible,
    selectedAvatarUrl,
    setSelectedAvatarUrl,
    customUrl,
    setCustomUrl,
    isUpdating,
    isCompressing,
    isLanguageModalVisible,
    setIsLanguageModalVisible,
    isGuestModalVisible,
    setIsGuestModalVisible,
    isNameModalVisible,
    setIsNameModalVisible,
    inputDisplayName,
    setInputDisplayName,
    isSavingName,
    toast,
    userName,
    userInitials,
    handleOpenAvatarModal,
    handlePickLocalFile,
    handleSaveAvatar,
    handleSaveDisplayName,
    handleTabPress: handleBottomTabPress,
    handleSignOut,
    showToast,
    router,
  } = useProfileScreen();

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDisplayLanguageModalVisible, setIsDisplayLanguageModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const displayLanguage = useSettingsStore((state) => state.displayLanguage);
  const displayLangInfo = useMemo(() => getLanguageDisplay(displayLanguage), [displayLanguage]);

  const nativeLang = useMemo(() => getLangDisplay(user?.nativeLang || 'ko'), [user?.nativeLang]);
  const targetLang = useMemo(() => getLangDisplay(user?.targetLang || 'en'), [user?.targetLang]);
  const previewUri = selectedAvatarUrl;

  const handleToggleDarkMode = useCallback((value: boolean) => {
    useThemeStore.getState().setDarkMode(value);
    showToast(value ? t('settings.darkModeEnabled') : t('settings.darkModeDisabled'), 'info');
  }, [showToast, t]);

  const handleOpenDeleteAccountModal = useCallback(() => setIsDeleteModalVisible(true), []);
  const handleOpenLogoutModal = useCallback(() => setIsLogoutModalVisible(true), []);
  const handleOpenNameModal = useCallback(() => setIsNameModalVisible(true), []);

  const handleConfirmLogout = useCallback(async () => {
    setIsLoggingOut(true);
    showToast(t('settings.loggingOut'), 'info');
    try {
      await authService.signOut();
      setIsLogoutModalVisible(false);
      router.replace('/(auth)');
    } catch {
      useAuthStore.getState().setUser(null);
      setIsLogoutModalVisible(false);
      router.replace('/(auth)');
    } finally {
      setIsLoggingOut(false);
    }
  }, [showToast, t, router]);

  const handleConfirmDeleteAccount = useCallback(async () => {
    if (!user?.id) return;
    setIsDeletingAccount(true);
    showToast('⚠️ Permanently deleting user account & data...', 'warning');
    try {
      await authService.deleteAccount(user.id);
      setIsDeleteModalVisible(false);
      showToast(t('settings.accountDeleted'), 'info');
      router.replace('/(auth)');
    } catch {
      useAuthStore.getState().setUser(null);
      setIsDeleteModalVisible(false);
      router.replace('/(auth)');
    } finally {
      setIsDeletingAccount(false);
    }
  }, [user?.id, showToast, t, router]);

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={themeColors.statusBarStyle} backgroundColor={themeColors.background} />

      <Header
        title={t('settings.profileAndSettings')}
        showBackButton={true}
        onBackPress={() => router.push('/(tabs)')}
        style={{ backgroundColor: themeColors.background }}
      />

      <Toast visible={toast.visible} message={toast.message} type={toast.type as ToastType} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 64 + insets.bottom + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileInfoCard
          theme={theme}
          user={user}
          userName={userName}
          userInitials={userInitials}
          nativeLang={nativeLang}
          targetLang={targetLang}
          learnedCount={learnedCount}
          onOpenAvatarModal={handleOpenAvatarModal}
          onOpenNameModal={handleOpenNameModal}
          onGuestSignIn={() => setIsGuestModalVisible(true)}
        />

        <SettingsSection
          theme={theme}
          themeColors={themeColors}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onOpenLanguageModal={() => setIsLanguageModalVisible(true)}
          onOpenDisplayLanguageModal={() => setIsDisplayLanguageModalVisible(true)}
          displayLangInfo={displayLangInfo}
          nativeLang={user?.nativeLang}
          targetLang={user?.targetLang}
          t={t}
        />

        <AccountSection
          theme={theme}
          themeColors={themeColors}
          isGuest={user?.isGuest}
          onOpenLogoutModal={handleOpenLogoutModal}
          onOpenDeleteAccountModal={handleOpenDeleteAccountModal}
          onGuestSignIn={() => setIsGuestModalVisible(true)}
          t={t}
        />

        <Typography variant="caption" align="center" style={[styles.footerVersion, { color: themeColors.textSecondary }]}>
          {t('settings.version')}
        </Typography>
      </ScrollView>

      <ProfileModals
        theme={theme}
        isModalVisible={isModalVisible}
        onCloseModal={() => setIsModalVisible(false)}
        previewUri={previewUri}
        userInitials={userInitials}
        isCompressing={isCompressing}
        isUpdating={isUpdating}
        onPickLocalFile={handlePickLocalFile}
        customUrl={customUrl}
        onChangeCustomUrl={(text) => { setCustomUrl(text); setSelectedAvatarUrl(text); }}
        onSaveAvatar={handleSaveAvatar}
        isNameModalVisible={isNameModalVisible}
        onCloseNameModal={() => setIsNameModalVisible(false)}
        inputDisplayName={inputDisplayName}
        onChangeDisplayName={setInputDisplayName}
        isSavingName={isSavingName}
        onSaveDisplayName={handleSaveDisplayName}
        isPartnerModalVisible={false}
        isLogoutModalVisible={isLogoutModalVisible}
        onCloseLogoutModal={() => setIsLogoutModalVisible(false)}
        isLoggingOut={isLoggingOut}
        onConfirmLogout={handleConfirmLogout}
        isDeleteModalVisible={isDeleteModalVisible}
        onCloseDeleteModal={() => setIsDeleteModalVisible(false)}
        isDeletingAccount={isDeletingAccount}
        onConfirmDelete={handleConfirmDeleteAccount}
        isGuestModalVisible={isGuestModalVisible}
        isDisplayLanguageModalVisible={isDisplayLanguageModalVisible}
        onCloseDisplayLanguageModal={() => setIsDisplayLanguageModalVisible(false)}
        isLanguageModalVisible={isLanguageModalVisible}
        onCloseLanguageModal={() => setIsLanguageModalVisible(false)}
        onCloseGuestModal={() => setIsGuestModalVisible(false)}
      />

      <LanguageSelectModal
        visible={isLanguageModalVisible}
        nativeLang={user?.nativeLang || 'ko'}
        targetLang={user?.targetLang || 'en'}
        onClose={() => setIsLanguageModalVisible(false)}
        onSave={async (nativeCode, targetCode) => {
          if (!user?.id) return;
          await authService.updateProfile(user.id, { nativeLang: nativeCode as any, targetLang: targetCode as any });
          await studyService.fetchTodayStudy(nativeCode, targetCode).catch(() => {});
          showToast(t('settings.languageUpdated'), 'success');
        }}
      />

      <LanguageDisplaySelect visible={isDisplayLanguageModalVisible} onClose={() => setIsDisplayLanguageModalVisible(false)} />
      <GuestAuthModal visible={isGuestModalVisible} onClose={() => setIsGuestModalVisible(false)} />
      <BottomTabBar activeTab="profile" onTabPress={handleBottomTabPress} />
    </SafeAreaView>
  );
});

ProfileScreen.displayName = 'ProfileScreen';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 16,
    flexGrow: 1,
  },
  footerVersion: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default ProfileScreen;
