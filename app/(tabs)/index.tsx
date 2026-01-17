import { View } from 'react-native';
import { useTheme, createThemedStyles, AppText } from '../../design-system';

export default function Tab() {
  const { theme } = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={styles.container}>
      <AppText variant="title">Harthline</AppText>
    </View>
  );
}

const useStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
}));

