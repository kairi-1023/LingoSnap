// Primitive Brand Palette
export const palette = {
  sageGreen: '#5CB85C',
  sageGreenDark: '#4AA34A',
  warmAmber: '#FFB84D',
  warmAmberDark: '#E6A33B',
  creamWhite: '#FFFDF7',
  coral: '#EF6C57',
  charcoal: '#2F3437',
  
  white: '#FFFFFF',
  black: '#2F3437',
  
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  
  // Dark Mode Base (Soft Midnight Warmth Standard)
  darkBg: '#181A1B',
  darkSurface: '#222527',
  darkSurfaceSecondary: '#2A2E31',
  darkBorder: '#34393D',

  // Dark Mode Card Tints
  darkGreenTint: '#18271C',
  darkGreenBorder: '#253B2B',
  darkAmberTint: '#272018',
  darkAmberBorder: '#3D3021',
  darkCoralTint: '#2B1D1B',
  darkCoralBorder: '#442926',
} as const;

// 1. Light Theme Semantic Color Tokens
export const lightColors = {
  primary: palette.sageGreen,
  primaryActive: palette.sageGreenDark,
  secondary: palette.warmAmber,
  accent: palette.coral,
  
  background: palette.creamWhite,
  surface: palette.white,
  surfaceSecondary: '#F8FAF8',
  
  textPrimary: palette.charcoal,
  textSecondary: palette.gray500,
  textMuted: palette.gray400,
  textInverse: palette.creamWhite,
  
  border: palette.gray200,
  borderFocused: palette.sageGreen,
  
  disabled: palette.gray100,
  disabledText: palette.gray400,
  
  streakBg: '#FFF7E6',
  streakBorder: '#FFE0A3',
  streakText: '#FF8A00',

  cardGreenBg: '#F4F9F4',
  cardGreenBorder: '#D8ECD8',
  cardAmberBg: '#FFF9F0',
  cardAmberBorder: '#FFE8C2',
  cardCoralBg: '#FAF0EE',
  cardCoralBorder: '#F7D6D0',

  success: palette.sageGreen,
  warning: palette.warmAmber,
  error: palette.coral,
  info: '#3B82F6',
} as const;

// 2. Dark Theme Semantic Color Tokens (Soft Midnight Warmth)
export const darkColors = {
  primary: palette.sageGreen,
  primaryActive: palette.sageGreenDark,
  secondary: palette.warmAmber,
  accent: palette.coral,
  
  background: palette.darkBg,
  surface: palette.darkSurface,
  surfaceSecondary: palette.darkSurfaceSecondary,
  
  textPrimary: '#F3F4F6',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textInverse: palette.charcoal,
  
  border: palette.darkBorder,
  borderFocused: palette.sageGreen,
  
  disabled: palette.darkBorder,
  disabledText: palette.gray500,
  
  streakBg: palette.darkAmberTint,
  streakBorder: palette.darkAmberBorder,
  streakText: palette.warmAmber,

  cardGreenBg: palette.darkGreenTint,
  cardGreenBorder: palette.darkGreenBorder,
  cardAmberBg: palette.darkAmberTint,
  cardAmberBorder: palette.darkAmberBorder,
  cardCoralBg: palette.darkCoralTint,
  cardCoralBorder: palette.darkCoralBorder,

  success: palette.sageGreen,
  warning: palette.warmAmber,
  error: palette.coral,
  info: '#60A5FA',
} as const;

// Default export uses Light theme for MVP
export const colors = lightColors;

export type ColorTokens = typeof lightColors;
