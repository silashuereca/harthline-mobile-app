import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams, useGlobalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';
import { handleAuthCallback } from '../../supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get the full URL to extract the hash fragment tokens
        const url = await Linking.getInitialURL();
        if (url) {
          await handleAuthCallback(url);
        }
        router.replace('/');
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/signin');
      }
    };

    processCallback();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
