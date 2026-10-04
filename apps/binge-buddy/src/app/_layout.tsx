import '../../global.css';

import { useAuth } from '@base-app/core';
import {
  AppThemeProvider,
  FocusAwareStatusBar,
  useThemeConfig,
} from '@base-app/ui';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack, useRouter } from 'expo-router';
import { ThemeProvider } from 'expo-router/react-navigation';
import { onAuthStateChanged, type Unsubscribe } from 'firebase/auth';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { firebaseAuth, firebaseInitError } from '@/lib/firebase/config';
import appTheme from '@/theme/app-theme';

export default function RootLayout() {
  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity, // Keep data in cache forever
      // staleTime: Infinity, // Optional: if you never want to refetch data automatically
    },
  },
});

const asyncPersist = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000,
});

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig(appTheme);
  const router = useRouter();

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      const status =
        state.isConnected != null &&
        state.isConnected &&
        Boolean(state.isInternetReachable);
      console.log('Network status changed:', status ? 'online' : 'offline');
      onlineManager.setOnline(status);
    });
  }, []);

  useEffect(() => {
    let authListener: Unsubscribe;

    if (!firebaseAuth) {
      console.warn('Firebase auth unavailable:', firebaseInitError?.message);
      useAuth.setState({ status: 'signOut', user: null });
      router.replace('/login');
      return;
    }

    authListener = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log('User is signed in with uid:', uid);
        useAuth.setState({
          status: 'signIn',
          user: {
            ...user,
            id: user.uid,
          },
        });
        router.replace('/(app)');
      } else {
        // User is signed out
        console.log('User is signed out');
        useAuth.setState({ status: 'signOut', user: null });
        router.replace('/login');
      }
    });

    return () => {
      authListener?.();
    };
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncPersist, maxAge: Infinity }}
      // onSuccess will be called when the initial restore is finished
      // resumePausedMutations will trigger any paused mutations
      // that was initially triggered when the device was offline
      onSuccess={() => queryClient.resumePausedMutations()}
    >
      <GestureHandlerRootView
        style={styles.container}
        className={theme.dark ? `dark` : undefined}
      >
        <KeyboardProvider>
          <AppThemeProvider theme={appTheme}>
            <ThemeProvider value={theme}>
              <BottomSheetModalProvider>
                <SafeAreaProvider>
                  <FocusAwareStatusBar hidden={false} />
                  <SafeAreaView className="flex-1 bg-black">
                    {children}
                  </SafeAreaView>
                </SafeAreaProvider>
              </BottomSheetModalProvider>
            </ThemeProvider>
          </AppThemeProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
