// design-system/components/AppCard.tsx

import React, { ReactNode } from 'react';
import { View, ViewProps, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ShadowKey } from '../tokens/shadows';

interface AppCardProps extends ViewProps {
  children: ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat' | 'rounded';
  shadow?: ShadowKey;
  onPress?: () => void;
}

/**
 * AppCard component - surface container with elevation
 * Use for grouping related content
 *
 * @example
 * <AppCard variant="elevated" shadow="md">
 *   <AppText>Card content</AppText>
 * </AppCard>
 */
export function AppCard({
  children,
  variant = 'elevated',
  shadow = 'md',
  onPress,
  style,
  ...rest
}: AppCardProps) {
  const { theme } = useTheme();

  const baseStyle = {
    backgroundColor: variant === 'rounded' ? '#F5F5F5' : theme.colors.surface,
    borderRadius: variant === 'rounded' ? 20 : theme.radius.lg,
    padding: theme.spacing.lg,
  };

  const variantStyle =
    variant === 'elevated'
      ? theme.shadows[shadow]
      : variant === 'outlined'
      ? {
          borderWidth: 1,
          borderColor: theme.colors.border,
        }
      : variant === 'rounded'
      ? {}
      : {};

  const cardStyle = [baseStyle, variantStyle, style];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.9,
  },
});
