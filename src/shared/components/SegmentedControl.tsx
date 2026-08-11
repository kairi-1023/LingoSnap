import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Typography } from './Typography';
import { useThemeStore } from '../stores/useThemeStore';

export interface SegmentItem<T extends string = string> {
  id: T;
  label: string;
}

export interface SegmentedControlProps<T extends string = string> {
  items: SegmentItem<T>[];
  activeId: T;
  onSelect: (id: T) => void;
  style?: ViewStyle;
}

export function SegmentedControl<T extends string = string>({
  items,
  activeId,
  onSelect,
  style,
}: SegmentedControlProps<T>) {
  const { isDarkMode, theme } = useThemeStore();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? '#1E1E1E' : '#F3F4F6',
          borderColor: theme.border,
        },
        style,
      ]}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.segmentItem,
              isActive && [
                styles.segmentItemActive,
                { backgroundColor: theme.cardBackground },
              ],
            ]}
            activeOpacity={0.8}
            onPress={() => onSelect(item.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Typography
              variant="caption"
              color={isActive ? 'textPrimary' : 'textSecondary'}
              style={isActive ? styles.textActive : undefined}
            >
              {item.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  segmentItem: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    backgroundColor: '#FFFFFF',
  },
  textActive: {
    fontWeight: '700',
  },
});

export default SegmentedControl;
