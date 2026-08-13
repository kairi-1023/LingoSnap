import { Dimensions, PixelRatio } from 'react-native';

// Dynamic Window Dimensions Reader
const getWindowDimensions = () => Dimensions.get('window');

const getSpacingScaleFactor = (width: number): number => {
  if (width < 360) return 0.9;
  if (width > 560) return 1.1;
  return 1.0;
};

const scaleSpacing = (value: number): number => {
  const { width } = getWindowDimensions();
  const scaleFactor = getSpacingScaleFactor(width);
  return Math.round(PixelRatio.roundToNearestPixel(value * scaleFactor));
};

// 1. Strict 8pt Grid System Tokens (Never use arbitrary values like 13, 22, 37)
export const spacingTokens = {
  none: 0,
  xs: scaleSpacing(4),
  sm: scaleSpacing(8),
  md: scaleSpacing(16),
  lg: scaleSpacing(24),
  xl: scaleSpacing(32),
  '2xl': scaleSpacing(48),
  '3xl': scaleSpacing(64),
} as const;

// 2. Safe Area & Device Dimensions (with getters for dynamic screen updates)
const initialDim = getWindowDimensions();
export const layoutTokens = {
  get windowWidth() { return Dimensions.get('window').width; },
  get windowHeight() { return Dimensions.get('window').height; },
  get isSmallDevice() { return Dimensions.get('window').width < 360; },
  get isTablet() { return Dimensions.get('window').width >= 560; },
  maxContentWidthTablet: 560,
  minTouchTarget: 44, // Minimum 44x44px touch target for accessibility
} as const;


export const radiusTokens = {
  none: 0,
  sm: scaleSpacing(8),
  md: scaleSpacing(12),
  button: scaleSpacing(16),
  card: scaleSpacing(20),
  cardLg: scaleSpacing(24),
  sheet: scaleSpacing(28),
  full: 9999,
} as const;

export const spacing = spacingTokens;
export const layout = layoutTokens;
export const radius = radiusTokens;

