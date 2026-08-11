import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/colors';
import { Typography } from './Typography';
import { AppSheet } from './AppSheet';
import { useThemeStore } from '../stores/useThemeStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { getLanguageDisplay } from '../constants/languages';
import { SUPPORTED_I18N_LANGUAGES } from '../i18n';

const DISPLAY_LANGUAGE_NAMES: Record<string, string> = {
  ko: '한국어',
  en: 'English',
};

export interface LanguageDisplaySelectProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageDisplaySelect: React.FC<LanguageDisplaySelectProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();
  const { displayLanguage, setDisplayLanguage } = useSettingsStore();

  return (
    <AppSheet
      visible={visible}
      onClose={onClose}
      presentation="bottomSheet"
      title={t('settings.displayLanguage')}
    >
      <View style={styles.langList}>
        {SUPPORTED_I18N_LANGUAGES.map((code) => {
          const isSelected = displayLanguage === code;
          return (
            <TouchableOpacity
              key={code}
              style={[
                styles.langItem,
                {
                  backgroundColor: isSelected
                    ? (isDarkMode ? '#1E3A25' : '#E6F4E6')
                    : 'transparent',
                  borderColor: isSelected
                    ? colors.primary
                    : (isDarkMode ? '#34393D' : colors.border),
                },
              ]}
              activeOpacity={0.7}
              onPress={async () => {
                await setDisplayLanguage(code);
                onClose();
              }}
            >
              <Typography variant="bodyLarge" color={isSelected ? 'primary' : 'textPrimary'}>
                {getLanguageDisplay(code)}
              </Typography>
              <Typography variant="caption" color="textSecondary" style={styles.langNative}>
                {DISPLAY_LANGUAGE_NAMES[code] || code}
              </Typography>
              {isSelected && (
                <View style={styles.checkContainer}>
                  <Check size={18} color={colors.primary} strokeWidth={3} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </AppSheet>
  );
};

const styles = StyleSheet.create({
  langList: {
    gap: 8,
    paddingTop: 8,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  langNative: {
    marginLeft: 8,
    flex: 1,
  },
  checkContainer: {
    marginLeft: 8,
  },
});

export default LanguageDisplaySelect;
