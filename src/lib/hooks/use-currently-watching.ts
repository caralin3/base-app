import { useEffect } from 'react';

import {
  type CurrentlyWatchingShow,
  setCurrentlyWatchingShowsInStore,
  useCurrentlyWatchingShowsStore,
} from '@/lib/store';

import { useCurrentlyWatchingQuery } from './queries';

export function useCurrentlyWatching(sortDirection: 'asc' | 'desc' = 'desc') {
  const query = useCurrentlyWatchingQuery(sortDirection);
  const { currentlyWatchingShows } = useCurrentlyWatchingShowsStore();

  useEffect(() => {
    if (query.data) {
      setCurrentlyWatchingShowsInStore(query.data as CurrentlyWatchingShow[]);
    }
  }, [query.data]);

  return {
    currentlyWatchingShows,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
