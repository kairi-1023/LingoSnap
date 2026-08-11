import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, BookOpen, RotateCcw, BookMarked, User, LucideIcon } from 'lucide-react-native';
import { Typography } from './Typography';
import { spacing } from '../theme/spacing';
import { useThemeStore } from '../stores/useThemeStore';

export type TabType = 'home' | 'study' | 'review' | 'dictionary' | 'profile';

export interface TabItem {
  id: TabType;
  label: string;
  icon: LucideIcon;
}

const TAB_ITEMS: TabItem[] = [
  { id: 'home', label: 'bottomTab.home', icon: Home },
  { id: 'study', label: 'bottomTab.study', icon: BookOpen },
  { id: 'review', label: 'bottomTab.review', icon: RotateCcw },
  { id: 'dictionary', label: 'bottomTab.dictionary', icon: BookMarked },
  { id: 'profile', label: 'bottomTab.profile', icon: User },
];

interface BottomTabBarProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
  style?: ViewStyle;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = React.memo(({
  activeTab,
  onTabPress,
  style,
}) => {
  const { t } = useTranslation();
  const theme = useThemeStore((state) => state.theme);

  return (
    // Bottom edge only: adds gesture-nav / home-indicator inset padding without
    // inflating the bar height with a top inset. Works on both iOS and Android.
    <SafeAreaView edges={['bottom']} style={[styles.safeArea, { backgroundColor: theme.cardBackground }]}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.cardBackground,
            borderTopColor: theme.border,
          },
          style,
        ]}
      >
        {TAB_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;
          const iconColor = isActive ? theme.primary : theme.textSecondary;

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.tabButton}
              activeOpacity={0.7}
              onPress={() => onTabPress(item.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={t(item.label)}
            >
              <View style={styles.iconContainer}>
                <IconComponent
                  size={24}
                  color={iconColor}
                  strokeWidth={isActive ? 2.8 : 1.6}
                  fill="none"
                />
              </View>
              <Typography
                variant="caption"
                style={[
                  styles.tabLabel,
                  {
                    color: iconColor,
                    fontWeight: isActive ? '700' : '400',
                  },
                ]}
              >
                {t(item.label)}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
});

BottomTabBar.displayName = 'BottomTabBar';

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  container: {
    flexDirection: 'row',
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    shadowColor: '#2F3437',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: -0.1,
  },
});

export default BottomTabBar;


