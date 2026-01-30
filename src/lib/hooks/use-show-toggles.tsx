import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  addCurrentlyWatchingShow,
  addFavoriteEpisode,
  addFavoriteShow,
  deleteCurrentlyWatchingShow,
  deleteFavoriteEpisode,
  deleteFavoriteShow,
  FIRESTORE_COLLECTIONS,
} from '@/lib/firebase';
import {
  type CurrentlyWatchingShowDocument,
  type FavoriteEpisodeDocument,
  type FavoriteShowDocument,
  type NewCurrentlyWatchingShowDocument,
  type NewFavoriteEpisodeDocument,
  type NewFavoriteShowDocument,
} from '@/lib/firebase/types';
import {
  addCurrentlyWatchingShowToStore,
  addFavoriteEpisodeToStore,
  addFavoriteShowToStore,
  removeCurrentlyWatchingShowFromStore,
  removeFavoriteEpisodeFromStore,
  removeFavoriteShowFromStore,
} from '@/lib/store';
import { type Episode, type Show } from '@/lib/types';
import { getTmdbUri } from '@/lib/utils';

import { useAuth } from './use-auth';
import { useCurrentlyWatching } from './use-currently-watching';
import { useFavoriteEpisodes } from './use-favorite-episodes';
import { useFavoriteShows } from './use-favorite-shows';

export function useShowToggles(showId: string) {
  const queryClient = useQueryClient();
  const userId = useAuth().user?.id ?? '';
  const { favoriteShows } = useFavoriteShows();
  const favoriteShow = favoriteShows?.find(
    (show) => show.id.toString() === showId
  );
  const { currentlyWatchingShows } = useCurrentlyWatching();
  const currentlyWatchingShow = currentlyWatchingShows?.find(
    (show) => show.id.toString() === showId
  );
  const { favoriteEpisodes } = useFavoriteEpisodes(showId);

  const addFavoriteShowMutation = useMutation({
    mutationFn: (data: NewFavoriteShowDocument) => addFavoriteShow(data),
    onSuccess: (data?: FavoriteShowDocument) => {
      if (data) {
        const transformedShow = {
          ...data,
          href: `/show/${data.id}` as const,
          isFavorite: data.favoritedAt != null,
          isWatching: data.watchingAt != null,
          uri: getTmdbUri(data.posterPath),
        };
        addFavoriteShowToStore(transformedShow);
      }
      queryClient.invalidateQueries({
        queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_SHOWS, userId],
      });
    },
    onError: (error) => {
      console.error('Error adding favorite show:', error);
    },
  });

  const removeFavoriteShowMutation = useMutation({
    mutationFn: (documentId: string) => deleteFavoriteShow(documentId),
    onSuccess: (docId?: string) => {
      console.log('Removed favorite show with docId:', docId);
      if (docId) {
        removeFavoriteShowFromStore(docId);
      }
      queryClient.invalidateQueries({
        queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_SHOWS, userId],
      });
    },
    onError: (error) => {
      console.error('Error removing favorite show:', error);
    },
  });

  const addCurrentlyWatchingShowMutation = useMutation({
    mutationFn: (data: NewCurrentlyWatchingShowDocument) =>
      addCurrentlyWatchingShow(data),
    onSuccess: (data?: CurrentlyWatchingShowDocument) => {
      // TODO: Extract to reusable type and function
      if (data) {
        const transformedShow = {
          ...data,
          href: `/show/${data.id}` as const,
          isFavorite: data.favoritedAt != null,
          isWatching: data.watchingAt != null,
          uri: getTmdbUri(data.posterPath),
        };
        addCurrentlyWatchingShowToStore(transformedShow);
      }
      queryClient.invalidateQueries({
        queryKey: [FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS, userId],
      });
    },
    onError: (error) => {
      console.error('Error adding currently watching show:', error);
    },
  });

  const removeCurrentlyWatchingShowMutation = useMutation({
    mutationFn: (documentId: string) => deleteCurrentlyWatchingShow(documentId),
    onSuccess: (docId?: string) => {
      if (docId) {
        removeCurrentlyWatchingShowFromStore(docId);
      }
      queryClient.invalidateQueries({
        queryKey: [FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS, userId],
      });
    },
    onError: (error) => {
      console.error('Error removing currently watching show:', error);
    },
  });

  const addFavoriteEpisodeMutation = useMutation({
    mutationFn: (data: NewFavoriteEpisodeDocument) => addFavoriteEpisode(data),
    onSuccess: async (data?: FavoriteEpisodeDocument) => {
      if (data) {
        addFavoriteEpisodeToStore(data);
      }
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_EPISODES, showId, userId],
        }),
        queryClient.invalidateQueries({
          queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_SHOWS, userId],
        }),
        queryClient.invalidateQueries({
          queryKey: [FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS, userId],
        }),
      ]);
    },
    onError: (error) => {
      console.error('Error adding favorite episode:', error);
    },
  });

  const removeFavoriteEpisodeMutation = useMutation({
    mutationFn: (documentId: string) => deleteFavoriteEpisode(documentId),
    onSuccess: (docId?: string) => {
      if (docId) {
        removeFavoriteEpisodeFromStore(docId);
      }
      queryClient.invalidateQueries({
        queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_EPISODES, showId, userId],
      });
    },
    onError: (error) => {
      console.error('Error removing favorite episode:', error);
    },
  });

  const addFavoriteShowHandler = (showData: NewFavoriteShowDocument) => {
    if (!userId) {
      console.error('User not authenticated');
      return;
    }
    addFavoriteShowMutation.mutate(showData);
  };

  const removeFavoriteShowHandler = (documentId: string) => {
    if (!userId) {
      console.error('User not authenticated');
      return;
    }
    removeFavoriteShowMutation.mutate(documentId);
  };

  const addCurrentlyWatchingShowHandler = (
    showData: NewCurrentlyWatchingShowDocument
  ) => {
    if (!userId) {
      console.error('User not authenticated');
      return;
    }
    addCurrentlyWatchingShowMutation.mutate(showData);
  };

  const removeCurrentlyWatchingShowHandler = (documentId: string) => {
    if (!userId) {
      console.error('User not authenticated');
      return;
    }
    removeCurrentlyWatchingShowMutation.mutate(documentId);
  };

  const addFavoriteEpisodeHandler = (
    episodeData: NewFavoriteEpisodeDocument
  ) => {
    if (!userId) {
      console.error('User not authenticated');
      return;
    }
    addFavoriteEpisodeMutation.mutate(episodeData);
  };

  const removeFavoriteEpisodeHandler = (documentId: string) => {
    if (!userId) {
      console.error('User not authenticated');
      return;
    }
    removeFavoriteEpisodeMutation.mutate(documentId);
  };

  const toggleFavoriteShow = (show: Show) => {
    const favoritedShow = favoriteShows?.find(
      (show) => show.id.toString() === showId
    );
    console.log('Toggling favorite show:', show);
    console.log('favorited show:', favoritedShow);
    if (favoritedShow && favoritedShow?.isFavorite) {
      removeFavoriteShowHandler(favoritedShow.documentId);
      // Also remove any favorited episodes for this show
      // const favoriteEpisodesToRemove = favoriteEpisodes.filter(
      //   (episode) => show.id === episode.showId
      // );
      // favoriteEpisodesToRemove.forEach((ep) => {
      //   removeFavoriteEpisodeHandler(ep.documentId);
      // });
    } else {
      const newFavoriteShow: NewFavoriteShowDocument = {
        ...show,
        userId,
        favoritedAt: new Date().toISOString(),
      };
      addFavoriteShowHandler(newFavoriteShow);
    }
  };

  const toggleCurrentlyWatchingShow = (show: Show) => {
    if (currentlyWatchingShow && currentlyWatchingShow?.isWatching) {
      removeCurrentlyWatchingShowHandler(currentlyWatchingShow.documentId);
    } else {
      const newCurrentlyWatchingShow: NewCurrentlyWatchingShowDocument = {
        ...show,
        userId,
        watchingAt: new Date().toISOString(),
      };
      addCurrentlyWatchingShowHandler(newCurrentlyWatchingShow);
    }
  };

  const toggleFavoriteEpisode = (episode: Episode, show: Show) => {
    const favoriteEpisode = favoriteEpisodes?.find(
      (ep) =>
        show.id === episode.showId && ep.episodeNumber === episode.episodeNumber
    );
    if (favoriteEpisode) {
      removeFavoriteEpisodeHandler(favoriteEpisode.documentId);
    } else {
      const newFavoriteEpisode: NewFavoriteEpisodeDocument = {
        ...episode,
        userId,
        favoritedAt: new Date().toISOString(),
      };
      addFavoriteEpisodeHandler(newFavoriteEpisode);

      if (!favoriteShow || !favoriteShow.isFavorite) {
        // Also add the show to favorites if it's not already favorited
        const newFavoriteShow: NewFavoriteShowDocument = {
          ...show,
          userId,
          favoritedAt: new Date().toISOString(),
        };
        addFavoriteShowHandler(newFavoriteShow);
      }
    }
  };

  return {
    currentlyWatchingShow,
    favoriteEpisodes,
    favoriteShow,
    toggleFavoriteEpisode,
    toggleFavoriteShow,
    toggleCurrentlyWatchingShow,
  };
}
