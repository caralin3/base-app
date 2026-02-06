import { useQuery } from '@tanstack/react-query';

import { getWatchProviders, WATCH_PROVIDERS_QUERY_KEY } from '@/lib/api';

export function useWatchProvidersQuery(showId: string) {
  return useQuery({
    queryKey: [WATCH_PROVIDERS_QUERY_KEY, showId],
    queryFn: ({ queryKey }) => getWatchProviders(Number(queryKey[1])),
    select: (data) => data.results?.US,
  });
}
