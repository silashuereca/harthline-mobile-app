// design-system/theme/types.ts

import { spacing } from '../tokens/spacing';
import { radius } from '../tokens/radius';
import { shadows } from '../tokens/shadows';
import { zIndex } from '../tokens/zIndex';
import { typographyPresets } from '../tokens/typography';

/**
 * Semantic color roles - these are what components should consume
 */
export interface ThemeColors {
  // Base
  background: string;
  surface: string;
  surface2: string;

  // Text
  text: string;
  textMuted: string;
  textInverse: string;

  // Borders
  border: string;
  borderLight: string;

  // Primary
  primary: string;
  primaryText: string;
  primaryHover: string;
  primaryDisabled: string;

  // Secondary
  secondary: string;
  secondaryText: string;
  secondaryHover: string;

  // Status
  success: string;
  successText: string;
  successBackground: string;

  danger: string;
  dangerText: string;
  dangerBackground: string;

  warning: string;
  warningText: string;
  warningBackground: string;
}

/**
 * Complete theme interface
 */
export interface Theme {
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  zIndex: typeof zIndex;
  typography: typeof typographyPresets;
}

/**
 * Color mode
 */
export type ColorMode = 'light' | 'dark' | 'system';
