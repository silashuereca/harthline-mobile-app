// design-system/tokens/colors.ts

/**
 * Base color palette - raw values only
 * Components should NOT import these directly
 */
export const palette = {
  // Neutrals
  neutral0: '#FFFFFF',
  neutral50: '#F9FAFB',
  neutral100: '#F3F4F6',
  neutral200: '#E5E7EB',
  neutral300: '#D1D5DB',
  neutral400: '#9CA3AF',
  neutral500: '#6B7280',
  neutral600: '#4B5563',
  neutral700: '#374151',
  neutral800: '#1F2937',
  neutral900: '#111827',
  neutral950: '#030712',

  // Primary (Blue)
  primary50: '#EFF6FF',
  primary100: '#DBEAFE',
  primary200: '#BFDBFE',
  primary300: '#93C5FD',
  primary400: '#60A5FA',
  primary500: '#3B82F6',
  primary600: '#2563EB',
  primary700: '#1D4ED8',
  primary800: '#1E40AF',
  primary900: '#1E3A8A',

  // Secondary (Purple)
  secondary50: '#FAF5FF',
  secondary100: '#F3E8FF',
  secondary200: '#E9D5FF',
  secondary300: '#D8B4FE',
  secondary400: '#C084FC',
  secondary500: '#A855F7',
  secondary600: '#9333EA',
  secondary700: '#7E22CE',
  secondary800: '#6B21A8',
  secondary900: '#581C87',

  // Success (Green)
  success50: '#F0FDF4',
  success100: '#DCFCE7',
  success500: '#22C55E',
  success600: '#16A34A',
  success700: '#15803D',

  // Danger (Red)
  danger50: '#FEF2F2',
  danger100: '#FEE2E2',
  danger500: '#EF4444',
  danger600: '#DC2626',
  danger700: '#B91C1C',

  // Warning (Amber)
  warning50: '#FFFBEB',
  warning100: '#FEF3C7',
  warning500: '#F59E0B',
  warning600: '#D97706',
  warning700: '#B45309',
} as const;

export type PaletteColor = keyof typeof palette;
