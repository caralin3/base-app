import { useEffect } from 'react';

import {
  type FavoriteShow,
  setFavoriteShowsInStore,
  useFavoriteShowsStore,
} from '@/lib/store';

import { useFavoriteShowsQuery } from './queries/use-favorite-shows-query';

export function useFavoriteShows(sortDirection: 'asc' | 'desc' = 'desc') {
  const query = useFavoriteShowsQuery(sortDirection);
  const { favoriteShows } = useFavoriteShowsStore();

  useEffect(() => {
    if (query.data) {
      setFavoriteShowsInStore(query.data as FavoriteShow[]);
    }
  }, [query.data]);

  return {
    favoriteShows,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
