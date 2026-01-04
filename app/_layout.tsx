import { Slot, useRouter, useSegments } from 'expo-router';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { handleAuthCallback } from '../supabase';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function useProtectedRoute() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'signin';

    if (!user && !inAuthGroup) {
      router.replace('/signin');
    } else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, isLoading, segments, router]);

  return { user, isLoading };
}

function RootLayoutNav() {
  const { isLoading } = useProtectedRoute();

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      if (event.url.includes('auth/callback')) {
        try {
          await handleAuthCallback(event.url);
        } catch (error) {
          console.error('Auth callback error:', error);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

