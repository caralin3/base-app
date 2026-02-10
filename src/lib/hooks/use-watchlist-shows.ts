import { useEffect } from 'react';

import {
  setWatchlistShowsInStore,
  useWatchlistShowsStore,
  type WatchlistShow,
} from '@/lib/store';

import { useWatchlistShowsQuery } from './queries/use-watchlist-shows-query';

export function useWatchlistShows(sortDirection: 'asc' | 'desc' = 'desc') {
  const query = useWatchlistShowsQuery(sortDirection);
  const { watchlistShows } = useWatchlistShowsStore();

  useEffect(() => {
    if (query.data) {
      setWatchlistShowsInStore(query.data as WatchlistShow[]);
    }
  }, [query.data]);

  return {
    watchlistShows,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
