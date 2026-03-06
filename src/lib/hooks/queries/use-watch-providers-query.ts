import { useQuery } from '@tanstack/react-query';

import {
  getWatchProvidersByShow,
  WATCH_PROVIDERS_BY_SHOW_QUERY_KEY,
} from '@/lib/api';

export function useWatchProvidersByShowQuery(showId: string) {
  return useQuery({
    queryKey: [WATCH_PROVIDERS_BY_SHOW_QUERY_KEY, showId],
    queryFn: ({ queryKey }) => getWatchProvidersByShow(Number(queryKey[1])),
    select: (data) => data.results?.US,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
