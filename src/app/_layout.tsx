import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { ThemeProvider } from '@react-navigation/native';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { useThemeConfig } from '../components/use-theme-config';

export default function RootLayout() {
  return (
    <Providers>
      <Stack />
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
  const theme = useThemeConfig();

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
          <ThemeProvider value={theme}>
            <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
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
