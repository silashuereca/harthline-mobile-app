// design-system/components/UserAvatar.tsx

import React from 'react';
import { View, Image, ViewProps, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface UserAvatarProps extends Omit<ViewProps, 'children'> {
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 64,
  xl: 96,
} as const;

const iconSizeMap = {
  sm: 16,
  md: 20,
  lg: 32,
  xl: 40,
} as const;

/**
 * UserAvatar component for displaying user profile photos
 * Shows avatar image if available, otherwise displays a placeholder icon
 *
 * @example
 * <UserAvatar avatarUrl={user?.avatar_url} size="md" />
 * <UserAvatar avatarUrl={user?.avatar_url} size="lg" />
 */
export function UserAvatar({
  avatarUrl,
  size = 'md',
  style,
  ...rest
}: UserAvatarProps) {
  const { theme } = useTheme();

  const avatarSize = sizeMap[size];
  const iconSize = iconSizeMap[size];
  const borderRadius = avatarSize / 2;

  const containerStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius,
  };

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={[containerStyle, style]}
        {...rest}
      />
    );
  }

  return (
    <View
      style={[
        containerStyle,
        {
          backgroundColor: theme.colors.surface,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      {...rest}
    >
      <Ionicons name="person" size={iconSize} color={theme.colors.textMuted} />
    </View>
  );
}
