import React from 'react';
import { TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Typography } from '../../../shared/components/Typography';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { colors } from '../../../shared/theme/colors';
import { STUDY_CATEGORIES } from '../../../shared/constants/categories';
import { useTranslation } from 'react-i18next';

interface CategoryFilterChipsProps {
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
}

export const CategoryFilterChips: React.FC<CategoryFilterChipsProps> = ({ activeCategory, onSelectCategory }) => {
  const { theme } = useThemeStore();
  const { t } = useTranslation();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
      {STUDY_CATEGORIES.map((chip) => {
        const isSelected = activeCategory === chip.id;
        return (
          <TouchableOpacity
            key={chip.id}
            style={[styles.chipButton, { backgroundColor: isSelected ? colors.primary : theme.chipSurface, borderColor: isSelected ? colors.primary : theme.border }]}
            activeOpacity={0.8}
            onPress={() => onSelectCategory(chip.id)}
          >
            <Typography variant="caption" color={isSelected ? 'white' : 'textSecondary'} style={{ fontWeight: isSelected ? '700' : '500' }}>
              {t(`study.categories.${chip.id}`, chip.label)}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { maxHeight: 48, marginBottom: 12 },
  scrollContainer: { gap: 6, paddingHorizontal: 2, alignItems: 'center' },
  chipButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, borderRadius: 22, borderWidth: 1, height: 44, minWidth: 44 },
});
