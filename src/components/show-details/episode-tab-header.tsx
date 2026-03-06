import { useMemo } from 'react';

import { type ShowSeason } from '@/lib/types';

import { View } from '../ui';
import { SeasonSelect } from './season-select';

interface EpisodeTabHeaderProps {
  seasons: ShowSeason[];
  seasonNumber: number;
  setSeasonNumber: (value: string | number) => void;
  showAll?: boolean;
  showEpisodeCount?: boolean;
}

export const EpisodeTabHeader = ({
  seasons,
  seasonNumber,
  setSeasonNumber,
  showAll = false,
  showEpisodeCount = true,
}: EpisodeTabHeaderProps) => {
  const options = useMemo(() => {
    const showSeasons =
      seasons?.map((season) => ({
        label: `Season ${season.seasonNumber}`,
        subLabel: showEpisodeCount
          ? `${season.episodeCount} episodes`
          : undefined,
        value: season.seasonNumber,
      })) ?? [];
    if (showAll) {
      return [{ label: 'All Seasons', value: 0 }, ...showSeasons];
    }
    return showSeasons;
  }, [seasons, showAll, showEpisodeCount]);

  return (
    <View className="mt-4 w-36">
      <SeasonSelect
        placeholder="Season"
        options={options}
        value={seasonNumber}
        onSelect={(option) => setSeasonNumber(option)}
        optionsTitle="Seasons"
      />
    </View>
  );
};
