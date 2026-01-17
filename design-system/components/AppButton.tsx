// design-system/components/AppButton.tsx

import React from 'react';
import {
  Pressable,
  PressableProps,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { AppText } from './AppText';

interface AppButtonProps extends Omit<PressableProps, 'style'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: string;
  style?: ViewStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * AppButton component with variants and accessibility support
 * Minimum 44pt touch target height
 * Uses Pressable for better press state handling
 *
 * @example
 * <AppButton variant="primary" onPress={handlePress}>
 *   Submit
 * </AppButton>
 * <AppButton variant="ghost" loading>Loading...</AppButton>
 * <AppButton variant="primary" icon={<Icon name="logo-google" />}>
 *   Sign in with Google
 * </AppButton>
 */
export function AppButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  children,
  icon,
  iconPosition = 'left',
  ...rest
}: AppButtonProps) {
  const { theme } = useTheme();

  const isDisabled = disabled || loading;

  // Size configurations
  const sizeConfig = {
    sm: {
      height: 44, // Min touch target
      paddingHorizontal: theme.spacing.lg,
      fontSize: theme.typography.body.fontSize,
    },
    md: {
      height: 48,
      paddingHorizontal: theme.spacing.xl,
      fontSize: theme.typography.body.fontSize,
    },
    lg: {
      height: 56,
      paddingHorizontal: theme.spacing['2xl'],
      fontSize: theme.typography.bodyLarge.fontSize,
    },
  }[size];

  // Variant configurations
  const getVariantConfig = (pressed: boolean) => {
    const configs = {
      primary: {
        backgroundColor: isDisabled
          ? theme.colors.primaryDisabled
          : pressed
          ? theme.colors.primaryHover
          : theme.colors.primary,
        textColor: theme.colors.primaryText,
      },
      secondary: {
        backgroundColor: isDisabled
          ? theme.colors.primaryDisabled
          : pressed
          ? theme.colors.secondaryHover
          : theme.colors.secondary,
        textColor: theme.colors.secondaryText,
      },
      ghost: {
        backgroundColor: pressed ? theme.colors.surface2 : 'transparent',
        textColor: isDisabled ? theme.colors.textMuted : theme.colors.primary,
      },
      danger: {
        backgroundColor: isDisabled
          ? theme.colors.primaryDisabled
          : pressed
          ? theme.colors.dangerBackground
          : theme.colors.danger,
        textColor: theme.colors.dangerText,
      },
    };

    return configs[variant];
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        {
          height: sizeConfig.height,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          backgroundColor: getVariantConfig(pressed).backgroundColor,
          borderRadius: theme.radius.lg,
          width: fullWidth ? '100%' : undefined,
          opacity: isDisabled ? 0.5 : 1,
          gap: icon ? 8 : 0,
        },
        variant === 'ghost' && {
          borderWidth: 1,
          borderColor: isDisabled ? theme.colors.border : theme.colors.primary,
        },
        style,
      ]}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      {...rest}
    >
      {({ pressed }) =>
        loading ? (
          <ActivityIndicator
            color={getVariantConfig(pressed).textColor}
            size="small"
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            <AppText
              style={{
                fontSize: sizeConfig.fontSize,
                color: getVariantConfig(pressed).textColor,
              }}
              weight="semiBold"
            >
              {children}
            </AppText>
            {icon && iconPosition === 'right' && icon}
          </>
        )
      }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
