// design-system/components/AppText.tsx

import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { TypographyPreset } from '../tokens/typography';

interface AppTextProps extends TextProps {
  variant?: TypographyPreset;
  color?: keyof typeof styles;
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
}

const fontWeightMap = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
};

/**
 * AppText component with typography variants and theme support
 * Supports Dynamic Type via allowFontScaling
 *
 * @example
 * <AppText variant="title" color="primary">Hello World</AppText>
 * <AppText variant="body" color="muted">Subtitle text</AppText>
 */
export function AppText({
  variant = 'body',
  color = 'default',
  weight,
  style,
  children,
  ...rest
}: AppTextProps) {
  const { theme } = useTheme();

  const typographyStyle = theme.typography[variant];

  const textColor =
    color === 'default'
      ? theme.colors.text
      : color === 'muted'
      ? theme.colors.textMuted
      : color === 'inverse'
      ? theme.colors.textInverse
      : color === 'primary'
      ? theme.colors.primary
      : color === 'danger'
      ? theme.colors.danger
      : color === 'success'
      ? theme.colors.success
      : theme.colors.text;

  const fontWeight = weight ? fontWeightMap[weight] : typographyStyle.fontWeight;

  return (
    <Text
      style={[
        {
          fontSize: typographyStyle.fontSize,
          lineHeight: typographyStyle.lineHeight,
          letterSpacing: typographyStyle.letterSpacing,
          fontWeight,
          color: textColor,
        },
        style,
      ]}
      allowFontScaling
      {...rest}
    >
      {children}
    </Text>
  );
}

// Type augmentation for color prop autocomplete
const styles = {
  default: null,
  muted: null,
  inverse: null,
  primary: null,
  danger: null,
  success: null,
};
