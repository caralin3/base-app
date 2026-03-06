import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  addCurrentlyWatchingShow,
  addFavoriteEpisode,
  addFavoriteShow,
  addWatchlistShow,
  deleteCurrentlyWatchingShow,
  deleteFavoriteEpisode,
  deleteFavoriteShow,
  deleteWatchlistShow,
  FIRESTORE_COLLECTIONS,
} from '@/lib/firebase';
import {
  type CurrentlyWatchingShowDocument,
  type FavoriteEpisodeDocument,
  type FavoriteShowDocument,
  type NewCurrentlyWatchingShowDocument,
  type NewFavoriteEpisodeDocument,
  type NewFavoriteShowDocument,
  type NewWatchlistShowDocument,
  type WatchlistShowDocument,
} from '@/lib/firebase/types';
import {
  addCurrentlyWatchingShowToStore,
  addFavoriteEpisodeToStore,
  addFavoriteShowToStore,
  addWatchlistShowToStore,
  removeCurrentlyWatchingShowFromStore,
  removeFavoriteEpisodeFromStore,
  removeFavoriteShowFromStore,
  removeWatchlistShowFromStore,
  updateCurrentlyWatchingShowInStore,
  updateFavoriteShowInStore,
} from '@/lib/store';
import { type Episode, type Show } from '@/lib/types';
import { getTmdbUri } from '@/lib/utils';

import { useAuth } from './use-auth';
import { useCurrentlyWatching } from './use-currently-watching';
import { useFavoriteEpisodes } from './use-favorite-episodes';
import { useFavoriteShows } from './use-favorite-shows';
import { useWatchlistShows } from './use-watchlist-shows';

export function useShowToggles(
  showId: string,
  {
    enableCurrentlyWatching = true,
    enableFavoriteEpisodes = false,
    enableFavoriteShows = true,
  }: {
    enableCurrentlyWatching?: boolean;
    enableFavoriteEpisodes?: boolean;
    enableFavoriteShows?: boolean;
  } = {}
) {
  const queryClient = useQueryClient();
  const userId = useAuth().user?.id ?? '';
  const { favoriteShows } = useFavoriteShows('desc', enableFavoriteShows);
  const favoriteShow = favoriteShows?.find(
    (show) => show.id.toString() === showId
  );
  const { currentlyWatchingShows } = useCurrentlyWatching(
    'desc',
    enableCurrentlyWatching
  );
  const currentlyWatchingShow = currentlyWatchingShows?.find(
    (show) => show.id.toString() === showId
  );
  const {
    favoriteEpisodes,
    isRefetching: isRefetchingFavoriteEpisodes,
    refetch: refetchFavoriteEpisodes,
  } = useFavoriteEpisodes(showId, 'asc', enableFavoriteEpisodes);
  const { watchlistShows } = useWatchlistShows();
  const watchlistShow = watchlistShows?.find(
    (show) => show.id.toString() === showId
  );

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

        // Update isFavorite in currently watching store if exists
        const watchingShow = currentlyWatchingShows?.find(
          (show) => show.id === data.id
        );
        if (watchingShow?.documentId) {
          updateCurrentlyWatchingShowInStore(watchingShow.documentId, {
            isFavorite: true,
            favoritedAt: data.favoritedAt,
          });
        }
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
      if (docId) {
        const removedShow = favoriteShows?.find(
          (show) => show.documentId === docId
        );
        removeFavoriteShowFromStore(docId);

        // Update isFavorite in currently watching store if exists
        if (removedShow) {
          const watchingShow = currentlyWatchingShows?.find(
            (show) => show.id === removedShow.id
          );
          if (watchingShow?.documentId) {
            updateCurrentlyWatchingShowInStore(watchingShow.documentId, {
              isFavorite: false,
              favoritedAt: undefined,
            });
          }
        }
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

        // Update isWatching in favorite shows store if exists
        const favShow = favoriteShows?.find((show) => show.id === data.id);
        if (favShow?.documentId) {
          updateFavoriteShowInStore(favShow.documentId, {
            isWatching: true,
            watchingAt: data.watchingAt,
          });
        }
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
        const removedShow = currentlyWatchingShows?.find(
          (show) => show.documentId === docId
        );
        removeCurrentlyWatchingShowFromStore(docId);

        // Update isWatching in favorite shows store if exists
        if (removedShow) {
          const favShow = favoriteShows?.find(
            (show) => show.id === removedShow.id
          );
          if (favShow?.documentId) {
            updateFavoriteShowInStore(favShow.documentId, {
              isWatching: false,
              watchingAt: undefined,
            });
          }
        }
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

  const addWatchlistShowMutation = useMutation({
    mutationFn: (data: NewWatchlistShowDocument) => addWatchlistShow(data),
    onSuccess: (data?: WatchlistShowDocument) => {
      if (data) {
        const transformedShow = {
          ...data,
          href: `/show/${data.id}` as const,
          isFavorite: data.favoritedAt != null,
          isWatching: data.watchingAt != null,
          uri: getTmdbUri(data.posterPath),
        };
        addWatchlistShowToStore(transformedShow);
      }
      queryClient.invalidateQueries({
        queryKey: [FIRESTORE_COLLECTIONS.WATCHLIST_SHOWS, userId],
      });
    },
    onError: (error) => {
      console.error('Error adding watchlist show:', error);
    },
  });

  const removeWatchlistShowMutation = useMutation({
    mutationFn: (documentId: string) => deleteWatchlistShow(documentId),
    onSuccess: (docId?: string) => {
      if (docId) {
        removeWatchlistShowFromStore(docId);
      }
      queryClient.invalidateQueries({
        queryKey: [FIRESTORE_COLLECTIONS.WATCHLIST_SHOWS, userId],
      });
    },
    onError: (error) => {
      console.error('Error removing watchlist show:', error);
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

  const addWatchlistShowHandler = (showData: NewWatchlistShowDocument) => {
    if (!userId) {
      console.error('User not authenticated');
      return;
    }
    addWatchlistShowMutation.mutate(showData);
  };

  const removeWatchlistShowHandler = (documentId: string) => {
    if (!userId) {
      console.error('User not authenticated');
      return;
    }
    removeWatchlistShowMutation.mutate(documentId);
  };

  const toggleFavoriteShow = (show: Show) => {
    const favoritedShow = favoriteShows?.find(
      (show) => show.id.toString() === showId
    );
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
        isFavorite: true,
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
        isWatching: true,
        watchingAt: new Date().toISOString(),
      };
      addCurrentlyWatchingShowHandler(newCurrentlyWatchingShow);
    }
  };

  const toggleFavoriteEpisode = (episode: Episode, show: Show) => {
    const favoriteEpisode = favoriteEpisodes?.find(
      (ep) =>
        show.id === episode.showId &&
        ep.episodeNumber === episode.episodeNumber &&
        ep.seasonNumber === episode.seasonNumber
    );
    if (favoriteEpisode) {
      removeFavoriteEpisodeHandler(favoriteEpisode.documentId);
    } else {
      const newFavoriteEpisode: NewFavoriteEpisodeDocument = {
        ...episode,
        userId,
        favoritedAt: new Date().toISOString(),
        isFavorite: true,
      };
      addFavoriteEpisodeHandler(newFavoriteEpisode);

      if (!favoriteShow || !favoriteShow.isFavorite) {
        // Also add the show to favorites if it's not already favorited
        const newFavoriteShow: NewFavoriteShowDocument = {
          ...show,
          userId,
          favoritedAt: new Date().toISOString(),
          isFavorite: true,
        };
        addFavoriteShowHandler(newFavoriteShow);
      }
    }
  };

  const toggleWatchlistShow = (show: Show) => {
    const watchlistedShow = watchlistShows?.find(
      (s) => s.id.toString() === showId
    );
    if (watchlistedShow) {
      removeWatchlistShowHandler(watchlistedShow.documentId);
    } else {
      const newWatchlistShow: NewWatchlistShowDocument = {
        ...show,
        userId,
        addedAt: new Date().toISOString(),
      };
      addWatchlistShowHandler(newWatchlistShow);
    }
  };

  return {
    currentlyWatchingShow,
    favoriteEpisodes,
    favoriteShow,
    isRefetchingFavoriteEpisodes,
    refetchFavoriteEpisodes,
    toggleFavoriteEpisode,
    toggleFavoriteShow,
    toggleCurrentlyWatchingShow,
    toggleWatchlistShow,
    watchlistShow,
  };
}
