import { useMemo } from 'react';

import { View } from '../ui';
import { SeasonSelect } from './season-select';

interface EpisodeTabHeaderProps {
  numberOfSeasons?: number;
  seasonNumber: number;
  setSeasonNumber: (value: string | number) => void;
  showAll?: boolean;
}

export const EpisodeTabHeader = ({
  numberOfSeasons,
  seasonNumber,
  setSeasonNumber,
  showAll = false,
}: EpisodeTabHeaderProps) => {
  const options = useMemo(() => {
    const seasons = Array.from({ length: numberOfSeasons ?? 0 }, (_, i) => ({
      label: `Season ${i + 1}`,
      value: i + 1,
    }));
    if (showAll) {
      return [{ label: 'All Seasons', value: 0 }, ...seasons];
    }
    return seasons;
  }, [numberOfSeasons, showAll]);

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
