import { View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme, createThemedStyles, AppText, AppButton } from '../../design-system';

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
        {user.user_metadata?.avatar_url ? (
          <Image
            source={{ uri: user.user_metadata.avatar_url }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color="#8E8E93" />
          </View>
        )}
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
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
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
