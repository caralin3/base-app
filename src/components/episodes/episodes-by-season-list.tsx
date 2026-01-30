import { FlatList, type RefreshControlProps } from 'react-native';

import { type Episode } from '@/lib/types';

import { TabsFlatList } from '../tabs-view';
import { Text, View } from '../ui';
import { EpisodeItem } from './episode-item';
import { EpisodeListSkeleton } from './episode-list-skeleton';

interface EpisodesBySeasonListProps {
  episodes: Episode[];
  inTabPanel?: boolean;
  isLoading?: boolean;
  itemType: 'simple' | 'expanded';
  ListEmptyComponent?: React.ReactElement;
  ListHeaderComponent?: React.ReactElement;
  onFavorite: (episode: Episode) => void;
  posterPath?: string | null;
  refreshControl?:
    | React.ReactElement<
        RefreshControlProps,
        string | React.JSXElementConstructor<any>
      >
    | undefined;
}

export const EpisodesBySeasonList = ({
  episodes,
  isLoading,
  inTabPanel,
  itemType,
  ListEmptyComponent,
  ListHeaderComponent,
  onFavorite,
  posterPath,
  refreshControl,
}: EpisodesBySeasonListProps) => {
  const getEmptyComponent = () => {
    if (isLoading) {
      return <EpisodeListSkeleton />;
    }
    if (ListEmptyComponent) {
      return ListEmptyComponent;
    }
    return (
      <View className="flex-1 px-4 py-8">
        <Text className="text-white" align="center">
          There are no episodes for this season yet.
        </Text>
      </View>
    );
  };

  if (inTabPanel) {
    return (
      <TabsFlatList
        ListEmptyComponent={getEmptyComponent()}
        ListHeaderComponent={ListHeaderComponent}
        data={episodes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EpisodeItem
            episode={item}
            onFavorite={onFavorite}
            posterPath={posterPath}
            type={itemType}
          />
        )}
        contentContainerStyle={{ padding: 8 }}
        refreshControl={refreshControl}
      />
    );
  }

  return (
    <FlatList
      ListEmptyComponent={getEmptyComponent()}
      ListHeaderComponent={ListHeaderComponent}
      data={episodes}
      scrollEnabled={false}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <EpisodeItem
          episode={item}
          onFavorite={onFavorite}
          posterPath={posterPath}
          type={itemType}
        />
      )}
      refreshControl={refreshControl}
    />
  );
};
