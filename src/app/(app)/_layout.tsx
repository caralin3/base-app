import { Redirect, Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab, IconSymbol } from '@/components';
import { useAuth } from '@/lib/hooks';
import { useAppColors } from '@/theme/use-app-colors';

export default function TabLayout() {
  const status = useAuth.use.status();
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === 'ios';
  const tabBarPaddingBottom = isIOS ? Math.max(insets.bottom, 8) : 6;
  const tabBarHeight = (isIOS ? 52 : 56) + tabBarPaddingBottom;
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
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarIconStyle: {
          height: 50,
          width: '100%',
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          // headerShown: false,
          title: 'App Name',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map-view"
        options={{
          href: null,
          title: 'Map View',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="map" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="itinerary"
        options={{
          title: 'Itinerary',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="todos"
        options={{
          title: 'Todos',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="checklist" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="dollarsign" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
