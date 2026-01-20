import { Redirect, Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { colors, HapticTab, IconSymbol } from '@/components';
import { useAuth } from '@/lib';

export default function TabLayout() {
  const status = useAuth.use.status();
  // const [isFirstTime] = useIsFirstTime();
  // const hideSplash = useCallback(async () => {
  //   await SplashScreen.hideAsync();
  // }, []);
  // useEffect(() => {
  //   if (status !== 'idle') {
  //     setTimeout(() => {
  //       hideSplash();
  //     }, 1000);
  //   }
  // }, [hideSplash, status]);

  // if (isFirstTime) {
  //   return <Redirect href="/onboarding" />;
  // }
  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[600],
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarIconStyle: Platform.select({
          ios: {
            padding: 0,
          },
        }),
        tabBarStyle: Platform.select({
          ios: {
            paddingTop: 10,
          },
          default: {
            height: 95,
            paddingTop: 5,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          // headerShown: false,
          title: 'Binge Buddy',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="magnifyingglass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(groups)/favorites"
        options={{
          title: 'My Favorites',
          href: null,
        }}
      />
      <Tabs.Screen
        name="(groups)/currently-watching"
        options={{
          title: 'Currently Watching',
          href: null,
        }}
      />
      <Tabs.Screen
        name="show/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
