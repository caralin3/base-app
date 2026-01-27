import { useQuery } from 'node_modules/@tanstack/react-query/build/modern/useQuery';

import { FIRESTORE_COLLECTIONS, getFavoriteEpisodes } from '@/lib/firebase';

import { useAuth } from '../use-auth';

export function useFavoriteEpisodes(showId: string) {
  const userId = useAuth().user?.id ?? '';

  return useQuery({
    queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_EPISODES, showId, userId],
    queryFn: ({ queryKey }) => getFavoriteEpisodes(queryKey[1], queryKey[2]),
    enabled: !!showId && !!userId,
  });
}
