import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { RefreshControl } from 'react-native-gesture-handler';

import {
  colors,
  EpisodesTabContent,
  Image,
  MyEpisodesTabContent,
  RecommendedTabContent,
  Screen,
  TabsView,
  Text,
  View,
} from '@/components';
import {
  useCurrentlyWatchingShows,
  useFavoriteEpisodes,
  useFavoriteShows,
  useSeasonEpisodes,
  useShowDetails,
  useShowToggles,
} from '@/lib/hooks';
import { useRecommendedShows } from '@/lib/hooks/queries/use-recommended-shows';
import { type ShowRouteParams } from '@/lib/types';
import { getTmdbUri } from '@/lib/utils';

export default function Show() {
  const local = useLocalSearchParams<ShowRouteParams>();
  const showId = local.id;
  const { data: recommendedShows } = useRecommendedShows(showId);
  const {
    data: favoriteShowsData,
    refetch: refetchFavoriteShows,
    isFetching: isFetchingFavoriteShows,
  } = useFavoriteShows();
  const favoriteShow = favoriteShowsData?.find(
    (show) => show.id.toString() === showId
  );
  const currentlyWatchingShow = useCurrentlyWatchingShows().data?.find(
    (show) => show.id.toString() === showId
  );
  const {
    toggleFavoriteEpisode,
    toggleFavoriteShow,
    toggleCurrentlyWatchingShow,
  } = useShowToggles(showId);
  const {
    getEpisodes,
    seasonQuery: { data: season },
  } = useSeasonEpisodes(showId, 1);

  const {
    data: favoriteEpisodes,
    refetch: refetchEpisodes,
    isRefetching: isRefetchingEpisodes,
  } = useFavoriteEpisodes(showId);
  const { data: showDetails, isRefetching: isRefetchingShowDetails } =
    useShowDetails(showId);

  const onRefresh = useCallback(() => {
    refetchEpisodes();
    refetchFavoriteShows();
  }, [refetchEpisodes, refetchFavoriteShows]);

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [onRefresh])
  );

  const isRefetching = isRefetchingEpisodes || isFetchingFavoriteShows;

  if (isRefetchingShowDetails) {
    return (
      <Screen>
        <Text className="text-white">Loading Show Details...</Text>
      </Screen>
    );
  }

  if (showDetails == null) {
    return (
      <Screen>
        <Text className="text-white">Show not found.</Text>
      </Screen>
    );
  }

  const Header = () => (
    <View className="bg-black">
      <Image
        source={{ uri: getTmdbUri(showDetails.backdropPath) ?? '' }}
        className="h-52 w-full object-cover"
      />
      <View className="px-2 py-4">
        <Text className="pb-2" size="3xl" weight="bold">
          {showDetails.name}
        </Text>
        <Text clipText>{showDetails.overview}</Text>
      </View>
    </View>
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
                episodes={
                  season
                    ? getEpisodes(season.episodes, favoriteEpisodes ?? [])
                    : []
                }
                show={showDetails}
                onFavoriteEpisode={(episode) =>
                  toggleFavoriteEpisode(episode, showDetails)
                }
                refreshControl={
                  <RefreshControl
                    refreshing={isRefetching}
                    onRefresh={onRefresh}
                  />
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
                refreshControl={
                  <RefreshControl
                    refreshing={isRefetching}
                    onRefresh={onRefresh}
                  />
                }
              />
            ),
          },
          {
            name: 'More Like This',
            content: <RecommendedTabContent shows={recommendedShows} />,
          },
        ]}
      />
    </Screen>
  );
}
