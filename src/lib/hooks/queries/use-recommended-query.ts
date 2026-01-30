import { useQuery } from '@tanstack/react-query';

import { type PosterProps } from '@/components';
import {
  getTvShowRecommendations,
  RECOMMENDED_SHOWS_QUERY_KEY,
} from '@/lib/api';
import { formatTvShow, getTmdbUri } from '@/lib/utils';

export function useRecommendedQuery(showId: string, posterPath?: string) {
  return useQuery({
    queryKey: [RECOMMENDED_SHOWS_QUERY_KEY, showId],
    queryFn: ({ queryKey }) => getTvShowRecommendations(Number(queryKey[1])),
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
