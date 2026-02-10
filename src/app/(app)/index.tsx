import { useCallback } from 'react';
import { RefreshControl } from 'react-native-gesture-handler';

import { colors, PosterSection, Screen, ScrollView } from '@/components';
import {
  useCurrentlyWatching,
  useFavoriteShows,
  useTrendingShowsQuery,
  useWatchlistShows,
} from '@/lib/hooks';

export default function Home() {
  const {
    favoriteShows,
    refetch: refetchFavoriteShows,
    isRefetching: isRefetchingFavoriteShows,
  } = useFavoriteShows();

  const {
    currentlyWatchingShows,
    refetch: refetchCurrentlyWatching,
    isRefetching: isRefetchingCurrentlyWatching,
  } = useCurrentlyWatching();

  const {
    data: trendingShows,
    refetch: refetchTrendingShows,
    isRefetching: isRefetchingTrendingShows,
  } = useTrendingShowsQuery();

  const {
    watchlistShows,
    refetch: refetchWatchlistShows,
    isRefetching: isRefetchingWatchlistShows,
  } = useWatchlistShows();

  const onRefresh = useCallback(() => {
    refetchFavoriteShows();
    refetchCurrentlyWatching();
    refetchTrendingShows();
    refetchWatchlistShows();
  }, [
    refetchCurrentlyWatching,
    refetchFavoriteShows,
    refetchTrendingShows,
    refetchWatchlistShows,
  ]);

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
        contentContainerClassName="p-4 gap-5"
        refreshControl={
          <RefreshControl
            refreshing={
              isRefetchingFavoriteShows ||
              isRefetchingCurrentlyWatching ||
              isRefetchingTrendingShows ||
              isRefetchingWatchlistShows
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
        <PosterSection
          title="Watch List"
          posters={watchlistShows ?? []}
          viewAllHref="/(groups)/watchlist"
        />
        <PosterSection title="Trending Shows" posters={trendingShows ?? []} />
      </ScrollView>
    </Screen>
  );
}
