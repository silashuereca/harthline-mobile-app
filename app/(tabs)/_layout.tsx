import { Tabs } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ComponentProps } from 'react';
import { useTheme, createThemedStyles, AppText } from '../../design-system';

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const styles = useStyles(theme);
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconName = (): ComponentProps<typeof Ionicons>['name'] => {
            switch (route.name) {
              case 'index':
                return 'home';
              case 'budget':
                return 'wallet';
              case 'profile':
                return 'person';
              default:
                return 'ellipse';
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
            >
              <Ionicons
                name={iconName()}
                size={22}
                color={isFocused ? theme.colors.primary : '#000'}
              />
              <AppText style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {String(label)}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="budget" options={{ title: 'Budget' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const useStyles = createThemedStyles((theme) => ({
  tabBarContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 32,
    paddingHorizontal: 8,
    paddingVertical: 8,
    elevation: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#000',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: theme.colors.primary,
  },
}));
