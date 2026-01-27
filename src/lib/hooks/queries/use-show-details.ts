import { useQuery } from '@tanstack/react-query';

import { getTvShowDetails, SHOW_DETAILS_QUERY_KEY } from '@/lib/api';

export function useShowDetails(showId: string) {
  return useQuery({
    queryKey: [SHOW_DETAILS_QUERY_KEY, showId],
    queryFn: ({ queryKey }) => getTvShowDetails(Number(queryKey[1])),
    enabled: !!showId,
  });
}
