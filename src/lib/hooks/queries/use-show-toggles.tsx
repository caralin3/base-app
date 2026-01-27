import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  addCurrentlyWatchingShow,
  addFavoriteShow,
  deleteCurrentlyWatchingShow,
  deleteFavoriteShow,
  FIRESTORE_COLLECTIONS,
} from '@/lib/firebase';
import {
  type NewCurrentlyWatchingShow,
  type NewFavoriteShow,
} from '@/lib/firebase/types';
import { type Show } from '@/lib/types';

import { useAuth } from '../use-auth';
import { useCurrentlyWatchingShows } from './use-currently-watching-shows';
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

  const addFavoriteShowMutation = useMutation({
    mutationFn: (data: NewFavoriteShow) => addFavoriteShow(data),
    onSuccess: () => {
      // Invalidate and refetch favorite shows
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
    onSuccess: () => {
      // Invalidate and refetch favorite shows
      queryClient.invalidateQueries({
        queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_SHOWS, userId],
      });
    },
    onError: (error) => {
      console.error('Error removing favorite show:', error);
    },
  });

  const addCurrentlyWatchingShowMutation = useMutation({
    // Implement mutation function for adding currently watching show
    mutationFn: (data: NewCurrentlyWatchingShow) =>
      addCurrentlyWatchingShow(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS, userId],
      });
    },
    onError: (error) => {
      console.error('Error adding currently watching show:', error);
    },
  });

  const removeCurrentlyWatchingShowMutation = useMutation({
    // Implement mutation function for removing currently watching show
    mutationFn: (documentId: string) => deleteCurrentlyWatchingShow(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS, userId],
      });
    },
    onError: (error) => {
      console.error('Error removing currently watching show:', error);
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

  const toggleFavoriteShow = (show: Show) => {
    if (favoriteShow && favoriteShow?.isFavorite) {
      removeFavoriteShowHandler(favoriteShow.documentId);
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

  return {
    toggleFavoriteShow,
    toggleCurrentlyWatchingShow,
  };
}
