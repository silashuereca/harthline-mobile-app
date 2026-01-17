// design-system/utils/createThemedStyles.ts

import { useMemo } from 'react';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from '../theme/types';

type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

/**
 * Creates a memoized StyleSheet based on the current theme
 * Prevents recreation on every render when theme doesn't change
 *
 * @example
 * const useStyles = createThemedStyles((theme) => ({
 *   container: {
 *     backgroundColor: theme.colors.background,
 *     padding: theme.spacing.lg,
 *   },
 * }));
 *
 * // In component:
 * const styles = useStyles();
 */
export function createThemedStyles<T extends NamedStyles<T>>(
  createStyles: (theme: Theme) => T
) {
  return (theme: Theme) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMemo(() => StyleSheet.create(createStyles(theme)), [theme]);
  };
}
