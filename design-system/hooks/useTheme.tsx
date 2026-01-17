// design-system/hooks/useTheme.tsx

import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

/**
 * Hook to access theme and color mode
 *
 * @example
 * const { theme, isDark, setColorMode } = useTheme();
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
