import { useQuery } from '@tanstack/react-query';

import {
  getTvShowRecommendations,
  RECOMMENDED_SHOWS_QUERY_KEY,
} from '@/lib/api';
import { formatShowToPoster, formatTvShow } from '@/lib/utils';

export function useRecommendedQuery(showId: string, posterPath?: string) {
  return useQuery({
    queryKey: [RECOMMENDED_SHOWS_QUERY_KEY, showId],
    queryFn: ({ queryKey }) => getTvShowRecommendations(Number(queryKey[1])),
    select: (response) => {
      return response.results
        .map((show) => formatTvShow(show))
        .map((show) => formatShowToPoster(show, posterPath));
    },
  });
}
