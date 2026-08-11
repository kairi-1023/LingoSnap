import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Platform } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { Typography } from './Typography';
import { useThemeStore } from '../stores/useThemeStore';

interface LanguageOptionTileProps {
  code: string;
  name: string;
  nativeName?: string;
  flag: string;
  isSelected?: boolean;
  onSelect: (code: string) => void;
  style?: any;
}

export const LanguageOptionTile: React.FC<LanguageOptionTileProps> = ({
  code,
  name,
  nativeName,
  flag,
  isSelected = false,
  onSelect,
  style,
}) => {
  const { isDarkMode, theme } = useThemeStore();
  const displayName = nativeName && nativeName !== name ? `${nativeName} (${name})` : (nativeName || name);

  return (
    <TouchableOpacity
      style={[
        styles.tileContainer,
        {
          backgroundColor: isSelected
            ? (isDarkMode ? '#1E2F23' : '#F0FDF4')
            : theme.cardBackground,
          borderColor: isSelected ? colors.primary : theme.border,
        },
        style,
      ]}
      activeOpacity={0.75}
      onPress={() => onSelect(code)}
    >
      <View style={styles.leftContent}>
        {/* Flag Emoji with 8pt Spacing */}
        <Text style={styles.flagEmoji}>{flag}</Text>
        <Typography
          variant="bodyLarge"
          style={{ color: isSelected ? colors.primary : theme.textPrimary, fontWeight: isSelected ? '700' : '600' }}
        >
          {displayName}
        </Typography>
      </View>

      {/* Selected Indicator Checkmark */}
      {isSelected && (
        <View style={styles.checkBadge}>
          <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tileContainer: {
    minHeight: 52, // >= 44px Touch Target
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagEmoji: {
    fontSize: 20,
    marginRight: 8, // 8pt Spacing
    ...Platform.select({ android: { includeFontPadding: false } }),
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
