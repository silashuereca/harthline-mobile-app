import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { signInWithGoogle } from '../supabase';

export default function SignIn() {
  const handleSignIn = async () => {
    try {
      // createURL generates the correct redirect for both Expo Go and standalone builds
      const redirectUrl = Linking.createURL('auth/callback');
      // console.log('Redirect URL:', redirectUrl);
      await signInWithGoogle(redirectUrl);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>harthline</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      <TouchableOpacity style={styles.googleButton} onPress={handleSignIn}>
        <Ionicons name="logo-google" size={20} color="#fff" />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 32,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 8,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
