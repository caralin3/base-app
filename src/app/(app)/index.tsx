import { useCallback } from 'react';
import { RefreshControl } from 'react-native-gesture-handler';

import { colors, PosterSection, Screen, ScrollView } from '@/components';
import {
  useCurrentlyWatchingShows,
  useFavoriteShows,
  useTrendingShows,
} from '@/lib/hooks';

export default function Home() {
  const {
    data: favoriteShows,
    refetch: refetchFavoriteShows,
    isRefetching: isRefetchingFavoriteShows,
  } = useFavoriteShows();

  const {
    data: currentlyWatchingShows,
    refetch: refetchCurrentlyWatching,
    isRefetching: isRefetchingCurrentlyWatching,
  } = useCurrentlyWatchingShows();

  const {
    data: trendingShows,
    refetch: refetchTrendingShows,
    isRefetching: isRefetchingTrendingShows,
  } = useTrendingShows();

  const onRefresh = useCallback(() => {
    refetchFavoriteShows();
    refetchCurrentlyWatching();
    refetchTrendingShows();
  }, [refetchFavoriteShows, refetchCurrentlyWatching, refetchTrendingShows]);

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
            refreshing={
              isRefetchingFavoriteShows ||
              isRefetchingCurrentlyWatching ||
              isRefetchingTrendingShows
            }
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
          posters={favoriteShows ?? []}
          viewAllHref="/(groups)/favorites"
        />
        <PosterSection title="Trending Shows" posters={trendingShows ?? []} />
      </ScrollView>
    </Screen>
  );
}
