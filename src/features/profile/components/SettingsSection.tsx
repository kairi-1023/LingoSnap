import React from 'react';
import { View, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { Moon, Globe, ChevronRight } from 'lucide-react-native';
import { typography } from '../../../shared/theme/typography';
import { Typography } from '../../../shared/components/Typography';
import { formatLanguagePairWithFlags } from '../../../shared/utils/languageUtils';

interface SettingsSectionProps {
  theme: any;
  themeColors: any;
  isDarkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
  onOpenLanguageModal: () => void;
  onOpenDisplayLanguageModal: () => void;
  displayLangInfo: string;
  nativeLang?: string;
  targetLang?: string;
  t: (...args: any[]) => any;
}

export const SettingsSection: React.FC<SettingsSectionProps> = React.memo(({
  theme,
  themeColors,
  isDarkMode,
  onToggleDarkMode,
  onOpenLanguageModal,
  onOpenDisplayLanguageModal,
  displayLangInfo,
  nativeLang,
  targetLang,
  t,
}) => {
  return (
    <>
      <Typography variant="caption" color="textSecondary" style={{ marginTop: 16, marginBottom: 12, marginLeft: 4 }}>
        {t('settings.sectionTitle')}
      </Typography>
      <View style={[styles.card, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBadge, { backgroundColor: theme.fillSubtle }]}>
              <Moon size={18} color={isDarkMode ? theme.secondary : theme.textPrimary} />
            </View>
            <Typography variant="bodyLarge" style={[styles.itemLabel, { color: themeColors.textPrimary }]}>
              {t('settings.darkMode')}
            </Typography>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={onToggleDarkMode}
            trackColor={{ false: themeColors.border, true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

        <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={onOpenLanguageModal}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBadge, { backgroundColor: theme.fillSubtle }]}>
              <Globe size={18} color="#5CB85C" />
            </View>
            <Typography variant="bodyLarge" style={[styles.itemLabel, { color: themeColors.textPrimary }]}>
              {t('settings.language')}
            </Typography>
          </View>
          <View style={styles.itemRight}>
            <Typography variant="caption" style={{ fontWeight: '700', color: theme.primary, marginRight: 6 }}>
              {formatLanguagePairWithFlags(nativeLang, targetLang, true).formatted}
            </Typography>
            <ChevronRight size={18} color={themeColors.textSecondary} />
          </View>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

        <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={onOpenDisplayLanguageModal}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBadge, { backgroundColor: theme.fillSubtle }]}>
              <Globe size={18} color="#5CB85C" />
            </View>
            <Typography variant="bodyLarge" style={[styles.itemLabel, { color: themeColors.textPrimary }]}>
              {t('settings.displayLanguage')}
            </Typography>
          </View>
          <View style={styles.itemRight}>
            <Typography variant="caption" style={{ fontWeight: '700', color: theme.primary, marginRight: 6 }}>
              {displayLangInfo}
            </Typography>
            <ChevronRight size={18} color={themeColors.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
});

SettingsSection.displayName = 'SettingsSection';

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 28,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.1,
    flexShrink: 1,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    marginLeft: 64,
  },
});
