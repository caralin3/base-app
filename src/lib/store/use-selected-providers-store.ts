import { type WatchProvider } from '../api/tmdb/types';
import { createPersistedStore } from './helpers';
import { createSelectors } from './selectors';

interface SelectedProvidersState {
  addProvider: (provider: WatchProvider) => void;
  removeProvider: (providerId: number) => void;
  selectedProviders: WatchProvider[];
  toggleProvider: (provider: WatchProvider) => void;
  resetProviders: () => void;
}

export const useSelectedProvidersStoreBase =
  createPersistedStore<SelectedProvidersState>(
    'selected-providers-store',
    (set) => ({
      selectedProviders: [],
      resetProviders: () => set({ selectedProviders: [] }),
      addProvider: (provider: WatchProvider) =>
        set((state) => ({
          selectedProviders: [provider, ...state.selectedProviders],
        })),
      removeProvider: (providerId: number) =>
        set((state) => ({
          selectedProviders: state.selectedProviders.filter(
            (provider) => provider.provider_id !== providerId
          ),
        })),
      toggleProvider: (provider: WatchProvider) =>
        set((state) => {
          const exists = state.selectedProviders.some(
            (p) => p.provider_id === provider.provider_id
          );
          if (exists) {
            return {
              selectedProviders: state.selectedProviders.filter(
                (p) => p.provider_id !== provider.provider_id
              ),
            };
          }
          return {
            selectedProviders: [provider, ...state.selectedProviders],
          };
        }),
    })
  );

export const useSelectedProvidersStore = createSelectors(
  useSelectedProvidersStoreBase
);

// Actions can be accessed directly from getState() - they don't need to be reactive
export const addSelectedProvider = (provider: WatchProvider) =>
  useSelectedProvidersStoreBase.getState().addProvider(provider);

export const removeSelectedProvider = (providerId: number) =>
  useSelectedProvidersStoreBase.getState().removeProvider(providerId);

export const toggleSelectedProvider = (provider: WatchProvider) =>
  useSelectedProvidersStoreBase.getState().toggleProvider(provider);

export const resetSelectedProviders = () =>
  useSelectedProvidersStoreBase.getState().resetProviders();
