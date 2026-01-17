// design-system/theme/darkTheme.ts

import { Theme, ThemeColors } from './types';
import { palette } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { radius } from '../tokens/radius';
import { shadows } from '../tokens/shadows';
import { zIndex } from '../tokens/zIndex';
import { typographyPresets } from '../tokens/typography';

const darkColors: ThemeColors = {
  // Base
  background: palette.neutral950,
  surface: palette.neutral900,
  surface2: palette.neutral800,

  // Text
  text: palette.neutral50,
  textMuted: palette.neutral400,
  textInverse: palette.neutral900,

  // Borders
  border: palette.neutral700,
  borderLight: palette.neutral800,

  // Primary - Brand color #FAC722
  primary: '#FAC722',
  primaryText: '#000000', // Dark text for better contrast on yellow
  primaryHover: '#E5B31F', // Slightly darker on press
  primaryDisabled: '#8A7419', // Darker/muted yellow for dark mode

  // Secondary
  secondary: palette.secondary500,
  secondaryText: palette.neutral0,
  secondaryHover: palette.secondary400,

  // Status
  success: palette.success500,
  successText: palette.neutral0,
  successBackground: palette.success700,

  danger: palette.danger500,
  dangerText: palette.neutral0,
  dangerBackground: palette.danger700,

  warning: palette.warning500,
  warningText: palette.neutral900,
  warningBackground: palette.warning700,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  radius,
  shadows,
  zIndex,
  typography: typographyPresets,
};
