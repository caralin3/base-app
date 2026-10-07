import { useQuery } from '@tanstack/react-query';

import { getTvShowDetails, SHOW_DETAILS_QUERY_KEY } from '@/lib/api';
import { formatShowToPoster, formatTvShow } from '@/lib/utils';

export function useShowDetailsQuery(showId: string) {
  return useQuery({
    queryKey: [SHOW_DETAILS_QUERY_KEY, showId],
    queryFn: ({ queryKey }) => getTvShowDetails(Number(queryKey[1])),
    select: (data) => ({
      ...formatTvShow(data),
      recommendations: {
        ...data.recommendations,
        results: data?.recommendations?.results
          ?.map((show) => formatTvShow(show))
          .map((show) => formatShowToPoster(show)),
      },
    }),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
