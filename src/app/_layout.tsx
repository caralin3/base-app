import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { ThemeProvider } from '@react-navigation/native';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import { onAuthStateChanged, type Unsubscribe } from 'firebase/auth';
import { type UpdateData } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { FocusAwareStatusBar, useThemeConfig } from '@/components';
import { Env } from '@/lib';
import { firebaseAuth, firebaseInitError } from '@/lib/firebase/config';
import {
  FIRESTORE_COLLECTIONS,
  updateActivity,
  updateEntertainment,
  updateFlight,
  updateFood,
  updateLodging,
  updateShopping,
  updateTodo,
  updateTransport,
  updateTrip,
} from '@/lib/firebase/firestore';
import { loadSelectedTheme, useAuth } from '@/lib/hooks';
import { type FirestoreDocument } from '@/lib/hooks/use-firestore-collections';

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

const updateMutationDefaults = [
  [FIRESTORE_COLLECTIONS.ACTIVITIES, updateActivity],
  [FIRESTORE_COLLECTIONS.ENTERTAINMENT, updateEntertainment],
  [FIRESTORE_COLLECTIONS.FLIGHTS, updateFlight],
  [FIRESTORE_COLLECTIONS.FOOD, updateFood],
  [FIRESTORE_COLLECTIONS.LODGING, updateLodging],
  [FIRESTORE_COLLECTIONS.SHOPPING, updateShopping],
  [FIRESTORE_COLLECTIONS.TODOS, updateTodo],
  [FIRESTORE_COLLECTIONS.TRANSPORTS, updateTransport],
  [FIRESTORE_COLLECTIONS.TRIPS, updateTrip],
] as (readonly [
  string,
  (data: UpdateData<FirestoreDocument>, id: string | number) => Promise<void>,
])[];

updateMutationDefaults.forEach(([collectionName, updateDocument]) => {
  queryClient.setMutationDefaults(['firestore', collectionName, 'update'], {
    mutationFn: ({
      data,
      id,
    }: {
      data: UpdateData<FirestoreDocument>;
      id: string | number;
    }) => updateDocument(data, id),
  });
});

const asyncPersist = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000,
});

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();

  useEffect(() => {
    loadSelectedTheme();
  }, []);

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
    const hasFirebaseApiKey = Boolean(Env.FIREBASE_API_KEY?.trim());

    if (!firebaseAuth) {
      if (!hasFirebaseApiKey) {
        useAuth.setState({
          status: 'signIn',
          user: {
            id: 'local-dev-user',
            displayName: 'Local Dev User',
            email: 'local-dev-user@example.com',
          },
        });
        return;
      }

      if (firebaseInitError) {
        console.warn('Firebase auth init warning:', firebaseInitError.message);
      }

      useAuth.setState({ status: 'signOut', user: null });
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
      } else {
        // User is signed out
        console.log('User is signed out');
        useAuth.setState({ status: 'signOut', user: null });
      }
    });

    return () => {
      authListener?.();
    };
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncPersist,
        maxAge: Infinity,
        buster: 'firestore-mutation-keys-v1',
      }}
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
          <ThemeProvider value={theme}>
            <BottomSheetModalProvider>
              <SafeAreaProvider>
                <FocusAwareStatusBar hidden={false} />
                <SafeAreaView className="flex-1 bg-surface dark:bg-surface-dark">
                  {children}
                </SafeAreaView>
              </SafeAreaProvider>
            </BottomSheetModalProvider>
          </ThemeProvider>
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
