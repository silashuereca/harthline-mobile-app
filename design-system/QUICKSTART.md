# Quickstart Guide

Get your design system up and running in 5 minutes.

## Step 1: Wrap Your App (2 min)

### For Expo Router (recommended)

Open or create [app/_layout.tsx](../app/_layout.tsx):

```tsx
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

### For Standard React Native

Open [App.tsx](../App.tsx):

```tsx
import { ThemeProvider } from './design-system';
import { YourRootComponent } from './YourRootComponent';

export default function App() {
  return (
    <ThemeProvider>
      <YourRootComponent />
    </ThemeProvider>
  );
}
```

## Step 2: View the Style Guide (1 min)

Create [app/styleguide.tsx](../app/styleguide.tsx):

```tsx
import { StyleGuideScreen } from '../design-system/screens/StyleGuideScreen';
export default StyleGuideScreen;
```

**Run your app and navigate to `/styleguide` to see all components and tokens.**

## Step 3: Use Components (2 min)

Update any screen to use the design system:

```tsx
import { View } from 'react-native';
import {
  useTheme,
  createThemedStyles,
  AppText,
  AppButton,
  AppCard
} from '../design-system';

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={styles.container}>
      <AppText variant="title">Welcome</AppText>

      <AppCard variant="elevated" style={styles.card}>
        <AppText variant="body" color="muted">
          Start building with the design system
        </AppText>
      </AppCard>

      <AppButton variant="primary" onPress={() => console.log('Pressed')}>
        Get Started
      </AppButton>
    </View>
  );
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  card: {
    marginVertical: theme.spacing.lg,
  },
}));
```

## That's It! 🎉

You're now using the design system. Your app automatically supports:

✅ Light and dark mode (system default)
✅ Consistent spacing and colors
✅ Type-safe tokens
✅ Accessible components

## Next Steps

### Add Theme Toggle (optional)

```tsx
import { useTheme, AppButton } from '../design-system';

function Settings() {
  const { colorMode, setColorMode } = useTheme();

  return (
    <>
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
    </>
  );
}
```

### Persist Theme (optional)

```bash
npx expo install @react-native-async-storage/async-storage
```

Then uncomment the AsyncStorage code in [design-system/hooks/ThemeProvider.tsx](./hooks/ThemeProvider.tsx).

## Common Patterns

### Creating a screen

```tsx
import { View } from 'react-native';
import { useTheme, createThemedStyles, AppText } from '../design-system';

export default function MyScreen() {
  const { theme } = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={styles.container}>
      <AppText variant="title">My Screen</AppText>
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

### Accessing theme values

```tsx
const { theme, isDark } = useTheme();

// Use anywhere
<View
  style={{
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
  }}
/>
```

### Using components

```tsx
// Text
<AppText variant="title">Heading</AppText>
<AppText variant="body" color="muted">Subtitle</AppText>

// Buttons
<AppButton variant="primary" onPress={handlePress}>Submit</AppButton>
<AppButton variant="ghost" size="sm" loading>Loading...</AppButton>

// Cards
<AppCard variant="elevated">
  <AppText>Card content</AppText>
</AppCard>
```

## Documentation

- [README.md](./README.md) - Full component API reference
- [INTEGRATION.md](./INTEGRATION.md) - Detailed integration guide
- [STRUCTURE.md](./STRUCTURE.md) - Architecture overview

## Help

**Theme not working?**
Make sure `ThemeProvider` wraps your app in the root layout.

**TypeScript errors?**
Run `npx expo start --clear` to clear the cache.

**Need more components?**
Check [README.md](./README.md) for examples of extending the system.
