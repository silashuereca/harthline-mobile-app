import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { View } from 'react-native';
import { signInWithGoogle } from '../supabase';
import { useTheme, createThemedStyles, AppText, AppButton } from '../design-system';

export default function SignIn() {
  const { theme } = useTheme();
  const styles = useStyles(theme);

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
      {/* Decorative shapes header */}
      <View style={styles.shapesContainer}>
        {/* Left column - big circle */}
        <View style={styles.leftColumn}>
          <View style={styles.bigCircle} />
        </View>
        {/* Right column - circle with flat left edge */}
        <View style={styles.rightColumn}>
          <View style={styles.flatCircle} />
        </View>
      </View>

      <View style={styles.shapesContainer}>
        {/* Left column - big circle */}
        <View style={styles.leftColumn}>
          <View style={styles.halfCircleLeft} />
        </View>
        {/* Right column - circle with flat left edge */}
        <View style={styles.rightColumn}>
          <View style={styles.bigCircle} />
        </View>
      </View>

      <View style={styles.shapesContainer}>
        {/* Left column - big circle */}
        <View style={styles.leftColumn}>
          <View style={styles.bigCircle} />
        </View>
        {/* Right column - circle with flat left edge */}
        <View style={styles.rightColumn}>
          <View style={styles.halfCircleRight} />
        </View>
      </View>

      {/* Spacer to push button to bottom */}
      <View style={styles.spacer} />

      {/* Heading and description */}
      <AppText style={styles.heading}>The heart of your daily life</AppText>
      <AppText style={styles.description}>
        Manage finances, plan meals, organize tasks, and communicate -- all in one simple, connected space.
      </AppText>

      {/* Sign in button at bottom */}
      <AppButton
        variant="primary"
        onPress={handleSignIn}
        style={styles.googleButton}
        icon={<Ionicons name="logo-google" size={20} color="#000" />}
      >
        Continue with Google
      </AppButton>
    </View>
  );
}

const circleSize = 150;
const halfCircleSize = circleSize / 2;

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 60,
  },
  shapesContainer: {
    flexDirection: 'row',
    gap: 0,
    marginBottom: 24,
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bigCircle: {
    width: circleSize,
    height: circleSize,
    borderRadius: halfCircleSize,
    backgroundColor: '#FFF',
  },
  flatCircle: {
    width: circleSize,
    height: circleSize,
    backgroundColor: '#E8E8E8',
    borderTopRightRadius: halfCircleSize,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: halfCircleSize,
    borderBottomLeftRadius: halfCircleSize,
  },
  halfCircleLeft: {
    width: circleSize,
    height: circleSize,
    backgroundColor: '#E8E8E8',
    borderTopRightRadius: halfCircleSize,
    borderBottomRightRadius: halfCircleSize,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  halfCircleRight: {
    width: circleSize,
    height: circleSize,
    backgroundColor: '#E8E8E8',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: halfCircleSize,
    borderBottomRightRadius: halfCircleSize,
  },
  spacer: {
    flex: 1,
  },
  heading: {
    fontSize: 27,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#242323',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 14,
    textAlign: 'center',
  },
  googleButton: {
    borderRadius: 24,
  },
}));
