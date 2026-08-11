import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../shared/components/Typography';
import { Button } from '../shared/components/Button';
import { useThemeStore } from '../shared/stores/useThemeStore';
import { useTranslation } from 'react-i18next';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const theme = useThemeStore((state) => state.theme);

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Typography variant="hero" color="primary" style={{ marginBottom: 16 }}>
          404
        </Typography>
        <Typography variant="sectionTitle" style={{ marginBottom: 24, textAlign: 'center' }}>
          {t('errors.errorBoundaryMessage', "This screen doesn't exist.")}
        </Typography>
        <Link href="/(tabs)" asChild>
          <Button label={t('common.goBack', 'Go to Home Screen')} variant="primary" style={{ width: 200 }} />
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
