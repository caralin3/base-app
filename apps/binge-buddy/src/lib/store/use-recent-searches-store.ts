import uuid from 'react-native-uuid';

import { createPersistedStore } from './helpers';
import { createSelectors } from './selectors';
import { type RecentSearch } from './types';

interface RecentSearchesState {
  addSearch: (query: string) => void;
  deleteSearch: (id: string) => void;
  editSearch: (id: string) => void;
  recentSearches: RecentSearch[];
  resetSearches: () => void;
}

export const useRecentSearchesStoreBase =
  createPersistedStore<RecentSearchesState>('recent-searches-store', (set) => ({
    recentSearches: [],
    resetSearches: () => set({ recentSearches: [] }),
    addSearch: (query) =>
      set((state) => ({
        recentSearches: [
          { id: uuid.v4(), query, timestamp: new Date().toISOString() },
          ...state.recentSearches,
        ],
      })),
    editSearch: (id) =>
      set((state) => ({
        recentSearches: state.recentSearches.map((search) =>
          search.id === id
            ? { ...search, timestamp: new Date().toISOString() }
            : search
        ),
      })),
    deleteSearch: (id) =>
      set((state) => ({
        recentSearches: state.recentSearches.filter(
          (search) => search.id !== id
        ),
      })),
  }));

export const useRecentSearchesStore = createSelectors(
  useRecentSearchesStoreBase
);

// Actions can be accessed directly from getState() - they don't need to be reactive
export const addRecentSearch = (query: string) =>
  useRecentSearchesStoreBase.getState().addSearch(query);

export const editRecentSearch = (id: string) =>
  useRecentSearchesStoreBase.getState().editSearch(id);

export const deleteRecentSearch = (id: string) =>
  useRecentSearchesStoreBase.getState().deleteSearch(id);

export const resetRecentSearches = () =>
  useRecentSearchesStoreBase.getState().resetSearches();
