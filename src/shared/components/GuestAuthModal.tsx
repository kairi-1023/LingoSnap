import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Sparkles, X } from 'lucide-react-native';
import { Typography } from './Typography';
import { AppSheet } from './AppSheet';
import { SocialAuthButton } from './SocialAuthButton';
import { Logo } from './Logo';
import { useAuth } from '../hooks/useAuth';
import { useThemeStore } from '../stores/useThemeStore';

interface GuestAuthModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const GuestAuthModal: React.FC<GuestAuthModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
}) => {
  const { t } = useTranslation();
  const { signInWithGoogle, signInWithFacebook } = useAuth();
  const { theme } = useThemeStore();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'OAuthCancelledError') {
        return;
      }
      const message = error instanceof Error ? error.message : t('auth.googleSignInError');
      Alert.alert(
        t('auth.googleSignInTitle'),
        message
      );
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoadingFacebook(true);
    try {
      await signInWithFacebook();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'OAuthCancelledError') {
        return;
      }
      const message = error instanceof Error ? error.message : t('auth.facebookSignInError');
      Alert.alert(
        t('auth.facebookSignInTitle'),
        message
      );
    } finally {
      setLoadingFacebook(false);
    }
  };

  return (
    <AppSheet
      visible={visible}
      onClose={onClose}
      presentation="centerDialog"
      contentStyle={{ maxWidth: 380, padding: 20, alignItems: 'center' }}
    >
          {/* Header Bar */}
          <View style={styles.header}>
            <View style={styles.badgeRow}>
              <Sparkles size={14} color="#5CB85C" style={{ marginRight: 4 }} />
              <Typography variant="caption" color="primary" style={{ fontWeight: '700' }}>
                {t('auth.oneSecSignIn')}
              </Typography>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7} accessibilityLabel={t('common.close')} accessibilityRole="button" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Logo & Info */}
          <View style={styles.bodySection}>
            <Logo width={120} height={80} />
            <Typography variant="cardTitle" align="center" style={styles.modalTitle}>
              {title || t('auth.saveStreak')}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              align="center"
              style={styles.modalSubtitle}
            >
              {subtitle || t('auth.signInPrompt')}
            </Typography>
          </View>

          {/* Social Sign In Buttons */}
          <View style={styles.buttonSection}>
            <SocialAuthButton
              provider="google"
              onPress={handleGoogleSignIn}
              loading={loadingGoogle}
              disabled={loadingFacebook}
              style={{ marginBottom: 10 }}
            />
            <SocialAuthButton
              provider="facebook"
              onPress={handleFacebookSignIn}
              loading={loadingFacebook}
              disabled={loadingGoogle}
            />
          </View>

          {/* Later Dismiss Option */}
          <TouchableOpacity onPress={onClose} style={styles.dismissBtn} activeOpacity={0.7}>
            <Typography variant="caption" color="textSecondary" style={{ fontWeight: '600' }}>
              {t('auth.maybeLater')}
            </Typography>
          </TouchableOpacity>
    </AppSheet>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(92, 184, 92, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  closeBtn: {
    padding: 4,
  },
  bodySection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 300,
  },
  buttonSection: {
    width: '100%',
    marginTop: 8,
    marginBottom: 12,
  },
  dismissBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
});

export default GuestAuthModal;
