import AsyncStorage from '@react-native-async-storage/async-storage';
import { create, type StateCreator } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

export const middlewares = <T>(name: string, f: StateCreator<T, [], []>) =>
  devtools(
    persist<T>(f, { name, storage: createJSONStorage(() => AsyncStorage) })
  );

export const createPersistedStore = <T>(
  name: string,
  initializer: StateCreator<T, [], []>
) =>
  create<T, [['zustand/devtools', never], ['zustand/persist', T]]>(
    middlewares<T>(name, initializer)
  );
