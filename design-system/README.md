# Design System

Production-ready, token-based design system for React Native + Expo.

## Features

- ✅ TypeScript-first with full type safety
- ✅ Light/dark mode with system detection
- ✅ Semantic color roles (no hardcoded colors)
- ✅ Accessibility-friendly (WCAG AA, 44pt touch targets, Dynamic Type)
- ✅ Zero third-party styling dependencies
- ✅ Performance-optimized with memoized styles

## Quick Start

### 1. Wrap your app with ThemeProvider

For standard React Native app:

```tsx
// App.tsx
import { ThemeProvider } from './design-system';
import { YourApp } from './YourApp';

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

For Expo Router:

```tsx
// app/_layout.tsx
import { ThemeProvider } from '../design-system';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
```

### 2. Use components

```tsx
import { AppText, AppButton, AppCard } from './design-system';

function MyScreen() {
  return (
    <AppCard variant="elevated">
      <AppText variant="title">Hello World</AppText>
      <AppText variant="body" color="muted">
        Subtitle text
      </AppText>
      <AppButton variant="primary" onPress={handlePress}>
        Submit
      </AppButton>
    </AppCard>
  );
}
```

### 3. Create themed styles

```tsx
import { createThemedStyles, useTheme } from './design-system';

const useStyles = createThemedStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
  },
}));

function MyComponent() {
  const { theme } = useTheme();
  const styles = useStyles(theme);

  return <View style={styles.container}>...</View>;
}
```

## Components

### AppText

Typography component with semantic variants.

```tsx
<AppText variant="title">Title</AppText>
<AppText variant="subtitle">Subtitle</AppText>
<AppText variant="body" color="muted">Body text</AppText>
<AppText variant="caption" weight="semiBold">Caption</AppText>
```

Props:
- `variant`: 'title' | 'subtitle' | 'body' | 'bodyLarge' | 'caption' | 'label'
- `color`: 'default' | 'muted' | 'inverse' | 'primary' | 'danger' | 'success'
- `weight`: 'regular' | 'medium' | 'semiBold' | 'bold'

### AppButton

Button with variants and states.

```tsx
<AppButton variant="primary" onPress={handlePress}>
  Submit
</AppButton>
<AppButton variant="ghost" size="sm" loading>
  Loading...
</AppButton>
```

Props:
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `fullWidth`: boolean

### AppCard

Surface container with elevation.

```tsx
<AppCard variant="elevated" shadow="md">
  <AppText>Card content</AppText>
</AppCard>

<AppCard variant="outlined" onPress={handlePress}>
  <AppText>Pressable card</AppText>
</AppCard>
```

Props:
- `variant`: 'elevated' | 'outlined' | 'flat'
- `shadow`: 'sm' | 'md' | 'lg' | 'xl'
- `onPress`: optional press handler

## Theme Access

```tsx
import { useTheme } from './design-system';

function MyComponent() {
  const { theme, isDark, colorMode, setColorMode } = useTheme();

  // Access tokens
  const spacing = theme.spacing.lg;
  const color = theme.colors.primary;

  // Change theme
  setColorMode('dark'); // 'light' | 'dark' | 'system'

  return <View style={{ padding: spacing, backgroundColor: color }}>...</View>;
}
```

## Optional: Theme Persistence

Install AsyncStorage:

```bash
npx expo install @react-native-async-storage/async-storage
```

Uncomment the AsyncStorage code in [ThemeProvider.tsx](design-system/hooks/ThemeProvider.tsx:26).

## Style Guide

View all design tokens and components:

```tsx
import { StyleGuideScreen } from './design-system/screens/StyleGuideScreen';

// Add to your navigation or render directly
<StyleGuideScreen />
```

## Token Reference

### Spacing
`xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`

### Radius
`none`, `sm`, `md`, `lg`, `xl`, `2xl`, `full`

### Shadows
`none`, `sm`, `md`, `lg`, `xl`

### Typography Variants
`title`, `subtitle`, `body`, `bodyLarge`, `caption`, `label`

### Color Roles
`background`, `surface`, `surface2`, `text`, `textMuted`, `textInverse`, `border`, `borderLight`, `primary`, `primaryText`, `secondary`, `secondaryText`, `success`, `danger`, `warning`

## Best Practices

1. **Always consume theme colors, never raw palette colors:**
   ```tsx
   // ✅ Good
   backgroundColor: theme.colors.surface

   // ❌ Bad
   backgroundColor: '#FFFFFF'
   ```

2. **Use semantic spacing tokens:**
   ```tsx
   // ✅ Good
   padding: theme.spacing.lg

   // ❌ Bad
   padding: 16
   ```

3. **Memoize themed styles:**
   ```tsx
   // ✅ Good
   const useStyles = createThemedStyles((theme) => ({...}));

   // ❌ Bad (recreates on every render)
   const styles = StyleSheet.create({
     container: { backgroundColor: theme.colors.background }
   });
   ```

4. **Use component variants instead of custom styles when possible:**
   ```tsx
   // ✅ Good
   <AppButton variant="ghost" size="sm">Cancel</AppButton>

   // ❌ Unnecessary
   <AppButton style={{ height: 44, backgroundColor: 'transparent' }}>
     Cancel
   </AppButton>
   ```

## Extending

### Add a new component

```tsx
// design-system/components/AppInput.tsx
import { useTheme } from '../hooks/useTheme';

export function AppInput({ ...props }) {
  const { theme } = useTheme();

  return (
    <TextInput
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
      }}
      {...props}
    />
  );
}
```

### Add a new color role

```tsx
// 1. Update ThemeColors interface in design-system/theme/types.ts
export interface ThemeColors {
  // ... existing roles
  info: string;
  infoText: string;
}

// 2. Add to lightTheme.ts and darkTheme.ts
const lightColors: ThemeColors = {
  // ... existing colors
  info: palette.primary600,
  infoText: palette.neutral0,
};
```
