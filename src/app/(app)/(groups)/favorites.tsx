import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { RefreshControl } from 'react-native-gesture-handler';
import { Screen, View } from '@/components';
import { PosterList } from '@/components/poster/poster-list';
import { useAuth } from '@/lib';
import { FIRESTORE_COLLECTIONS, getFavoriteShows } from '@/lib/firebase';
import { getTmdbUri, sortByDate } from '@/lib/utils';

export default function Favorites() {
  const userId = useAuth().user?.id ?? '';
  const { data, refetch, isRefetching } = useQuery({
    queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_SHOWS, userId],
    queryFn: ({ queryKey }) => getFavoriteShows(queryKey[1]),
    select: (favoriteShows) =>
      favoriteShows
        .sort((a, b) =>
          sortByDate(a.favoritedAt || '', b.favoritedAt || '', 'desc')
        )
        .map((show) => ({
          ...show,
          href: `/show/${show.id}` as const,
          isFavorite: show.favoritedAt != null,
          isWatching: show.watchingAt != null,
          uri: getTmdbUri(show.posterPath),
        })),
    enabled: !!userId,
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Screen
      headerProps={{
        title: 'My Favorites',
      }}
    >
      <View className="p-4 flex-1">
        <PosterList
          data={data ?? []}
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
