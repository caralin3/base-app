import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { RefreshControl } from 'react-native-gesture-handler';

import { colors, PosterSection, Screen, ScrollView } from '@/components';
import { useAuth } from '@/lib';
import {
  FIRESTORE_COLLECTIONS,
  getCurrentlyWatchingShows,
  getFavoriteShows,
} from '@/lib/firebase';
import { getTmdbUri, sortByDate } from '@/lib/utils';

export default function Home() {
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
  const {
    data: currentlyWatchingShows,
    refetch: refetchCurrentlyWatching,
    isRefetching: isRefetchingCurrentlyWatching,
  } = useQuery({
    queryKey: [FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS, userId],
    queryFn: ({ queryKey }) => getCurrentlyWatchingShows(queryKey[1]),
    select: (currentlyWatchingShows) =>
      currentlyWatchingShows
        .sort((a, b) =>
          sortByDate(a.watchingAt || '', b.watchingAt || '', 'desc')
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
        <PosterSection
          title="Currently Watching"
          posters={currentlyWatchingShows ?? []}
          viewAllHref="/(groups)/currently-watching"
        />
        <PosterSection
          title="My Favorites"
          posters={data ?? []}
          viewAllHref="/(groups)/favorites"
        />
      </ScrollView>
    </Screen>
  );
}
