import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Search, XCircle, Heart, Sparkles } from 'lucide-react-native';
import { Typography } from '../../../shared/components/Typography';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

export type CategoryFilter = 'all' | 'favorites' | 'recent';

interface DictionaryToolbarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  activeFilter: CategoryFilter;
  onSelectFilter: (filter: CategoryFilter) => void;
  allCount: number;
  favCount: number;
  recentCount: number;
  t: (...args: any[]) => any;
}

export const DictionaryToolbar: React.FC<DictionaryToolbarProps> = React.memo(({
  searchQuery,
  onSearchChange,
  activeFilter,
  onSelectFilter,
  allCount,
  favCount,
  recentCount,
  t,
}) => {
  const { theme } = useThemeStore();

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={[styles.searchBar, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <Search size={16} color={theme.textSecondary} style={{ marginRight: 6 }} />
        <TextInput
          style={[styles.searchInput, { color: theme.textPrimary }]}
          placeholder={t('study.search')}
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onSearchChange('')}
            style={{ padding: 2 }}
            accessibilityLabel={t('study.clearSearch')}
            accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <XCircle size={15} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Compact Filter Badges Row */}
      <View style={styles.filtersRow}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            {
              backgroundColor: activeFilter === 'all' ? theme.successBg : theme.insetSurface,
              borderColor: activeFilter === 'all' ? theme.primary : theme.border,
            },
          ]}
          activeOpacity={0.8}
          onPress={() => onSelectFilter('all')}
        >
          <Typography
            variant="caption"
            color={activeFilter === 'all' ? 'primary' : 'textSecondary'}
            style={{ fontWeight: activeFilter === 'all' ? '700' : '600' }}
          >
            {t('study.learnedCount', { count: allCount })}
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            {
              backgroundColor: activeFilter === 'favorites' ? theme.successBg : theme.insetSurface,
              borderColor: activeFilter === 'favorites' ? theme.primary : theme.border,
            },
          ]}
          activeOpacity={0.8}
          onPress={() => onSelectFilter('favorites')}
        >
          <Heart
            size={12}
            color={activeFilter === 'favorites' ? colors.primary : colors.accent}
            fill={activeFilter === 'favorites' ? colors.primary : colors.accent}
            style={{ marginRight: 3 }}
          />
          <Typography
            variant="caption"
            color={activeFilter === 'favorites' ? 'primary' : 'textSecondary'}
            style={{ fontWeight: activeFilter === 'favorites' ? '700' : '600' }}
          >
            {favCount}
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            {
              backgroundColor: activeFilter === 'recent' ? theme.streakBg : theme.insetSurface,
              borderColor: activeFilter === 'recent' ? theme.streakBorder : theme.border,
            },
          ]}
          activeOpacity={0.8}
          onPress={() => onSelectFilter('recent')}
        >
          <Sparkles size={12} color={colors.secondary} style={{ marginRight: 3 }} />
          <Typography
            variant="caption"
            color={activeFilter === 'recent' ? 'secondary' : 'textSecondary'}
            style={{ fontWeight: activeFilter === 'recent' ? '700' : '600' }}
          >
            {recentCount}
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
});

DictionaryToolbar.displayName = 'DictionaryToolbar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 14,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    height: 38,
  },
});
