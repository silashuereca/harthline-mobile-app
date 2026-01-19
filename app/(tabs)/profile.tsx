import { View } from 'react-native';
import { signOut } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme, createThemedStyles, AppText, AppButton, UserAvatar } from '../../design-system';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const styles = useStyles(theme);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AppText style={styles.header} weight="semiBold">Profile</AppText>
      <View style={styles.avatarContainer}>
        <UserAvatar avatarUrl={user.user_metadata?.avatar_url} size="xl" />
      </View>
      <AppText style={styles.name} weight="semiBold">{user.user_metadata?.full_name || 'User'}</AppText>
      <AppText style={styles.email} color="muted">{user.email}</AppText>
      <AppButton
        variant="primary"
        onPress={handleSignOut}
        style={styles.logoutButton}
      >
        Logout
      </AppButton>
    </View>
  );
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: theme.colors.background,
  },
  header: {
    fontSize: 18,
    position: 'absolute',
    top: 60,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 24,
  },
  logoutButton: {
    borderRadius: 24,
  },
}));
