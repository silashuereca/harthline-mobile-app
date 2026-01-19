import { Ionicons } from '@expo/vector-icons';
import { Image, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { AppText, createThemedStyles, useTheme } from '../../design-system';

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
          {user?.user_metadata?.avatar_url ? (
            <Image
              source={{ uri: user.user_metadata.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={20} color={theme.colors.textMuted} />
            </View>
          )}
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
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

