import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import { useThemeStore } from '../stores/useThemeStore';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor: theme.cardGreenBg, borderColor: theme.cardGreenBorder }]}>
        {icon}
      </View>
      <Typography variant="sectionTitle" color="textPrimary" align="center" style={styles.title}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body" color="textSecondary" align="center" style={styles.subtitle}>
          {subtitle}
        </Typography>
      )}
      {actionLabel && onAction && (
        <View style={styles.actionWrapper}>
          <Button
            label={actionLabel}
            variant="secondary"
            onPress={onAction}
            fullWidth={false}
          />
        </View>
      )}
    </View>
  );
});

EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 48,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 20,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    maxWidth: 280,
    lineHeight: 24,
  },
  actionWrapper: {
    marginTop: 24,
  },
});

export default EmptyState;
