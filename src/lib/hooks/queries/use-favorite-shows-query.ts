import { useQuery } from '@tanstack/react-query';

import { FIRESTORE_COLLECTIONS, getFavoriteShows } from '@/lib/firebase';
import { formatShowToPoster, sortByDate } from '@/lib/utils';

import { useAuth } from '../use-auth';

export function useFavoriteShowsQuery(
  sortDirection: 'asc' | 'desc' = 'desc',
  posterPath?: string
) {
  const userId = useAuth().user?.id ?? '';

  return useQuery({
    queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_SHOWS, userId],
    queryFn: ({ queryKey }) => getFavoriteShows(queryKey[1]),
    select: (favoriteShows) =>
      favoriteShows
        .sort((a, b) =>
          sortByDate(a.favoritedAt || '', b.favoritedAt || '', sortDirection)
        )
        .map((show) => formatShowToPoster(show, posterPath)),
  });
}
