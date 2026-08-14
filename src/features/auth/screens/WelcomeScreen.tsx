import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { spacing } from '../../../shared/theme/spacing';
import { Logo } from '../../../shared/components/Logo';
import { Typography } from '../../../shared/components/Typography';
import { SocialAuthButton } from '../../../shared/components/SocialAuthButton';
import { Toast } from '../../../shared/components/Toast';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { useTranslation } from 'react-i18next';
import { useWindowSizeClass } from '../../../shared/hooks/useWindowSizeClass';

export const WelcomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { handleGoogleSignInWithLoading, signInAsGuest } = useAuth();
  const { theme } = useThemeStore();
  const { isShortHeight, isLandscape } = useWindowSizeClass();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleGoogleSignIn = useCallback(() => {
    handleGoogleSignInWithLoading(setLoadingGoogle, undefined, () => {
      setToastMessage(t('auth.googleSignInError'));
      setToastVisible(true);
    });
  }, [handleGoogleSignInWithLoading, t]);


  const router = useRouter();

  const handleGuestSignIn = () => {
    signInAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.background} />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Top Header Section with Logo & Brand Hierarchy */}
          <View style={[styles.headerSection, (isShortHeight || isLandscape) && styles.headerSectionShort]}>
            <View style={styles.logoWrapper}>
              <Logo width={isLandscape ? 120 : 190} height={isLandscape ? 80 : 130} />
              <Typography
                variant="hero"
                color="textPrimary"
                align="center"
                style={isLandscape ? [styles.brandTitle, styles.brandTitleLandscape] : styles.brandTitle}
              >
                {t('auth.brandTitle')}
              </Typography>
            </View>

            <Typography
              variant="cardTitle"
              color="textPrimary"
              align="center"
              style={styles.headline}
            >
              {t('auth.headline')}
            </Typography>

            <Typography
              variant="body"
              color="textSecondary"
              align="center"
              style={styles.subtitle}
            >
              {t('auth.subtitle')}
            </Typography>
          </View>

          {/* Bottom Social Sign In Buttons & Guest Section */}
          <View style={styles.buttonSection}>
            <SocialAuthButton
              provider="google"
              onPress={handleGoogleSignIn}
              loading={loadingGoogle}
            />

            {/* Guest Mode Link */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleGuestSignIn}
              style={styles.guestButton}
            >
              <Typography variant="caption" color="textSecondary" style={{ fontWeight: '600' }}>
                {t('auth.guestSignIn')}
              </Typography>
            </TouchableOpacity>

            <Typography variant="caption" color="textSecondary" align="center" style={styles.footerTerms}>
              {t('auth.terms')}
            </Typography>
          </View>
        </View>
      </ScrollView>

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type="error"
        onDismiss={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 44,
  },
  headerSectionShort: {
    marginBottom: 20,
  },
  logoWrapper: {
    marginBottom: 16,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
    letterSpacing: -0.5,
  },
  brandTitleLandscape: {
    fontSize: 22,
    marginTop: 2,
  },
  headline: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 24,
    maxWidth: 320,
  },
  buttonSection: {
    width: '100%',
  },
  buttonSpacing: {
    marginBottom: 12,
  },
  guestButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 6,
  },
  footerTerms: {
    marginTop: 18,
    lineHeight: 20,
  },
});

export default WelcomeScreen;
