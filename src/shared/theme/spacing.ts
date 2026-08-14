import { Dimensions } from 'react-native';

// 1. Strict 8pt Grid System Tokens (Never use arbitrary values like 13, 22, 37)
export const spacingTokens = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

// 2. Safe Area & Device Layout Tokens
export const layoutTokens = {
  get windowWidth() { return Dimensions.get('window').width; },
  get windowHeight() { return Dimensions.get('window').height; },
  get isSmallDevice() { return Dimensions.get('window').width < 360; },
  get isTablet() { return Dimensions.get('window').width >= 600; },
  maxContentWidthTablet: 560,
  minTouchTarget: 44, // Minimum 44x44px touch target for accessibility
} as const;

export const radiusTokens = {
  none: 0,
  sm: 8,
  md: 12,
  button: 16,
  card: 20,
  cardLg: 24,
  sheet: 28,
  full: 9999,
} as const;

export const spacing = spacingTokens;
export const layout = layoutTokens;
export const radius = radiusTokens;


