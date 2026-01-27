import { useQuery } from '@tanstack/react-query';

import { FIRESTORE_COLLECTIONS, getFavoriteShows } from '@/lib/firebase';
import { getTmdbUri, sortByDate } from '@/lib/utils';

import { useAuth } from '../use-auth';

export function useFavoriteShows(
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
        .map((show) => ({
          ...show,
          href: `/show/${show.id}` as const,
          isFavorite: show.favoritedAt != null,
          isWatching: show.watchingAt != null,
          uri: getTmdbUri(posterPath ?? show.posterPath),
        })),
    enabled: !!userId,
  });
}
