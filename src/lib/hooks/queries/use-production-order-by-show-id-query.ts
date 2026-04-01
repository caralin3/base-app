import { useQuery } from '@tanstack/react-query';

import {
  FIRESTORE_COLLECTIONS,
  getProductionOrderByShowId,
} from '@/lib/firebase';

import { useAuth } from '../use-auth';

export function useProductionOrderByShowIdQuery(showId: string) {
  const userId = useAuth().user?.id ?? '';

  return useQuery({
    queryKey: [FIRESTORE_COLLECTIONS.PRODUCTION_ORDERS, showId, userId],
    queryFn: ({ queryKey }) =>
      getProductionOrderByShowId(Number(queryKey[1]), queryKey[2]),
    enabled: !!userId && !!showId,
  });
}
