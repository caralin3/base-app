import { useQuery } from '@tanstack/react-query';

import { getTvSeason, SEASON_EPISODES_QUERY_KEY } from '@/lib/api';
import { type Episode } from '@/lib/types';
import { formatSeason } from '@/lib/utils';

export function useSeasonEpisodesQuery(showId: string, seasonNumber: number) {
  const seasonQuery = useQuery({
    queryKey: [SEASON_EPISODES_QUERY_KEY, showId, seasonNumber],
    queryFn: ({ queryKey }) =>
      getTvSeason(Number(queryKey[1]), Number(queryKey[2])),
    select: (response) => {
      return formatSeason(response);
    },
  });

  const getEpisodes = (
    seasonEpisodes: Episode[],
    favoriteEpisodes: Episode[]
  ): Episode[] => {
    return seasonEpisodes.map((episode) => ({
      ...episode,
      isFavorite: !!favoriteEpisodes.find(
        (favEpisode) => favEpisode.id === episode.id
      ),
    }));
  };

  return { getEpisodes, seasonQuery };
}
