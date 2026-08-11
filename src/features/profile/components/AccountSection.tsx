import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LogOut, Trash2, ChevronRight } from 'lucide-react-native';
import { Typography } from '../../../shared/components/Typography';

interface AccountSectionProps {
  theme: any;
  themeColors: any;
  isGuest: boolean | undefined;
  onOpenLogoutModal: () => void;
  onOpenDeleteAccountModal: () => void;
  onGuestSignIn: () => void;
  t: (...args: any[]) => any;
}

export const AccountSection: React.FC<AccountSectionProps> = React.memo(({
  theme,
  themeColors,
  isGuest,
  onOpenLogoutModal,
  onOpenDeleteAccountModal,
  onGuestSignIn,
  t,
}) => {
  return (
    <>
      <Typography variant="caption" color="textSecondary" style={{ marginTop: 16, marginBottom: 12, marginLeft: 4 }}>
        {t('settings.accountSection')}
      </Typography>
      <View style={[styles.card, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.7}
          onPress={isGuest ? onGuestSignIn : onOpenLogoutModal}
        >
          <View style={styles.itemLeft}>
            <View style={[styles.iconBadge, { backgroundColor: theme.fillSubtle }]}>
              <LogOut size={18} color={isGuest ? theme.primary : theme.secondary} />
            </View>
            <Typography variant="bodyLarge" style={[styles.itemLabel, { color: isGuest ? theme.primary : themeColors.textPrimary }]}>
              {isGuest ? t('settings.loginSignup') : t('settings.logout')}
            </Typography>
          </View>
          <ChevronRight size={18} color={themeColors.textSecondary} />
        </TouchableOpacity>

        {!isGuest && (
          <>
            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
            <TouchableOpacity
              style={styles.item}
              activeOpacity={0.7}
              onPress={onOpenDeleteAccountModal}
            >
              <View style={styles.itemLeft}>
                <View style={[styles.iconBadge, { backgroundColor: theme.fillSubtle }]}>
                  <Trash2 size={18} color="#EF6C57" />
                </View>
                <Typography variant="bodyLarge" color="accent" style={styles.itemLabel}>
                  {t('settings.deleteAccount')}
                </Typography>
              </View>
              <View style={[styles.destructiveBadge, { backgroundColor: theme.errorBg }]}>
                <Typography variant="caption" style={styles.destructiveBadgeText}>
                  {t('settings.irreversibleAction')}
                </Typography>
                <ChevronRight size={16} color="#EF6C57" />
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
});

AccountSection.displayName = 'AccountSection';

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
  divider: {
    height: 1,
    marginLeft: 64,
  },
  destructiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 2,
  },
  destructiveBadgeText: {
    color: '#EF6C57',
    fontWeight: '600',
    fontSize: 12,
  },
});
