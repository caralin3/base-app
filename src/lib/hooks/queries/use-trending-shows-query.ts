import { useQuery } from '@tanstack/react-query';

import { type PosterProps } from '@/components';
import { getTrendingTvShows, TRENDING_SHOWS_QUERY_KEY } from '@/lib/api';
import { formatTvShow, getTmdbUri } from '@/lib/utils';

export function useTrendingShowsQuery(posterPath?: string) {
  return useQuery({
    queryKey: [TRENDING_SHOWS_QUERY_KEY],
    queryFn: () => getTrendingTvShows(),
    select: (response) => {
      return response.results
        .map((show) => formatTvShow(show))
        .map((show) => {
          const poster: PosterProps = {
            ...show,
            href: `/show/${show.id}` as const,
            isFavorite: show.favoritedAt != null,
            isWatching: show.watchingAt != null,
            uri: getTmdbUri(posterPath ?? show.posterPath),
          };
          return poster;
        });
    },
  });
}
