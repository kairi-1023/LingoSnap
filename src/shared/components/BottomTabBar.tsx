import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, BookOpen, RotateCcw, BookMarked, User, LucideIcon } from 'lucide-react-native';
import { Typography } from './Typography';
import { spacing } from '../theme/spacing';
import { useThemeStore } from '../stores/useThemeStore';
import { useWindowSizeClass } from '../hooks/useWindowSizeClass';

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
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { isLandscape } = useWindowSizeClass();

  return (
    <SafeAreaView
      edges={['bottom']}
      pointerEvents="box-none"
      style={[styles.safeArea, { backgroundColor: theme.cardBackground }]}
    >
      <View
        pointerEvents="box-none"
        style={[
          styles.container,
          isLandscape && styles.containerLandscape,
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
            <Pressable
              key={item.id}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              style={({ pressed }) => [
                styles.tabButton,
                pressed && Platform.OS !== 'android' && { opacity: 0.7 },
              ]}
              android_ripple={{
                color: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                borderless: true,
                radius: 36,
              }}
              onPress={() => onTabPress(item.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={t(item.label)}
            >
              <View style={styles.iconContainer} pointerEvents="none">
                <IconComponent
                  size={23}
                  color={iconColor}
                  strokeWidth={isActive ? 2.6 : 1.7}
                  fill="none"
                />
              </View>
              <Typography
                variant="caption"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.tabLabel,
                  {
                    color: iconColor,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
                pointerEvents="none"
              >
                {t(item.label)}
              </Typography>
            </Pressable>
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
    minHeight: 62,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    overflow: Platform.OS === 'android' ? 'visible' : 'hidden',
    shadowColor: '#2F3437',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
  containerLandscape: {
    minHeight: 48,
    paddingVertical: 2,
  },
  tabButton: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: -0.1,
  },
});


export default BottomTabBar;


