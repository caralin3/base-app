import { useEffect } from 'react';

import { setFavoriteShowsInStore, useFavoriteShowsStore } from '@/lib/store';

import { useFavoriteShowsQuery } from './queries/use-favorite-shows-query';

export function useFavoriteShows(sortDirection: 'asc' | 'desc' = 'desc') {
  const query = useFavoriteShowsQuery(sortDirection);
  const { favoriteShows } = useFavoriteShowsStore();

  useEffect(() => {
    if (query.data) {
      setFavoriteShowsInStore(query.data);
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
