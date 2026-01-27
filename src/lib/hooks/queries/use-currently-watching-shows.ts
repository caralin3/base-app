import { useQuery } from '@tanstack/react-query';

import { type PosterProps } from '@/components';
import {
  FIRESTORE_COLLECTIONS,
  getCurrentlyWatchingShows,
} from '@/lib/firebase';
import { getTmdbUri, sortByDate } from '@/lib/utils';

import { useAuth } from '../use-auth';

export function useCurrentlyWatchingShows(
  sortDirection: 'asc' | 'desc' = 'desc',
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
        .map((show) => {
          const poster: PosterProps = {
            ...show,
            href: `/show/${show.id}` as const,
            isFavorite: show.favoritedAt != null,
            isWatching: show.watchingAt != null,
            uri: getTmdbUri(posterPath ?? show.posterPath),
          };
          return poster;
        }),
    enabled: !!userId,
  });
}
