import { useEffect } from 'react';

import {
  setFavoriteEpisodesInStore,
  useFavoriteEpisodesStore,
} from '@/lib/store';

import { useFavoriteEpisodesQuery } from './queries/use-favorite-episodes-query';

export function useFavoriteEpisodes(
  showId: string,
  sortDirection: 'asc' | 'desc' = 'asc',
  enabled: boolean = false
) {
  const query = useFavoriteEpisodesQuery(showId, sortDirection, enabled);
  const { favoriteEpisodes } = useFavoriteEpisodesStore();
  useEffect(() => {
    if (enabled && query.data) {
      setFavoriteEpisodesInStore(query.data);
    }
  }, [query.data, enabled]);

  return {
    favoriteEpisodes,
    isLoading: query.isLoading,
    isError: query.isError,
    isRefetching: query.isRefetching,
    error: query.error,
    refetch: query.refetch,
  };
}
