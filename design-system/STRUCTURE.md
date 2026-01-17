# Design System Structure

## File Organization

```
design-system/
├── tokens/              # Raw design tokens (no components should import these directly)
│   ├── colors.ts        # Color palette (neutral, primary, secondary, status colors)
│   ├── spacing.ts       # Spacing scale (xs → 6xl, 8pt grid)
│   ├── typography.ts    # Font sizes, weights, line heights, presets
│   ├── radius.ts        # Border radius values
│   ├── shadows.ts       # Shadow/elevation presets
│   └── zIndex.ts        # Z-index layering scale
│
├── theme/               # Theme configuration
│   ├── types.ts         # Theme & ThemeColors interfaces
│   ├── lightTheme.ts    # Light mode semantic colors
│   ├── darkTheme.ts     # Dark mode semantic colors
│   └── index.ts         # Theme exports
│
├── hooks/               # React hooks
│   ├── ThemeProvider.tsx # Context provider for theme
│   └── useTheme.tsx     # Hook to access theme & color mode
│
├── utils/               # Helper functions
│   ├── createThemedStyles.ts # Memoized StyleSheet factory
│   └── alpha.ts         # Color opacity helper
│
├── components/          # Base UI components
│   ├── AppText.tsx      # Typography component
│   ├── AppButton.tsx    # Button component
│   ├── AppCard.tsx      # Card/surface component
│   └── index.ts         # Component exports
│
├── screens/             # Demo/documentation screens
│   └── StyleGuideScreen.tsx # Visual design system documentation
│
├── examples/            # Example usage
│   └── ExampleScreen.tsx # Full screen example
│
├── index.ts            # Main exports
├── README.md           # Documentation
├── INTEGRATION.md      # Setup guide
└── STRUCTURE.md        # This file
```

## Data Flow

```
1. Raw Tokens (tokens/)
   ↓
2. Semantic Theme (theme/)
   ↓
3. ThemeProvider (hooks/ThemeProvider.tsx)
   ↓
4. useTheme() hook (hooks/useTheme.tsx)
   ↓
5. Components (components/)
   ↓
6. Your App Screens
```

## Key Principles

### 1. Token Hierarchy

```
palette.primary600          ← Raw token (tokens/colors.ts)
         ↓
theme.colors.primary        ← Semantic role (theme/lightTheme.ts)
         ↓
<AppButton variant="primary" />  ← Component usage
```

### 2. Component Architecture

```tsx
// ✅ Components consume semantic roles
backgroundColor: theme.colors.surface

// ❌ Never import raw palette
backgroundColor: palette.neutral0
```

### 3. Style Creation

```tsx
// ✅ Use createThemedStyles for memoization
const useStyles = createThemedStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
}));

// Usage
const styles = useStyles(theme);

// ❌ Don't create styles inline (recreates every render)
const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.background }
});
```

## Semantic Color Roles

### Base Colors
- `background` - App background
- `surface` - Card/container background
- `surface2` - Elevated surface background

### Text Colors
- `text` - Primary text
- `textMuted` - Secondary/muted text
- `textInverse` - Text on dark backgrounds

### Border Colors
- `border` - Default border
- `borderLight` - Subtle border

### Brand Colors
- `primary` / `primaryText` / `primaryHover` / `primaryDisabled`
- `secondary` / `secondaryText` / `secondaryHover`

### Status Colors
- `success` / `successText` / `successBackground`
- `danger` / `dangerText` / `dangerBackground`
- `warning` / `warningText` / `warningBackground`

## Component Variants

### AppText
- **Variants**: title, subtitle, body, bodyLarge, caption, label
- **Colors**: default, muted, inverse, primary, danger, success
- **Weights**: regular, medium, semiBold, bold

### AppButton
- **Variants**: primary, secondary, ghost, danger
- **Sizes**: sm (44pt), md (48pt), lg (56pt)
- **States**: normal, pressed, disabled, loading

### AppCard
- **Variants**: elevated, outlined, flat
- **Shadows**: sm, md, lg, xl
- **Interactive**: optional onPress

## Extension Points

### Adding a new token

1. Add to token file (e.g., `tokens/spacing.ts`)
2. Include in theme interface (`theme/types.ts`)
3. Add to both light and dark themes
4. Use in components via `theme.*`

### Adding a new component

1. Create in `components/` directory
2. Import `useTheme` hook
3. Consume theme tokens only
4. Export from `components/index.ts`
5. Export from main `index.ts`

### Adding a new color role

1. Update `ThemeColors` interface in `theme/types.ts`
2. Add to `lightTheme.ts` (map to light palette colors)
3. Add to `darkTheme.ts` (map to dark palette colors)
4. Use in components via `theme.colors.yourRole`

## Performance Notes

- `createThemedStyles` uses `useMemo` to prevent recreation
- Theme changes trigger re-memoization automatically
- StyleSheets are created once per theme, not per render
- Components using `useTheme` re-render only when theme changes

## Accessibility Features

- 44pt minimum touch target (WCAG AA)
- WCAG AA contrast ratios for all color pairs
- Dynamic Type support via `allowFontScaling`
- Semantic HTML/accessibility roles on components
- Proper `accessibilityState` for disabled buttons

## TypeScript Benefits

- Full autocomplete for all theme properties
- Type-safe color roles (can't typo "primry")
- Compile-time errors for invalid variants
- IntelliSense for spacing/radius/shadow keys
