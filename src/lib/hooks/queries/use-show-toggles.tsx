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
  type NewCurrentlyWatchingShow,
  type NewFavoriteEpisode,
  type NewFavoriteShow,
} from '@/lib/firebase/types';
import { type Episode, type Show } from '@/lib/types';

import { useAuth } from '../use-auth';
import { useCurrentlyWatchingShows } from './use-currently-watching-shows';
import { useFavoriteEpisodes } from './use-favorite-episodes';
import { useFavoriteShows } from './use-favorite-shows';

export function useShowToggles(showId: string) {
  const queryClient = useQueryClient();
  const userId = useAuth().user?.id ?? '';
  const favoriteShow = useFavoriteShows().data?.find(
    (show) => show.id.toString() === showId
  );
  const currentlyWatchingShow = useCurrentlyWatchingShows().data?.find(
    (show) => show.id.toString() === showId
  );
  const favoriteEpisodes = useFavoriteEpisodes(showId).data ?? [];

  const addFavoriteShowMutation = useMutation({
    mutationFn: (data: NewFavoriteShow) => addFavoriteShow(data),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_SHOWS, userId],
      });
    },
    onError: (error) => {
      console.error('Error adding favorite show:', error);
    },
  });

  const removeFavoriteShowMutation = useMutation({
    mutationFn: (documentId: string) => deleteFavoriteShow(documentId),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_SHOWS, userId],
      });
    },
    onError: (error) => {
      console.error('Error removing favorite show:', error);
    },
  });

  const addCurrentlyWatchingShowMutation = useMutation({
    mutationFn: (data: NewCurrentlyWatchingShow) =>
      addCurrentlyWatchingShow(data),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: [FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS, userId],
      });
    },
    onError: (error) => {
      console.error('Error adding currently watching show:', error);
    },
  });

  const removeCurrentlyWatchingShowMutation = useMutation({
    mutationFn: (documentId: string) => deleteCurrentlyWatchingShow(documentId),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: [FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS, userId],
      });
    },
    onError: (error) => {
      console.error('Error removing currently watching show:', error);
    },
  });

  const addFavoriteEpisodeMutation = useMutation({
    mutationFn: (data: NewFavoriteEpisode) => addFavoriteEpisode(data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.removeQueries({
          queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_EPISODES, showId, userId],
        }),
        queryClient.removeQueries({
          queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_SHOWS, userId],
        }),
        queryClient.removeQueries({
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
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_EPISODES, showId, userId],
      });
    },
    onError: (error) => {
      console.error('Error removing favorite episode:', error);
    },
  });

  const addFavoriteShowHandler = (showData: NewFavoriteShow) => {
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
    showData: NewCurrentlyWatchingShow
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

  const addFavoriteEpisodeHandler = (episodeData: NewFavoriteEpisode) => {
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
    if (favoriteShow && favoriteShow?.isFavorite) {
      removeFavoriteShowHandler(favoriteShow.documentId);
      // Also remove any favorited episodes for this show
      // const favoriteEpisodesToRemove = favoriteEpisodes.filter(
      //   (episode) => show.id === episode.showId
      // );
      // favoriteEpisodesToRemove.forEach((ep) => {
      //   removeFavoriteEpisodeHandler(ep.documentId);
      // });
    } else {
      const newFavoriteShow: NewFavoriteShow = {
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
      const newCurrentlyWatchingShow: NewCurrentlyWatchingShow = {
        ...show,
        userId,
        watchingAt: new Date().toISOString(),
      };
      addCurrentlyWatchingShowHandler(newCurrentlyWatchingShow);
    }
  };

  const toggleFavoriteEpisode = (episode: Episode, show: Show) => {
    const favoriteEpisode = favoriteEpisodes.find(
      (ep) =>
        show.id === episode.showId && ep.episodeNumber === episode.episodeNumber
    );
    if (favoriteEpisode) {
      removeFavoriteEpisodeHandler(favoriteEpisode.documentId);
    } else {
      const newFavoriteEpisode: NewFavoriteEpisode = {
        ...episode,
        userId,
        favoritedAt: new Date().toISOString(),
      };
      addFavoriteEpisodeHandler(newFavoriteEpisode);

      if (!favoriteShow || !favoriteShow.isFavorite) {
        // Also add the show to favorites if it's not already favorited
        const newFavoriteShow: NewFavoriteShow = {
          ...show,
          userId,
          favoritedAt: new Date().toISOString(),
        };
        addFavoriteShowHandler(newFavoriteShow);
      }
    }
  };

  return {
    toggleFavoriteEpisode,
    toggleFavoriteShow,
    toggleCurrentlyWatchingShow,
  };
}
