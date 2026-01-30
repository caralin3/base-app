import { type FavoriteShowDocument } from '../firebase/types';
import { createPersistedStore } from './helpers';
import { createSelectors } from './selectors';

export type FavoriteShow = FavoriteShowDocument & {
  href: `/show/${number}`;
  uri: string | null;
  isFavorite: boolean;
  isWatching: boolean;
};

interface FavoriteShowsState {
  favoriteShows: FavoriteShow[];
  addFavoriteShow: (show: FavoriteShow) => void;
  removeFavoriteShow: (documentId: string) => void;
  updateFavoriteShow: (documentId: string, data: Partial<FavoriteShow>) => void;
  setFavoriteShows: (shows: FavoriteShow[]) => void;
  resetFavoriteShows: () => void;
}

export const useFavoriteShowsStoreBase =
  createPersistedStore<FavoriteShowsState>('favorite-shows-store', (set) => ({
    favoriteShows: [],
    addFavoriteShow: (show) =>
      set((state) => ({
        favoriteShows: [show, ...state.favoriteShows],
      })),
    removeFavoriteShow: (documentId) =>
      set((state) => ({
        favoriteShows: state.favoriteShows.filter(
          (show) => show.documentId !== documentId
        ),
      })),
    updateFavoriteShow: (documentId, data) =>
      set((state) => ({
        favoriteShows: state.favoriteShows.map((show) =>
          show.documentId === documentId ? { ...show, ...data } : show
        ),
      })),
    setFavoriteShows: (shows) => set({ favoriteShows: shows }),
    resetFavoriteShows: () => set({ favoriteShows: [] }),
  }));

export const useFavoriteShowsStore = createSelectors(useFavoriteShowsStoreBase);

export const addFavoriteShowToStore = (show: FavoriteShow) =>
  useFavoriteShowsStoreBase.getState().addFavoriteShow(show);

export const removeFavoriteShowFromStore = (documentId: string) =>
  useFavoriteShowsStoreBase.getState().removeFavoriteShow(documentId);

export const updateFavoriteShowInStore = (
  documentId: string,
  data: Partial<FavoriteShow>
) => useFavoriteShowsStoreBase.getState().updateFavoriteShow(documentId, data);

export const setFavoriteShowsInStore = (shows: FavoriteShow[]) =>
  useFavoriteShowsStoreBase.getState().setFavoriteShows(shows);

export const resetFavoriteShowsInStore = () =>
  useFavoriteShowsStoreBase.getState().resetFavoriteShows();
