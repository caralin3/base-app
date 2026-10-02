import { type RefreshControlProps } from 'react-native';

import { type ProductionOrderDocument } from '@/lib/firebase/types';
import { type Episode, type Show, type ShowSeason } from '@/lib/types';

import { EpisodesBySeasonList } from '../episodes';
import { Text, View } from '../ui';
import { EpisodeTabHeader } from './episode-tab-header';

interface EpisodesTabContentProps {
  episodes: Episode[];
  isLoading?: boolean;
  seasons: ShowSeason[];
  onFavoriteEpisode: (episode: Episode) => void;
  productionOrder?: ProductionOrderDocument | null;
  refreshControl?:
    | React.ReactElement<
        RefreshControlProps,
        string | React.JSXElementConstructor<any>
      >
    | undefined;
  seasonNumber: number;
  setSeasonNumber: (value: string | number) => void;
  show: Show;
  sortByProductionOrder?: boolean;
  onSortByProductionOrder?: (enabled: boolean) => void;
}

export const EpisodesTabContent = ({
  episodes,
  isLoading,
  onFavoriteEpisode,
  productionOrder,
  refreshControl,
  show,
  sortByProductionOrder,
  onSortByProductionOrder,
  ...props
}: EpisodesTabContentProps) => (
  <EpisodesBySeasonList
    inTabPanel
    episodes={episodes}
    isLoading={isLoading}
    ListEmptyComponent={
      isLoading ? undefined : (
        <View className="flex-1 px-4 py-8">
          <Text className="text-white" align="center">
            There are no episodes for this season yet.
          </Text>
        </View>
      )
    }
    ListHeaderComponent={
      <EpisodeTabHeader
        show={show}
        productionOrder={productionOrder}
        sortByProductionOrder={sortByProductionOrder}
        onSortByProductionOrder={onSortByProductionOrder}
        {...props}
      />
    }
    onFavorite={onFavoriteEpisode}
    backdropPath={show.backdropPath}
    itemType="expanded"
    refreshControl={refreshControl}
  />
);
