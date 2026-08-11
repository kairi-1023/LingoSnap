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

// 2. Padding Tokens
export const paddingTokens = {
  screenHorizontal: scaleSpacing(24),
  screenTop: scaleSpacing(16),
  screenBottom: scaleSpacing(32),
  
  cardPaddingSm: scaleSpacing(16),
  cardPaddingMd: scaleSpacing(16),
  cardPaddingLg: scaleSpacing(24),
  
  buttonPaddingHorizontal: scaleSpacing(24),
  buttonPaddingVertical: scaleSpacing(16),
} as const;

// 3. Margin & Gap Tokens
export const marginTokens = {
  sectionGap: scaleSpacing(32),
  elementGap: scaleSpacing(16),
  tightGap: scaleSpacing(8),
  inlineGap: scaleSpacing(8),
} as const;

// 4. Safe Area & Device Dimensions (with getters for dynamic screen updates)
const initialDim = getWindowDimensions();
export const layoutTokens = {
  get windowWidth() { return Dimensions.get('window').width; },
  get windowHeight() { return Dimensions.get('window').height; },
  get isSmallDevice() { return Dimensions.get('window').width < 360; },
  get isTablet() { return Dimensions.get('window').width >= 560; },
  maxContentWidthTablet: 560,
  minTouchTarget: 44, // Minimum 44x44px touch target for accessibility
} as const;

// 5. Border Radius Tokens
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
export const padding = paddingTokens;
export const margin = marginTokens;
export const layout = layoutTokens;
export const radius = radiusTokens;
