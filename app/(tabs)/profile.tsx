import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from '../../supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const { user } = useAuth();

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
      <Text style={styles.header}>Profile</Text>
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
      <Text style={styles.name}>{user.user_metadata?.full_name || 'User'}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
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
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
