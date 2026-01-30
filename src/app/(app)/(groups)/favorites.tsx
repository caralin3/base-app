import { useCallback } from 'react';
import { RefreshControl } from 'react-native-gesture-handler';

import { Screen, View } from '@/components';
import { PosterList } from '@/components/poster/poster-list';
import { useFavoriteShows } from '@/lib/hooks';

export default function Favorites() {
  const { favoriteShows, refetch, isRefetching } = useFavoriteShows();

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Screen
      headerProps={{
        title: 'My Favorites',
      }}
    >
      <View className="flex-1 p-4">
        <PosterList
          data={favoriteShows ?? []}
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
