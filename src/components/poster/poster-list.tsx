import { FlatList, type RefreshControlProps } from 'react-native';

import { TabsFlatList } from '../tabs-view';
import { View } from '../ui';
import { Poster, type PosterProps } from './poster';
import { PosterListSkeleton } from './poster-list-skeleton';

interface PosterListProps {
  data: PosterProps[];
  horizontal?: boolean;
  horizontalItem?: boolean;
  inTabPanel?: boolean;
  isLoading?: boolean;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  onPress?: () => void;
  refreshControl?:
    | React.ReactElement<
        RefreshControlProps,
        string | React.JSXElementConstructor<any>
      >
    | undefined;
}

export const PosterList = ({
  data,
  horizontal = true,
  horizontalItem = false,
  inTabPanel = false,
  isLoading,
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
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => (
          <Poster {...item} horizontal={horizontalItem} onPress={onPress} />
        )}
        ListEmptyComponent={emptyComponent}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
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
        <Poster {...item} horizontal={horizontalItem} onPress={onPress} />
      )}
      ListEmptyComponent={emptyComponent}
      ItemSeparatorComponent={() => <View className="h-2" />}
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      refreshControl={refreshControl}
    />
  );
};
