import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';

import {
  colors,
  EpisodesTabContent,
  Image,
  MyEpisodesTabContent,
  RecommendedTabContent,
  Screen,
  ScrollableHeader,
  TabsView,
  Text,
  View,
  WatchedToggle,
  WatchProviders,
} from '@/components';
import {
  useAuth,
  useProductionOrderByShowIdQuery,
  useSeasonEpisodesQuery,
  useShowDetailsQuery,
  useShowToggles,
  useWatchedShowsByIdQuery,
  useWatchProvidersByShowQuery,
} from '@/lib/hooks';
import { type Episode, type ShowRouteParams } from '@/lib/types';
import { getTmdbUri } from '@/lib/utils';

export default function Show() {
  const local = useLocalSearchParams<ShowRouteParams>();
  const showId = local.id;
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [myEpisodesSeasonNumber, setMyEpisodesSeasonNumber] = useState(0);
  const [sortByProductionOrder, setSortByProductionOrder] = useState(false);
  const userId = useAuth().user?.id ?? '';

  useEffect(() => {
    setSeasonNumber(1);
    setMyEpisodesSeasonNumber(0);
  }, [showId]);

  const { data: showDetailsData, isLoading: isLoadingShowDetails } =
    useShowDetailsQuery(showId);
  const { data: watchProviders } = useWatchProvidersByShowQuery(showId);
  const {
    getEpisodes,
    seasonQuery: { data: season, isLoading: isLoadingSeason },
  } = useSeasonEpisodesQuery(showId, seasonNumber);
  const { data: watchedShow } = useWatchedShowsByIdQuery(showId);
  const { data: productionOrder } = useProductionOrderByShowIdQuery(showId);

  // Get production order for current season
  const currentSeasonProductionOrder =
    productionOrder?.seasonProductionOrders.find(
      (order) => order.seasonNumber === seasonNumber
    );

  // Enable production order sorting by default if available for current season
  useEffect(() => {
    setSortByProductionOrder(!!currentSeasonProductionOrder);
  }, [currentSeasonProductionOrder, seasonNumber]);

  const {
    currentlyWatchingShow,
    favoriteEpisodes,
    favoriteShow,
    isRefetchingFavoriteEpisodes,
    refetchFavoriteEpisodes,
    toggleFavoriteEpisode,
    toggleFavoriteShow,
    toggleCurrentlyWatchingShow,
    toggleWatchlistShow,
    watchlistShow,
  } = useShowToggles(showId, { enableFavoriteEpisodes: true });

  if (isLoadingShowDetails) {
    return (
      <Screen>
        <Text className="text-white">Loading Show Details...</Text>
      </Screen>
    );
  }

  if (showDetailsData == null) {
    return (
      <Screen>
        <Text className="text-white">Show not found.</Text>
      </Screen>
    );
  }

  const { recommendations, ...showDetails } = showDetailsData;

  // Apply production order sorting if enabled
  const sortedEpisodes = (() => {
    if (!season) return [];
    const baseEpisodes = getEpisodes(season.episodes, favoriteEpisodes ?? []);

    if (!sortByProductionOrder || !currentSeasonProductionOrder) {
      return baseEpisodes;
    }

    // Reorder episodes based on production order
    const orderedEpisodes =
      currentSeasonProductionOrder.episodeIdsInProductionOrder
        .map((episodeId) => baseEpisodes.find((ep) => ep.id === episodeId))
        .filter((ep): ep is Episode => ep !== undefined);

    // Add any episodes not in the saved order to the end
    const unorderedEpisodes = baseEpisodes.filter(
      (ep) =>
        !currentSeasonProductionOrder.episodeIdsInProductionOrder.includes(
          ep.id
        )
    );

    return [...orderedEpisodes, ...unorderedEpisodes];
  })();

  const Header = () => (
    <ScrollableHeader style={styles.container}>
      <Image
        source={{ uri: getTmdbUri(showDetails.backdropPath) ?? '' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title} size="3xl" weight="bold">
          {showDetails.name}
        </Text>
        <Text clipText>{showDetails.overview}</Text>
        <WatchProviders providers={watchProviders} />
        <WatchedToggle
          showId={Number(showId)}
          userId={userId}
          watchedShow={watchedShow ?? null}
        />
      </View>
    </ScrollableHeader>
  );

  return (
    <Screen
      headerProps={{
        right: [
          {
            onPress: () => toggleCurrentlyWatchingShow(showDetails),
            icon: {
              color: colors.primary[600],
              name:
                currentlyWatchingShow?.id.toString() === showId
                  ? 'eye.fill'
                  : 'eye',
              type: 'community',
            },
          },
          {
            onPress: () => toggleWatchlistShow(showDetails),
            icon: {
              color: colors.primary[600],
              name:
                watchlistShow?.id.toString() === showId
                  ? 'bookmark.fill'
                  : 'bookmark',
            },
          },
          {
            onPress: () => toggleFavoriteShow(showDetails),
            icon: {
              color: colors.primary[600],
              name:
                favoriteShow?.id.toString() === showId ? 'heart.fill' : 'heart',
            },
          },
        ],
      }}
    >
      <TabsView
        header={Header}
        tabs={[
          {
            name: 'Episodes',
            content: (
              <EpisodesTabContent
                episodes={sortedEpisodes}
                seasons={showDetails.seasons ?? []}
                seasonNumber={seasonNumber}
                setSeasonNumber={(value) => {
                  setSeasonNumber(value as number);
                  setSortByProductionOrder(false);
                }}
                show={showDetails}
                onFavoriteEpisode={(episode) =>
                  toggleFavoriteEpisode(episode, showDetails)
                }
                refreshControl={
                  <RefreshControl
                    onRefresh={() => refetchFavoriteEpisodes()}
                    refreshing={isRefetchingFavoriteEpisodes}
                  />
                }
                productionOrder={productionOrder}
                sortByProductionOrder={sortByProductionOrder}
                onSortByProductionOrder={(enabled) =>
                  setSortByProductionOrder(enabled)
                }
              />
            ),
          },
          {
            name: 'My Episodes',
            content: (
              <MyEpisodesTabContent
                episodes={favoriteEpisodes ?? []}
                onFavoriteEpisode={(episode) =>
                  toggleFavoriteEpisode(episode, showDetails)
                }
                show={showDetails}
                seasons={showDetails.seasons ?? []}
                seasonNumber={myEpisodesSeasonNumber}
                setSeasonNumber={(value) =>
                  setMyEpisodesSeasonNumber(value as number)
                }
                isLoading={isLoadingSeason || isRefetchingFavoriteEpisodes}
                refreshControl={
                  <RefreshControl
                    onRefresh={() => refetchFavoriteEpisodes()}
                    refreshing={isRefetchingFavoriteEpisodes}
                  />
                }
              />
            ),
          },
          {
            name: 'More Like This',
            content: <RecommendedTabContent shows={recommendations?.results} />,
          },
        ]}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },
  image: {
    height: 256,
    width: '100%',
    objectFit: 'cover',
  },
  content: {
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  title: {
    paddingBottom: 8,
  },
});
