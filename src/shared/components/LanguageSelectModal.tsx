import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Check, Globe } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { Typography } from './Typography';
import { Button } from './Button';
import { AppSheet } from './AppSheet';
import { useThemeStore } from '../stores/useThemeStore';
import { SUPPORTED_LANGUAGES, getLanguageInfo, LanguageInfo } from '../utils/languageUtils';

import EnFlag from '../../../assets/images/flags/en.svg';
import KoFlag from '../../../assets/images/flags/ko.svg';
import TlFlag from '../../../assets/images/flags/tl.svg';

const FLAG_SVG_MAP: Record<string, React.ElementType> = {
  en: EnFlag,
  ko: KoFlag,
  tl: TlFlag,
};

export interface LanguageSelectModalProps {
  visible: boolean;
  nativeLang?: string;
  targetLang?: string;
  onClose: () => void;
  onSave: (nativeLang: string, targetLang: string) => Promise<void> | void;
}

export const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  visible,
  nativeLang = 'ko',
  targetLang = 'en',
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const { isDarkMode, theme } = useThemeStore();
  const [selectedNative, setSelectedNative] = useState<string>(nativeLang);
  const [selectedTarget, setSelectedTarget] = useState<string>(targetLang);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setSelectedNative(nativeLang || 'ko');
      setSelectedTarget(targetLang || 'en');
    }
  }, [visible, nativeLang, targetLang]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(selectedNative, selectedTarget);
      onClose();
    } catch (err) {
    } finally {
      setIsSaving(false);
    }
  };

  const nativeInfo = getLanguageInfo(selectedNative);
  const targetInfo = getLanguageInfo(selectedTarget);

  const renderFlagIcon = (lang: LanguageInfo) => {
    const FlagComponent = FLAG_SVG_MAP[lang.code];
    if (!FlagComponent) {
      return (
        <Typography variant="body" style={styles.flagEmoji}>
          {lang.flag}
        </Typography>
      );
    }
    return (
      <View style={styles.flagSvgBox}>
        <FlagComponent width={24} height={24} />
      </View>
    );
  };

  const renderLangItem = (
    lang: LanguageInfo,
    isSelected: boolean,
    accentColor: string,
    selectedBg: string,
  ) => (
    <TouchableOpacity
      key={`${accentColor}-${lang.code}`}
      activeOpacity={0.8}
      onPress={() => {
        if (accentColor === colors.primary) {
          setSelectedNative(lang.code);
        } else {
          setSelectedTarget(lang.code);
        }
      }}
      style={[
        styles.langCard,
        {
          backgroundColor: isSelected
            ? isDarkMode
              ? selectedBg
              : selectedBg
            : isDarkMode
              ? '#181A1B'
              : '#FFFFFF',
          borderColor: isSelected
            ? accentColor
            : isDarkMode
              ? '#34393D'
              : '#E5E7EB',
        },
      ]}
    >
      {renderFlagIcon(lang)}
      <View style={styles.langTextContainer}>
        <Typography
          variant="bodyLarge"
          style={{ color: isSelected ? accentColor : theme.textPrimary, fontWeight: '700' }}
          numberOfLines={1}
        >
          {lang.nativeName}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {lang.name}
        </Typography>
      </View>
      {isSelected && (
        <View style={[styles.checkCircle, { backgroundColor: accentColor }]}>
          <Check size={14} color="#FFFFFF" strokeWidth={3} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <AppSheet
      visible={visible}
      onClose={onClose}
      presentation="centerDialog"
      contentStyle={{ padding: 20 }}
    >
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerRow}>
          <View style={styles.iconBox}>
            <Globe size={20} color={colors.primary} />
          </View>
          <View style={styles.headerTextGroup}>
            <Typography variant="cardTitle">{t('settings.language')}</Typography>
            <Typography variant="caption" color="textSecondary">
              {t('settings.language')}
            </Typography>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Current Pair Summary */}
      <View style={[styles.pairSummary, { backgroundColor: isDarkMode ? '#1A281E' : '#FAF8F3', borderColor: isDarkMode ? '#2E4C34' : '#FFE0A3' }]}>
        <Typography variant="caption" color="textSecondary" align="center" style={styles.pairLabel}>
          {t('profile.currentPair')}
        </Typography>
        <Typography variant="bodyLarge" align="center" style={{ color: theme.textPrimary, fontWeight: '700' }}>
          {nativeInfo.flag} {nativeInfo.name}  →  {targetInfo.flag} {targetInfo.name}
        </Typography>
      </View>

      <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
        {/* Section 1: Native Language */}
        <Typography variant="caption" color="textSecondary" style={{ marginBottom: 10, fontWeight: '700' }}>
          {t('profile.myNativeLanguage')}
        </Typography>
        <View style={styles.langGrid}>
          {SUPPORTED_LANGUAGES.map((lang) =>
            renderLangItem(
              lang,
              selectedNative.toLowerCase() === lang.code.toLowerCase(),
              colors.primary,
              isDarkMode ? '#1E3A25' : '#E6F4E6',
            )
          )}
        </View>

        {/* Section 2: Target Language */}
        <Typography variant="caption" color="textSecondary" style={[styles.sectionLabelSecond, { fontWeight: '700' }]}>
          {t('profile.targetLearningLanguage')}
        </Typography>
        <View style={styles.langGrid}>
          {SUPPORTED_LANGUAGES.map((lang) =>
            renderLangItem(
              lang,
              selectedTarget.toLowerCase() === lang.code.toLowerCase(),
              colors.secondary,
              isDarkMode ? '#33271A' : '#FFF7E6',
            )
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <View style={{ flex: 1 }}>
          <Button label={t('common.cancel')} variant="secondary" onPress={onClose} disabled={isSaving} />
        </View>
        <View style={{ width: 12 }} />
        <View style={{ flex: 1 }}>
          <Button
            label={isSaving ? t('common.saving') : t('common.save')}
            onPress={handleSave}
            disabled={isSaving}
          />
        </View>
      </View>
    </AppSheet>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#E6F4E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextGroup: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginBottom: 14,
  },
  pairSummary: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  pairLabel: {
    marginBottom: 4,
    fontWeight: '700',
  },
  sectionLabelSecond: {
    marginTop: 20,
  },
  langGrid: {
    gap: 8,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 52,
  },
  langTextContainer: {
    flex: 1,
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 12,
    lineHeight: 28,
  },
  flagSvgBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
});
