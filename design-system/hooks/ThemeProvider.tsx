// design-system/hooks/ThemeProvider.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, ColorMode } from '../theme/types';
import { lightTheme } from '../theme/lightTheme';
import { darkTheme } from '../theme/darkTheme';

interface ThemeContextValue {
  theme: Theme;
  colorMode: ColorMode;
  isDark: boolean;
  setColorMode: (mode: ColorMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: ReactNode;
  initialColorMode?: ColorMode;
}

/**
 * ThemeProvider component
 * Wraps your app to provide theme context
 *
 * Optional: Install @react-native-async-storage/async-storage to persist color mode
 * Then uncomment the AsyncStorage code below to persist user preference
 */
export function ThemeProvider({
  children,
  initialColorMode = 'system',
}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [colorMode, setColorModeState] = useState<ColorMode>(initialColorMode);

  // Uncomment to persist color mode with AsyncStorage:
  // import AsyncStorage from '@react-native-async-storage/async-storage';
  //
  // useEffect(() => {
  //   AsyncStorage.getItem('colorMode').then((stored) => {
  //     if (stored === 'light' || stored === 'dark' || stored === 'system') {
  //       setColorModeState(stored);
  //     }
  //   });
  // }, []);

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
    // Uncomment to persist:
    // AsyncStorage.setItem('colorMode', mode);
  };

  // Determine actual theme to use
  const isDark =
    colorMode === 'system'
      ? systemColorScheme === 'dark'
      : colorMode === 'dark';

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, colorMode, isDark, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
