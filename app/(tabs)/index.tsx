import { View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { AppText, createThemedStyles, useTheme, UserAvatar } from '../../design-system';

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
        <AppText variant="title">Harthline</AppText>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

