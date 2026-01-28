import { useQuery } from 'node_modules/@tanstack/react-query/build/modern/useQuery';

import { FIRESTORE_COLLECTIONS, getFavoriteEpisodes } from '@/lib/firebase';
import { sortByDate } from '@/lib/utils';

import { useAuth } from '../use-auth';

export function useFavoriteEpisodes(
  showId: string,
  sortDirection: 'asc' | 'desc' = 'asc'
) {
  const userId = useAuth().user?.id ?? '';

  return useQuery({
    queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_EPISODES, showId, userId],
    queryFn: ({ queryKey }) => getFavoriteEpisodes(queryKey[1], queryKey[2]),
    select: (favoriteEpisodes) =>
      favoriteEpisodes.sort((a, b) =>
        sortByDate(a.airDate || '', b.airDate || '', sortDirection)
      ),
  });
}
