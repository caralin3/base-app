import { type FavoriteEpisodeDocument } from '../firebase/types';
import { createPersistedStore } from './helpers';
import { createSelectors } from './selectors';

interface FavoriteEpisodesState {
  favoriteEpisodes: FavoriteEpisodeDocument[];
  addFavoriteEpisode: (episode: FavoriteEpisodeDocument) => void;
  removeFavoriteEpisode: (documentId: string) => void;
  updateFavoriteEpisode: (
    documentId: string,
    data: Partial<FavoriteEpisodeDocument>
  ) => void;
  setFavoriteEpisodes: (episodes: FavoriteEpisodeDocument[]) => void;
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

export const addFavoriteEpisodeToStore = (episode: FavoriteEpisodeDocument) =>
  useFavoriteEpisodesStoreBase.getState().addFavoriteEpisode(episode);

export const removeFavoriteEpisodeFromStore = (documentId: string) =>
  useFavoriteEpisodesStoreBase.getState().removeFavoriteEpisode(documentId);

export const updateFavoriteEpisodeInStore = (
  documentId: string,
  data: Partial<FavoriteEpisodeDocument>
) =>
  useFavoriteEpisodesStoreBase
    .getState()
    .updateFavoriteEpisode(documentId, data);

export const setFavoriteEpisodesInStore = (
  episodes: FavoriteEpisodeDocument[]
) => useFavoriteEpisodesStoreBase.getState().setFavoriteEpisodes(episodes);

export const resetFavoriteEpisodesInStore = () =>
  useFavoriteEpisodesStoreBase.getState().resetFavoriteEpisodes();
