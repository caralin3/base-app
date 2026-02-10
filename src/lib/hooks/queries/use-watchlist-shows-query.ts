import { useQuery } from '@tanstack/react-query';

import { FIRESTORE_COLLECTIONS, getWatchlistShows } from '@/lib/firebase';
import { formatShowToPoster, sortByDate } from '@/lib/utils';

import { useAuth } from '../use-auth';

export function useWatchlistShowsQuery(
  sortDirection: 'asc' | 'desc' = 'desc',
  posterPath?: string
) {
  const userId = useAuth().user?.id ?? '';

  return useQuery({
    queryKey: [FIRESTORE_COLLECTIONS.WATCHLIST_SHOWS, userId],
    queryFn: ({ queryKey }) => getWatchlistShows(queryKey[1]),
    select: (watchlistShows) =>
      watchlistShows
        .sort((a, b) =>
          sortByDate(a.addedAt || '', b.addedAt || '', sortDirection)
        )
        .map((show) => formatShowToPoster(show, posterPath)),
  });
}
