// design-system/screens/StyleGuideScreen.tsx

import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { spacing } from '../tokens/spacing';

/**
 * StyleGuideScreen - Visual documentation of design system
 * Use this to preview all tokens and components
 */
export function StyleGuideScreen() {
  const { theme, isDark, setColorMode } = useTheme();

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      contentContainerStyle={{
        padding: theme.spacing.lg,
      }}
    >
      {/* Header */}
      <View style={{ marginBottom: theme.spacing['2xl'] }}>
        <AppText variant="title">Design System</AppText>
        <AppText variant="body" color="muted">
          Token-based styling foundation
        </AppText>
      </View>

      {/* Theme Toggle */}
      <Section title="Theme" theme={theme}>
        <AppText variant="body" color="muted" style={{ marginBottom: theme.spacing.md }}>
          Current: {isDark ? 'Dark' : 'Light'}
        </AppText>
        <View style={styles.row}>
          <AppButton
            variant="ghost"
            size="sm"
            onPress={() => setColorMode('light')}
          >
            Light
          </AppButton>
          <View style={{ width: theme.spacing.sm }} />
          <AppButton
            variant="ghost"
            size="sm"
            onPress={() => setColorMode('dark')}
          >
            Dark
          </AppButton>
          <View style={{ width: theme.spacing.sm }} />
          <AppButton
            variant="ghost"
            size="sm"
            onPress={() => setColorMode('system')}
          >
            System
          </AppButton>
        </View>
      </Section>

      {/* Colors */}
      <Section title="Colors" theme={theme}>
        <ColorSwatch label="Primary" color={theme.colors.primary} />
        <ColorSwatch label="Secondary" color={theme.colors.secondary} />
        <ColorSwatch label="Background" color={theme.colors.background} />
        <ColorSwatch label="Surface" color={theme.colors.surface} />
        <ColorSwatch label="Text" color={theme.colors.text} />
        <ColorSwatch label="Text Muted" color={theme.colors.textMuted} />
        <ColorSwatch label="Border" color={theme.colors.border} />
        <ColorSwatch label="Success" color={theme.colors.success} />
        <ColorSwatch label="Danger" color={theme.colors.danger} />
        <ColorSwatch label="Warning" color={theme.colors.warning} />
      </Section>

      {/* Typography */}
      <Section title="Typography" theme={theme}>
        <AppText variant="title">Title</AppText>
        <AppText variant="subtitle">Subtitle</AppText>
        <AppText variant="bodyLarge">Body Large</AppText>
        <AppText variant="body">Body</AppText>
        <AppText variant="caption">Caption</AppText>
        <AppText variant="label">LABEL</AppText>
      </Section>

      {/* Spacing */}
      <Section title="Spacing Scale" theme={theme}>
        {(Object.keys(spacing) as Array<keyof typeof spacing>).map((key) => (
          <View
            key={key}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.sm,
            }}
          >
            <AppText
              variant="caption"
              style={{ width: 60, color: theme.colors.textMuted }}
            >
              {key}
            </AppText>
            <View
              style={{
                height: 24,
                width: spacing[key],
                backgroundColor: theme.colors.primary,
                borderRadius: theme.radius.sm,
              }}
            />
            <AppText
              variant="caption"
              style={{ marginLeft: theme.spacing.sm, color: theme.colors.textMuted }}
            >
              {spacing[key]}px
            </AppText>
          </View>
        ))}
      </Section>

      {/* Buttons */}
      <Section title="Buttons" theme={theme}>
        <View style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="caption" color="muted" style={{ marginBottom: theme.spacing.sm }}>
            Primary
          </AppText>
          <AppButton variant="primary" onPress={() => {}}>
            Primary Button
          </AppButton>
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="caption" color="muted" style={{ marginBottom: theme.spacing.sm }}>
            Secondary
          </AppText>
          <AppButton variant="secondary" onPress={() => {}}>
            Secondary Button
          </AppButton>
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="caption" color="muted" style={{ marginBottom: theme.spacing.sm }}>
            Ghost
          </AppText>
          <AppButton variant="ghost" onPress={() => {}}>
            Ghost Button
          </AppButton>
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="caption" color="muted" style={{ marginBottom: theme.spacing.sm }}>
            Danger
          </AppText>
          <AppButton variant="danger" onPress={() => {}}>
            Danger Button
          </AppButton>
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="caption" color="muted" style={{ marginBottom: theme.spacing.sm }}>
            Disabled
          </AppText>
          <AppButton variant="primary" disabled onPress={() => {}}>
            Disabled Button
          </AppButton>
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="caption" color="muted" style={{ marginBottom: theme.spacing.sm }}>
            Loading
          </AppText>
          <AppButton variant="primary" loading onPress={() => {}}>
            Loading...
          </AppButton>
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="caption" color="muted" style={{ marginBottom: theme.spacing.sm }}>
            Sizes
          </AppText>
          <View style={{ gap: theme.spacing.sm }}>
            <AppButton variant="primary" size="sm" onPress={() => {}}>
              Small
            </AppButton>
            <AppButton variant="primary" size="md" onPress={() => {}}>
              Medium
            </AppButton>
            <AppButton variant="primary" size="lg" onPress={() => {}}>
              Large
            </AppButton>
          </View>
        </View>
      </Section>

      {/* Cards */}
      <Section title="Cards" theme={theme}>
        <View style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="caption" color="muted" style={{ marginBottom: theme.spacing.sm }}>
            Elevated
          </AppText>
          <AppCard variant="elevated" shadow="md">
            <AppText variant="body">Elevated card with shadow</AppText>
          </AppCard>
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="caption" color="muted" style={{ marginBottom: theme.spacing.sm }}>
            Outlined
          </AppText>
          <AppCard variant="outlined">
            <AppText variant="body">Outlined card with border</AppText>
          </AppCard>
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="caption" color="muted" style={{ marginBottom: theme.spacing.sm }}>
            Flat
          </AppText>
          <AppCard variant="flat">
            <AppText variant="body">Flat card, no shadow or border</AppText>
          </AppCard>
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="caption" color="muted" style={{ marginBottom: theme.spacing.sm }}>
            Pressable
          </AppText>
          <AppCard variant="elevated" onPress={() => alert('Card pressed!')}>
            <AppText variant="body">Tap me!</AppText>
          </AppCard>
        </View>
      </Section>

      <View style={{ height: theme.spacing['4xl'] }} />
    </ScrollView>
  );
}

// Helper Components
interface SectionProps {
  title: string;
  children: React.ReactNode;
  theme: any;
}

function Section({ title, children, theme }: SectionProps) {
  return (
    <View style={{ marginBottom: theme.spacing['2xl'] }}>
      <AppText variant="subtitle" style={{ marginBottom: theme.spacing.md }}>
        {title}
      </AppText>
      {children}
    </View>
  );
}

interface ColorSwatchProps {
  label: string;
  color: string;
}

function ColorSwatch({ label, color }: ColorSwatchProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          backgroundColor: color,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          marginRight: theme.spacing.md,
        }}
      />
      <View>
        <AppText variant="body">{label}</AppText>
        <AppText variant="caption" color="muted">
          {color}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
