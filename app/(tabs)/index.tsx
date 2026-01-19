import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { AppCard, AppText, createThemedStyles, Spacer, UserAvatar, useTheme } from '../../design-system';

export default function Tab() {
  const { theme } = useTheme();
  const styles = useStyles(theme);
  const { user } = useAuth();

  // Extract first name from full_name
  const getFirstName = () => {
    const fullName = user?.user_metadata?.full_name;
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  };

  // Mock expense data
  const expenses = [
    { id: 1, name: 'Groceries', amount: 125.50 },
    { id: 2, name: 'Gas', amount: 45.00 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <UserAvatar avatarUrl={user?.user_metadata?.avatar_url} size="md" />
          <AppText variant="subtitle" style={styles.welcomeText}>
            Welcome, {getFirstName()}
          </AppText>
        </View>
      </View>
      <View style={styles.content}>
        <AppCard variant="rounded">
          <AppText variant="caption" weight="semiBold" style={styles.cardTitle}>
            Planned
          </AppText>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar} />
          </View>
          <View style={styles.cardFooter}>
            <AppText variant="label" color="muted">
              Progress
            </AppText>
            <AppText variant="caption" weight="semiBold">
              $6000
            </AppText>
          </View>
        </AppCard>
        <Spacer size="lg" />
        <AppCard variant="rounded">
          <AppText variant="caption" weight="semiBold" style={styles.cardTitle}>
            Spent
          </AppText>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: '50%' }]} />
          </View>
          <View style={styles.cardFooter}>
            <AppText variant="label" color="muted">
              Progress
            </AppText>
            <AppText variant="caption" weight="semiBold">
              50%
            </AppText>
          </View>
        </AppCard>
        <Spacer size="lg" />
        <AppCard variant="rounded">
          <AppText variant="caption" weight="semiBold" style={styles.cardTitle}>
            Spent
          </AppText>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: '80%' }]} />
          </View>
          <View style={styles.cardFooter}>
            <AppText variant="label" color="muted">
              Progress
            </AppText>
            <AppText variant="caption" weight="semiBold">
              80%
            </AppText>
          </View>
        </AppCard>
        <Spacer size="xl" />
        <View style={styles.activityCard}>
          <AppText variant="caption" weight="semiBold" style={styles.activityHeader}>
            Last Activity
          </AppText>
          {expenses.map((expense, index) => (
            <View
              key={expense.id}
              style={[
                styles.expenseItem,
                index === expenses.length - 1 && styles.expenseItemLast,
              ]}
            >
              <View style={styles.expenseLeft}>
                <Ionicons name="receipt" size={16} color="#FFD700" />
                <AppText variant="label" style={styles.expenseName} numberOfLines={1}>
                  {expense.name}
                </AppText>
              </View>
              <AppText variant="label" style={styles.expenseAmount}>
                ${expense.amount.toFixed(2)}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  welcomeText: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cardTitle: {
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    width: '60%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    padding: 16,
  },
  activityHeader: {
    marginBottom: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  expenseItemLast: {
    borderBottomWidth: 0,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  expenseName: {
    color: '#888',
    flex: 1,
  },
  expenseAmount: {
    color: '#888',
    marginLeft: 8,
    flexShrink: 0,
  },
}));

