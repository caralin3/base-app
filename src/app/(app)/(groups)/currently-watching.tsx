import { useCallback } from 'react';
import { RefreshControl } from 'react-native-gesture-handler';

import { Screen, View } from '@/components';
import { PosterList } from '@/components/poster/poster-list';
import { useCurrentlyWatching } from '@/lib/hooks';

export default function CurrentlyWatching() {
  const { currentlyWatchingShows, refetch, isRefetching } =
    useCurrentlyWatching();

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Screen
      headerProps={{
        title: 'Currently Watching',
      }}
    >
      <View className="flex-1 p-4">
        <PosterList
          data={currentlyWatchingShows ?? []}
          horizontal={false}
          horizontalItem
          isLoading={isRefetching}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
        />
      </View>
    </Screen>
  );
}
