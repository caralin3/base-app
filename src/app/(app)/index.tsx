import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useCallback } from 'react';
import { RefreshControl } from 'react-native-gesture-handler';

import { colors, Screen, ScrollView, Text } from '@/components';
import { useAuth } from '@/lib';
import {
  FIRESTORE_COLLECTIONS,
  getCurrentlyWatchingShows,
  getFavoriteShows,
} from '@/lib/firebase';
import { sortByDate } from '@/lib/utils';

export default function Home() {
  const userId = useAuth().user?.id ?? '';
  const { data, refetch, isRefetching } = useQuery({
    queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_SHOWS, userId],
    queryFn: ({ queryKey }) => getFavoriteShows(queryKey[1]),
    select: (favoriteShows) =>
      favoriteShows.sort((a, b) =>
        sortByDate(a.favoritedAt || '', b.favoritedAt || '', 'desc')
      ),
    enabled: !!userId,
  });
  const {
    data: currentlyWatchingShows,
    refetch: refetchCurrentlyWatching,
    isRefetching: isRefetchingCurrentlyWatching,
  } = useQuery({
    queryKey: [FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS, userId],
    queryFn: ({ queryKey }) => getCurrentlyWatchingShows(queryKey[1]),
    select: (currentlyWatchingShows) =>
      currentlyWatchingShows.sort((a, b) =>
        sortByDate(a.watchingAt || '', b.watchingAt || '', 'desc')
      ),
    enabled: !!userId,
  });

  const onRefresh = useCallback(() => {
    refetch();
    refetchCurrentlyWatching();
  }, [refetch, refetchCurrentlyWatching]);

  return (
    <Screen
      headerProps={{
        brand: true,
        title: 'Binge Buddy',
        showBackButton: false,
        titleColor: colors.primary[600],
      }}
    >
      <ScrollView
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching || isRefetchingCurrentlyWatching}
            onRefresh={onRefresh}
          />
        }
      >
        {data?.map((favoriteShow) => (
          <Link
            key={favoriteShow.id}
            href={`/show/${favoriteShow.id}`}
            className="mt-4"
          >
            <Text>
              {favoriteShow.name} {favoriteShow.id}
            </Text>
          </Link>
        ))}

        <Text className="mt-8 text-lg font-semibold">Currently Watching</Text>
        {currentlyWatchingShows?.map((show) => (
          <Link key={show.id} href={`/show/${show.id}`} className="mt-4">
            <Text>
              {show.name} {show.id}
            </Text>
          </Link>
        ))}
      </ScrollView>
      <Link href="/(groups)/favorites" className="mt-4">
        <Text className="text-blue-500 underline">Favorites</Text>
      </Link>
      <Link href="/(groups)/currently-watching" className="mt-4">
        <Text className="text-blue-500 underline">Currently Watching</Text>
      </Link>
    </Screen>
  );
}
