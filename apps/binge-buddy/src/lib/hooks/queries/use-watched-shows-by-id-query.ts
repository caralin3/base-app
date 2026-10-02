import { useQuery } from '@tanstack/react-query';

import { FIRESTORE_COLLECTIONS, getWatchedShowById } from '@/lib/firebase';

import { useAuth } from '../use-auth';

export function useWatchedShowsByIdQuery(showId: string) {
  const userId = useAuth().user?.id ?? '';

  return useQuery({
    queryKey: [FIRESTORE_COLLECTIONS.WATCHED_SHOWS, userId, showId],
    queryFn: ({ queryKey }) =>
      getWatchedShowById(queryKey[1], Number(queryKey[2])),
  });
}
