import { useQuery } from '@tanstack/react-query';

import { getTvShowDetails, SHOW_DETAILS_QUERY_KEY } from '@/lib/api';
import { formatTvShow } from '@/lib/utils';

export function useShowDetailsQuery(showId: string) {
  return useQuery({
    queryKey: [SHOW_DETAILS_QUERY_KEY, showId],
    queryFn: ({ queryKey }) => getTvShowDetails(Number(queryKey[1])),
    select: (data) => formatTvShow(data),
  });
}
