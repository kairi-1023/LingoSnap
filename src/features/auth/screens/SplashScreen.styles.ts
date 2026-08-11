import { StyleSheet, Dimensions } from 'react-native';
import { spacing } from '../../../shared/theme/spacing';

export const getIllustrationMaxWidth = () => {
  const { width } = Dimensions.get('window');
  return Math.min(width - spacing.xl * 2, 340);
};

export const ILLUSTRATION_MAX_WIDTH = getIllustrationMaxWidth();

export const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1, width: '100%', paddingHorizontal: spacing.lg,
    paddingTop: 24, paddingBottom: 32,
    alignItems: 'center', justifyContent: 'center',
  },
  logoSection: {
    width: '100%', alignItems: 'center', justifyContent: 'center',
    marginBottom: 24, flexShrink: 1,
  },
  brandTitle: { fontSize: 28, fontWeight: '700', marginTop: 8, letterSpacing: -0.5 },
  tagline: { marginTop: 6, lineHeight: 20, fontWeight: '500' },
  illustrationContainer: {
    width: ILLUSTRATION_MAX_WIDTH, aspectRatio: 1,
    alignItems: 'center', justifyContent: 'center',
    borderRadius: 32, backgroundColor: '#FFFFFF',
    marginVertical: 16,
    shadowColor: '#000000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 4, flexShrink: 1,
  },
  illustration: { width: '100%', height: '100%', borderRadius: 32, overflow: 'hidden' },
  loadingSection: {
    width: '100%', maxWidth: 220,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 24, flexShrink: 1,
  },
  progressTrack: {
    width: '100%', height: 4, borderRadius: 2,
    overflow: 'hidden', marginBottom: 12,
  },
  progressFill: { height: '100%', borderRadius: 2 },
  brandFooter: { letterSpacing: 0.8, textTransform: 'uppercase' },
});
