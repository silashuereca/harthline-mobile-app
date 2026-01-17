# Integration Guide

Step-by-step guide to integrate the design system into your Expo app.

## Setup Steps

### 1. Wrap your app with ThemeProvider

Since you're using Expo Router, update your root layout:

```tsx
// app/_layout.tsx
import { ThemeProvider } from '../design-system';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider initialColorMode="system">
      <Stack
        screenOptions={{
          headerShown: false, // Customize as needed
        }}
      />
    </ThemeProvider>
  );
}
```

### 2. Update existing screens to use the design system

Here's how to migrate your [signin.tsx](../app/signin.tsx) to use the design system:

**Before:**
```tsx
// Hardcoded styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#000000',
  },
});
```

**After:**
```tsx
import { createThemedStyles, useTheme, AppText, AppButton } from '../design-system';

const useStyles = createThemedStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
}));

function SignIn() {
  const { theme } = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={styles.container}>
      <AppText variant="title">Sign In</AppText>
      <AppButton variant="primary" onPress={handleSignIn}>
        Continue
      </AppButton>
    </View>
  );
}
```

### 3. View the Style Guide

Add a route to view all design tokens and components:

```tsx
// app/styleguide.tsx
import { StyleGuideScreen } from '../design-system/screens/StyleGuideScreen';

export default StyleGuideScreen;
```

Then navigate to `/styleguide` in your app to see the design system in action.

### 4. Optional: Add Theme Persistence

To remember the user's theme preference:

**Install AsyncStorage:**
```bash
npx expo install @react-native-async-storage/async-storage
```

**Uncomment in ThemeProvider:**

Open [design-system/hooks/ThemeProvider.tsx](../design-system/hooks/ThemeProvider.tsx) and uncomment the AsyncStorage import and usage (lines marked with comments).

### 5. Optional: Add a Theme Toggle

Add a settings screen with theme toggle:

```tsx
// app/settings.tsx
import { View } from 'react-native';
import { useTheme, AppText, AppButton, createThemedStyles } from '../design-system';

export default function Settings() {
  const { theme, colorMode, setColorMode } = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={styles.container}>
      <AppText variant="subtitle" style={styles.title}>
        Appearance
      </AppText>

      <View style={styles.buttonGroup}>
        <AppButton
          variant={colorMode === 'light' ? 'primary' : 'ghost'}
          onPress={() => setColorMode('light')}
        >
          Light
        </AppButton>

        <AppButton
          variant={colorMode === 'dark' ? 'primary' : 'ghost'}
          onPress={() => setColorMode('dark')}
        >
          Dark
        </AppButton>

        <AppButton
          variant={colorMode === 'system' ? 'primary' : 'ghost'}
          onPress={() => setColorMode('system')}
        >
          System
        </AppButton>
      </View>
    </View>
  );
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.lg,
  },
  buttonGroup: {
    gap: theme.spacing.sm,
  },
}));
```

## Migration Checklist

- [ ] Install optional dependency (AsyncStorage) if you want theme persistence
- [ ] Wrap app with `ThemeProvider` in `app/_layout.tsx`
- [ ] Create a `/styleguide` route to preview components
- [ ] Update existing screens one by one to use design system
- [ ] Replace hardcoded colors with `theme.colors.*`
- [ ] Replace hardcoded spacing with `theme.spacing.*`
- [ ] Replace custom Text components with `AppText`
- [ ] Replace custom buttons with `AppButton`
- [ ] Use `createThemedStyles` for component styles
- [ ] Test light and dark mode
- [ ] Add theme toggle to settings (optional)

## Common Patterns

### Creating a new screen

```tsx
import { View } from 'react-native';
import { createThemedStyles, useTheme, AppText, AppButton } from '../design-system';

export default function MyScreen() {
  const { theme } = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={styles.container}>
      <AppText variant="title">My Screen</AppText>
      {/* Your content */}
    </View>
  );
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
}));
```

### Using theme colors conditionally

```tsx
const { theme, isDark } = useTheme();

<View
  style={{
    backgroundColor: isDark
      ? theme.colors.surface
      : theme.colors.background,
  }}
/>
```

### Creating custom components

```tsx
import { TextInput, TextInputProps } from 'react-native';
import { useTheme } from '../design-system';

export function AppInput(props: TextInputProps) {
  const { theme } = useTheme();

  return (
    <TextInput
      style={{
        backgroundColor: theme.colors.surface,
        color: theme.colors.text,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        fontSize: theme.typography.body.fontSize,
      }}
      placeholderTextColor={theme.colors.textMuted}
      {...props}
    />
  );
}
```

## Troubleshooting

### Theme not applying
- Ensure `ThemeProvider` wraps your entire app in the root layout
- Check that you're calling `useTheme()` inside a component that's a child of `ThemeProvider`

### TypeScript errors
- Make sure all design system files are compiled
- Run `npx expo start --clear` to clear cache

### Styles not updating on theme change
- Use `createThemedStyles` instead of `StyleSheet.create`
- Ensure you're passing `theme` to `useStyles(theme)`

### AsyncStorage persistence not working
- Install `@react-native-async-storage/async-storage`
- Uncomment the AsyncStorage code in `ThemeProvider.tsx`
- Clear app data and restart

## Next Steps

1. Start with the StyleGuide screen to familiarize yourself with available components
2. Migrate one screen at a time, starting with simple pages
3. Build custom components as needed using the theme tokens
4. Extend the design system with new tokens or components as your app grows

Need help? Check the [README.md](./README.md) for component API documentation.
