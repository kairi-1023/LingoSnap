import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react-native';
import { Typography, TextColorVariant } from './Typography';
import { useThemeStore } from '../stores/useThemeStore';
import { spacing, radius } from '../theme/spacing';

export type AppSheetPresentation = 'bottomSheet' | 'centerDialog';

export interface AppSheetProps {
  visible: boolean;
  onClose: () => void;
  /** bottomSheet: slides up from screen edge. centerDialog: centered floating card. */
  presentation?: AppSheetPresentation;
  /** When provided, renders the standard header row (title + close button). */
  title?: string;
  titleColor?: TextColorVariant;
  /** Defaults: bottomSheet -> 'slide', centerDialog -> 'fade'. */
  animationType?: 'slide' | 'fade' | 'none';
  /** bottomSheet only: renders a grab handle above the content. */
  showDragHandle?: boolean;
  /** Extra slot rendered left of the standard close button (title required). */
  headerRight?: React.ReactNode;
  /** Escape hatch for per-modal layout (padding, maxHeight, maxWidth...). */
  contentStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/**
 * Global Standardized Modal Shell (Single source of truth for modal theming).
 *
 * Owns: overlay scrim (dark-mode aware), elevated sheet surface, radii,
 * optional drag handle, and the standard header with an accessible close button.
 * Screens own only their modal-specific content via children.
 */
export const AppSheet: React.FC<AppSheetProps> = ({
  visible,
  onClose,
  presentation = 'bottomSheet',
  title,
  titleColor = 'textPrimary',
  animationType,
  showDragHandle = false,
  headerRight,
  contentStyle,
  children,
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme, isDarkMode } = useThemeStore();
  const isBottomSheet = presentation === 'bottomSheet';
  const resolvedAnimationType = animationType ?? (isBottomSheet ? 'slide' : 'fade');

  return (
    <Modal
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      animationType={resolvedAnimationType}
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.overlay,
          isBottomSheet ? styles.overlayBottom : styles.overlayCenter,
          { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)' },
        ]}
      >
        <View
          style={[
            styles.sheet,
            isBottomSheet
              ? {
                  borderTopLeftRadius: radius.sheet,
                  borderTopRightRadius: radius.sheet,
                  borderTopWidth: 1,
                  padding: spacing.lg,
                  paddingBottom: spacing.lg + insets.bottom,
                  maxHeight: '85%',
                }
              : {
                  width: '100%',
                  maxWidth: 480,
                  borderRadius: radius.cardLg,
                  borderWidth: 1,
                  padding: spacing.lg,
                  maxHeight: '90%',
                },
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
            contentStyle,
          ]}
        >
          {isBottomSheet && showDragHandle && (
            <View
              style={[
                styles.dragHandle,
                { backgroundColor: isDarkMode ? '#3F4447' : '#E5E7EB' },
              ]}
            />
          )}

          {title ? (
            <View style={styles.headerRow}>
              <Typography variant="cardTitle" color={titleColor} style={styles.headerTitle}>
                {title}
              </Typography>
              <View style={styles.headerActions}>
                {headerRight}
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                  accessibilityLabel={t('common.close')}
                  accessibilityRole="button"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <X size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  overlayBottom: {
    justifyContent: 'flex-end',
  },
  overlayCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  sheet: {},
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  headerTitle: {
    flex: 1,
    marginRight: spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  closeButton: {
    padding: 4,
  },
});

export default AppSheet;
