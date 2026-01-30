import { type FavoriteEpisode } from '../firebase/types';
import { createPersistedStore } from './helpers';
import { createSelectors } from './selectors';

interface FavoriteEpisodesState {
  favoriteEpisodes: FavoriteEpisode[];
  addFavoriteEpisode: (episode: FavoriteEpisode) => void;
  removeFavoriteEpisode: (documentId: string) => void;
  updateFavoriteEpisode: (
    documentId: string,
    data: Partial<FavoriteEpisode>
  ) => void;
  setFavoriteEpisodes: (episodes: FavoriteEpisode[]) => void;
  resetFavoriteEpisodes: () => void;
}

export const useFavoriteEpisodesStoreBase =
  createPersistedStore<FavoriteEpisodesState>(
    'favorite-episodes-store',
    (set) => ({
      favoriteEpisodes: [],
      addFavoriteEpisode: (episode) =>
        set((state) => ({
          favoriteEpisodes: [episode, ...state.favoriteEpisodes],
        })),
      removeFavoriteEpisode: (documentId) =>
        set((state) => ({
          favoriteEpisodes: state.favoriteEpisodes.filter(
            (episode) => episode.documentId !== documentId
          ),
        })),
      updateFavoriteEpisode: (documentId, data) =>
        set((state) => ({
          favoriteEpisodes: state.favoriteEpisodes.map((episode) =>
            episode.documentId === documentId
              ? { ...episode, ...data }
              : episode
          ),
        })),
      setFavoriteEpisodes: (episodes) => set({ favoriteEpisodes: episodes }),
      resetFavoriteEpisodes: () => set({ favoriteEpisodes: [] }),
    })
  );

export const useFavoriteEpisodesStore = createSelectors(
  useFavoriteEpisodesStoreBase
);

export const addFavoriteEpisodeToStore = (episode: FavoriteEpisode) =>
  useFavoriteEpisodesStoreBase.getState().addFavoriteEpisode(episode);

export const removeFavoriteEpisodeFromStore = (documentId: string) =>
  useFavoriteEpisodesStoreBase.getState().removeFavoriteEpisode(documentId);

export const updateFavoriteEpisodeInStore = (
  documentId: string,
  data: Partial<FavoriteEpisode>
) =>
  useFavoriteEpisodesStoreBase
    .getState()
    .updateFavoriteEpisode(documentId, data);

export const setFavoriteEpisodesInStore = (episodes: FavoriteEpisode[]) =>
  useFavoriteEpisodesStoreBase.getState().setFavoriteEpisodes(episodes);

export const resetFavoriteEpisodesInStore = () =>
  useFavoriteEpisodesStoreBase.getState().resetFavoriteEpisodes();
