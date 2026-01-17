// design-system/examples/ExampleScreen.tsx

import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { createThemedStyles, useTheme } from '../index';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';

/**
 * Example screen showing design system usage
 */
export function ExampleScreen() {
  const { theme } = useTheme();
  const styles = useStyles(theme);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="title">Welcome</AppText>
        <AppText variant="body" color="muted">
          This is an example screen using the design system
        </AppText>
      </View>

      {/* Feature Cards */}
      <AppCard variant="elevated" shadow="md" style={styles.card}>
        <AppText variant="subtitle" style={styles.cardTitle}>
          Token-Based Styling
        </AppText>
        <AppText variant="body" color="muted">
          All spacing, colors, and typography use semantic tokens for consistency.
        </AppText>
      </AppCard>

      <AppCard variant="elevated" shadow="md" style={styles.card}>
        <AppText variant="subtitle" style={styles.cardTitle}>
          Light & Dark Mode
        </AppText>
        <AppText variant="body" color="muted">
          Automatic theme switching with system preference support.
        </AppText>
      </AppCard>

      <AppCard variant="outlined" style={styles.card}>
        <AppText variant="subtitle" style={styles.cardTitle}>
          Type-Safe
        </AppText>
        <AppText variant="body" color="muted">
          Full TypeScript support with autocomplete for all tokens.
        </AppText>
      </AppCard>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <AppButton
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onPress={handleSubmit}
        >
          Get Started
        </AppButton>

        <AppButton variant="ghost" size="md" fullWidth onPress={() => {}}>
          Learn More
        </AppButton>
      </View>

      {/* Status Examples */}
      <View style={styles.statusContainer}>
        <AppCard variant="flat" style={[styles.statusCard, styles.successCard]}>
          <AppText variant="body" color="success" weight="semiBold">
            Success
          </AppText>
          <AppText variant="caption" color="muted">
            Operation completed
          </AppText>
        </AppCard>

        <AppCard variant="flat" style={[styles.statusCard, styles.dangerCard]}>
          <AppText variant="body" color="danger" weight="semiBold">
            Error
          </AppText>
          <AppText variant="caption" color="muted">
            Something went wrong
          </AppText>
        </AppCard>
      </View>
    </ScrollView>
  );
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing['2xl'],
  },
  card: {
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    marginBottom: theme.spacing.sm,
  },
  buttonGroup: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statusCard: {
    flex: 1,
    padding: theme.spacing.md,
  },
  successCard: {
    backgroundColor: theme.colors.successBackground,
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  dangerCard: {
    backgroundColor: theme.colors.dangerBackground,
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },
}));
