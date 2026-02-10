import { type WatchlistShowDocument } from '../firebase/types';
import { createPersistedStore } from './helpers';
import { createSelectors } from './selectors';

export type WatchlistShow = WatchlistShowDocument & {
  href: `/show/${number}`;
  uri: string | null;
  isFavorite: boolean;
  isWatching: boolean;
};

interface WatchlistShowsState {
  watchlistShows: WatchlistShow[];
  addWatchlistShow: (show: WatchlistShow) => void;
  removeWatchlistShow: (documentId: string) => void;
  updateWatchlistShow: (
    documentId: string,
    data: Partial<WatchlistShow>
  ) => void;
  setWatchlistShows: (shows: WatchlistShow[]) => void;
  resetWatchlistShows: () => void;
}

export const useWatchlistShowsStoreBase =
  createPersistedStore<WatchlistShowsState>('watchlist-shows-store', (set) => ({
    watchlistShows: [],
    addWatchlistShow: (show) =>
      set((state) => ({
        watchlistShows: [show, ...state.watchlistShows],
      })),
    removeWatchlistShow: (documentId) =>
      set((state) => ({
        watchlistShows: state.watchlistShows.filter(
          (show) => show.documentId !== documentId
        ),
      })),
    updateWatchlistShow: (documentId, data) =>
      set((state) => ({
        watchlistShows: state.watchlistShows.map((show) =>
          show.documentId === documentId ? { ...show, ...data } : show
        ),
      })),
    setWatchlistShows: (shows) => set({ watchlistShows: shows }),
    resetWatchlistShows: () => set({ watchlistShows: [] }),
  }));

export const useWatchlistShowsStore = createSelectors(
  useWatchlistShowsStoreBase
);

export const addWatchlistShowToStore = (show: WatchlistShow) =>
  useWatchlistShowsStoreBase.getState().addWatchlistShow(show);

export const removeWatchlistShowFromStore = (documentId: string) =>
  useWatchlistShowsStoreBase.getState().removeWatchlistShow(documentId);

export const updateWatchlistShowInStore = (
  documentId: string,
  data: Partial<WatchlistShow>
) =>
  useWatchlistShowsStoreBase.getState().updateWatchlistShow(documentId, data);

export const setWatchlistShowsInStore = (shows: WatchlistShow[]) =>
  useWatchlistShowsStoreBase.getState().setWatchlistShows(shows);

export const resetWatchlistShowsInStore = () =>
  useWatchlistShowsStoreBase.getState().resetWatchlistShows();
