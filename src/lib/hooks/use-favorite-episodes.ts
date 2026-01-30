import { useEffect } from 'react';

import {
  setFavoriteEpisodesInStore,
  useFavoriteEpisodesStore,
} from '@/lib/store';

import { useFavoriteEpisodesQuery } from './queries/use-favorite-episodes-query';

export function useFavoriteEpisodes(
  showId: string,
  sortDirection: 'asc' | 'desc' = 'asc'
) {
  const query = useFavoriteEpisodesQuery(showId, sortDirection);
  const { favoriteEpisodes } = useFavoriteEpisodesStore();

  useEffect(() => {
    if (query.data) {
      setFavoriteEpisodesInStore(query.data);
    }
  }, [query.data]);

  return {
    favoriteEpisodes,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
