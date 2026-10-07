import { useAuth } from '@base-app/core';
import { useQuery } from '@tanstack/react-query';

import {
  FIRESTORE_COLLECTIONS,
  getCurrentlyWatchingShows,
} from '@/lib/firebase';
import { formatShowToPoster, sortByDate } from '@/lib/utils';

export function useCurrentlyWatchingQuery(
  sortDirection: 'asc' | 'desc' = 'desc',
  enabled: boolean = false,
  posterPath?: string
) {
  const userId = useAuth().user?.id ?? '';

  return useQuery({
    queryKey: [FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS, userId],
    queryFn: ({ queryKey }) => getCurrentlyWatchingShows(queryKey[1]),
    select: (currentlyWatchingShows) =>
      currentlyWatchingShows
        .sort((a, b) =>
          sortByDate(a.watchingAt || '', b.watchingAt || '', sortDirection)
        )
        .map((show) => formatShowToPoster(show, posterPath)),
    enabled,
  });
}
