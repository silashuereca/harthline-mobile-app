// design-system/index.ts

// Theme
export { lightTheme, darkTheme } from './theme';
export type { Theme, ThemeColors, ColorMode } from './theme';

// Hooks
export { useTheme } from './hooks/useTheme';
export { ThemeProvider } from './hooks/ThemeProvider';

// Components
export { AppText, AppButton, AppCard } from './components';

// Utils
export { createThemedStyles } from './utils/createThemedStyles';
export { alpha } from './utils/alpha';

// Tokens (optional - components should prefer theme over direct token access)
export { spacing } from './tokens/spacing';
export { radius } from './tokens/radius';
export { shadows } from './tokens/shadows';
export { zIndex } from './tokens/zIndex';
export { typographyPresets } from './tokens/typography';
