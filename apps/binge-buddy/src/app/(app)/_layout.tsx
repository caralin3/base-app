import { Redirect, Tabs } from 'expo-router';

import { colors, HapticTab, IconSymbol } from '@/components';
import { useAuth } from '@/lib/hooks';

export default function TabLayout() {
  const status = useAuth.use.status();
  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarIconStyle: {
          height: 50,
          width: '100%',
        },
        tabBarStyle: {
          backgroundColor: colors.charcoal[400],
          borderTopWidth: 0,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Binge Buddy',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={32} name="magnifyingglass" color={color} />
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
        name="(groups)/watchlist"
        options={{
          title: 'Watch List',
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
