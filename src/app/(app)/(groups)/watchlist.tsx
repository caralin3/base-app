import { useCallback } from 'react';
import { RefreshControl } from 'react-native-gesture-handler';

import { Screen, Text, View } from '@/components';
import { PosterList } from '@/components/poster/poster-list';
import { useWatchlistShows } from '@/lib/hooks';

export default function Watchlist() {
  const { watchlistShows, refetch, isRefetching } = useWatchlistShows();

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Screen
      headerProps={{
        title: 'Watch List',
      }}
    >
      <View className="flex-1 p-4">
        <PosterList
          canToggle
          list="watchlist"
          data={watchlistShows ?? []}
          horizontal={false}
          horizontalItem
          isLoading={isRefetching}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View className="flex-1 px-4 py-8">
              <Text className="text-white" align="center">
                You don&apos;t have any shows in your watchlist yet.
              </Text>
              <Text className="text-white" align="center">
                Browse shows and tap the heart icon to add them here!
              </Text>
            </View>
          }
        />
      </View>
    </Screen>
  );
}
