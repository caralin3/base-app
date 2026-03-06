import { useQuery } from '@tanstack/react-query';

import { getTrendingTvShows, TRENDING_SHOWS_QUERY_KEY } from '@/lib/api';
import { formatShowToPoster, formatTvShow } from '@/lib/utils';

export function useTrendingShowsQuery(posterPath?: string) {
  return useQuery({
    queryKey: [TRENDING_SHOWS_QUERY_KEY],
    queryFn: () => getTrendingTvShows(),
    select: (response) => {
      return response.results
        .map((show) => formatTvShow(show))
        .map((show) => formatShowToPoster(show, posterPath));
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
