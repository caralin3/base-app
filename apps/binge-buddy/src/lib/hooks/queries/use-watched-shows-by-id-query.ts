import { useAuth } from '@base-app/core';
import { useQuery } from '@tanstack/react-query';

import { FIRESTORE_COLLECTIONS, getWatchedShowById } from '@/lib/firebase';

export function useWatchedShowsByIdQuery(showId: string) {
  const userId = useAuth().user?.id ?? '';

  return useQuery({
    queryKey: [FIRESTORE_COLLECTIONS.WATCHED_SHOWS, userId, showId],
    queryFn: ({ queryKey }) =>
      getWatchedShowById(queryKey[1], Number(queryKey[2])),
  });
}
