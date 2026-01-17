// design-system/tokens/typography.ts

import { TextStyle } from 'react-native';

/**
 * Font families (use SF Pro for iOS, Roboto for Android)
 * Expo includes SF Pro on iOS by default
 */
export const fontFamily = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
} as const;

/**
 * Font weights
 */
export const fontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semiBold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
} as const;

/**
 * Font sizes - scaled for readability
 */
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

/**
 * Line heights (unitless multipliers)
 */
export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

/**
 * Letter spacing
 */
export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
} as const;

/**
 * Typography presets - use these in components
 */
export const typographyPresets = {
  title: {
    fontSize: fontSize['3xl'],
    lineHeight: fontSize['3xl'] * lineHeight.tight,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
  },
  subtitle: {
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * lineHeight.normal,
    fontWeight: fontWeight.semiBold,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontSize: fontSize.base,
    lineHeight: fontSize.base * lineHeight.normal,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
  },
  bodyLarge: {
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * lineHeight.normal,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
  },
  caption: {
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * lineHeight.normal,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
  },
  label: {
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * lineHeight.normal,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
  },
} as const;

export type TypographyPreset = keyof typeof typographyPresets;
