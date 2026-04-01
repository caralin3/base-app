import { useRouter } from 'expo-router';
import { useMemo } from 'react';

import { type ProductionOrderDocument } from '@/lib/firebase/types';
import { type Show, type ShowSeason } from '@/lib/types';

import { IconPopupMenu, View } from '../ui';
import { SeasonSelect } from './season-select';

interface EpisodeTabHeaderProps {
  seasons: ShowSeason[];
  seasonNumber: number;
  setSeasonNumber: (value: string | number) => void;
  show: Show;
  showAll?: boolean;
  showEpisodeCount?: boolean;
  productionOrder?: ProductionOrderDocument | null;
  sortByProductionOrder?: boolean;
  onSortByProductionOrder?: (enabled: boolean) => void;
}

export const EpisodeTabHeader = ({
  seasons,
  seasonNumber,
  setSeasonNumber,
  show,
  showAll = false,
  showEpisodeCount = true,
  productionOrder,
  sortByProductionOrder = false,
  onSortByProductionOrder,
}: EpisodeTabHeaderProps) => {
  const router = useRouter();

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

  // Check if current season has a production order
  const hasProductionOrder = productionOrder?.seasonProductionOrders.some(
    (order) => order.seasonNumber === seasonNumber
  );

  return (
    <View className="mt-4 flex-row items-start justify-between gap-2">
      <View className="w-36">
        <SeasonSelect
          placeholder="Season"
          options={options}
          value={seasonNumber}
          onSelect={(option) => setSeasonNumber(option as number)}
          optionsTitle="Seasons"
        />
      </View>
      <View className="flex-row gap-2">
        {hasProductionOrder && (
          <IconPopupMenu
            iconName="arrow.up.arrow.down"
            iconType="community"
            triggerSize={28}
            label="Sort By"
            items={[
              {
                label: 'Default order',
                iconName: !sortByProductionOrder ? 'checkmark' : undefined,
                onPress: () => onSortByProductionOrder?.(false),
              },
              {
                label: 'Production order',
                iconName: sortByProductionOrder ? 'checkmark' : undefined,
                onPress: () => onSortByProductionOrder?.(true),
              },
            ]}
          />
        )}
        <IconPopupMenu
          iconName="gearshape"
          triggerSize={28}
          items={[
            {
              iconName: 'pencil',
              label: 'Set production order',
              onPress: () =>
                router.navigate(`/(app)/show/${show.id}/set-production-order`),
            },
          ]}
        />
      </View>
    </View>
  );
};
