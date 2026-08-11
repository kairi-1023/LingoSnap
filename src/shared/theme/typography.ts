import { Platform } from 'react-native';

// 1. Font Family Tokens mapped to the Inter font files loaded in src/app/_layout.tsx
//    ('Inter-Regular' | 'Inter-Medium' | 'Inter-SemiBold' | 'Inter-Bold')
//    Each weight uses its own family name so native platforms render real Inter
//    instead of falling back to the system font.
const buildFontFamily = (loadedName: string): string =>
  Platform.select({
    ios: loadedName,
    android: loadedName,
    web: `'${loadedName}', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    default: loadedName,
  }) as string;

export const fontFamily = {
  regular: buildFontFamily('Inter-Regular'),
  medium: buildFontFamily('Inter-Medium'),
  semibold: buildFontFamily('Inter-SemiBold'),
  bold: buildFontFamily('Inter-Bold'),
} as const;

// 2. Font Weight Tokens
export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

const getFontWeight = (weight: typeof fontWeight[keyof typeof fontWeight]) =>
  Platform.OS === 'android' ? undefined : weight;

// 3. Strict Fixed 7 Standard Typography Scale
export const typographyScale = {
  hero: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: getFontWeight(fontWeight.bold),
  },
  screenTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: getFontWeight(fontWeight.bold),
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: getFontWeight(fontWeight.bold),
  },
  cardTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: getFontWeight(fontWeight.semibold),
  },
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: getFontWeight(fontWeight.regular),
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: getFontWeight(fontWeight.regular),
  },
  caption: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: getFontWeight(fontWeight.medium),
  },
} as const;

// 4. Vocabulary Hierarchy Display Rules Token
export const vocabHierarchy = {
  nativeWord: typographyScale.screenTitle, // Largest (28pt / Bold)
  targetWord: typographyScale.sectionTitle, // Medium (20pt / Bold)
  pronunciation: typographyScale.caption,   // Small (12pt / Medium)
} as const;

export const typography = typographyScale;
export type TypographyVariants = keyof typeof typographyScale;

