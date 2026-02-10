import { FlatList, type RefreshControlProps } from 'react-native';

import { TabsFlatList } from '../tabs-view';
import { View } from '../ui';
import { type PosterProps } from './poster';
import { PosterListItem } from './poster-list-item';
import { PosterListSkeleton } from './poster-list-skeleton';

interface PosterListProps {
  canToggle?: boolean;
  data: PosterProps[];
  horizontal?: boolean;
  horizontalItem?: boolean;
  inTabPanel?: boolean;
  isLoading?: boolean;
  list?: 'favorites' | 'currentlyWatching' | 'watchlist';
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  onPress?: (showId: number) => void;
  refreshControl?:
    | React.ReactElement<
        RefreshControlProps,
        string | React.JSXElementConstructor<any>
      >
    | undefined;
}

export const PosterList = ({
  canToggle = false,
  data,
  horizontal = true,
  horizontalItem = false,
  inTabPanel = false,
  isLoading,
  list,
  ListEmptyComponent,
  onPress,
  refreshControl,
}: PosterListProps) => {
  const emptyComponent = isLoading ? (
    <PosterListSkeleton
      horizontal={horizontal}
      horizontalItem={horizontalItem}
    />
  ) : (
    ListEmptyComponent
  );

  if (inTabPanel) {
    return (
      <TabsFlatList
        data={data}
        horizontal={horizontal}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <PosterListItem
            item={item as any}
            horizontalItem={horizontalItem}
            onPress={onPress}
            canToggle={canToggle}
            list={list}
          />
        )}
        ListEmptyComponent={emptyComponent}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={<View className="h-4" />}
        contentContainerStyle={{
          padding: 8,
        }}
        refreshControl={refreshControl}
      />
    );
  }

  return (
    <FlatList
      data={data}
      horizontal={horizontal}
      renderItem={({ item }) => (
        <PosterListItem
          item={item as any}
          horizontalItem={horizontalItem}
          onPress={onPress}
          canToggle={canToggle}
          list={list}
        />
      )}
      ListEmptyComponent={emptyComponent}
      ItemSeparatorComponent={() => <View className="h-3" />}
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      refreshControl={refreshControl}
    />
  );
};
