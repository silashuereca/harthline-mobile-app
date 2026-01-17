// design-system/theme/lightTheme.ts

import { Theme, ThemeColors } from './types';
import { palette } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { radius } from '../tokens/radius';
import { shadows } from '../tokens/shadows';
import { zIndex } from '../tokens/zIndex';
import { typographyPresets } from '../tokens/typography';

const lightColors: ThemeColors = {
  // Base
  background: palette.neutral0,
  surface: palette.neutral0,
  surface2: palette.neutral50,

  // Text
  text: palette.neutral900,
  textMuted: palette.neutral600,
  textInverse: palette.neutral0,

  // Borders
  border: palette.neutral200,
  borderLight: palette.neutral100,

  // Primary
  primary: palette.primary600,
  primaryText: palette.neutral0,
  primaryHover: palette.primary700,
  primaryDisabled: palette.primary200,

  // Secondary
  secondary: palette.secondary600,
  secondaryText: palette.neutral0,
  secondaryHover: palette.secondary700,

  // Status
  success: palette.success600,
  successText: palette.neutral0,
  successBackground: palette.success50,

  danger: palette.danger600,
  dangerText: palette.neutral0,
  dangerBackground: palette.danger50,

  warning: palette.warning600,
  warningText: palette.neutral900,
  warningBackground: palette.warning50,
};

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  radius,
  shadows,
  zIndex,
  typography: typographyPresets,
};
