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
  useRecommendedQuery,
  useSeasonEpisodesQuery,
  useShowDetailsQuery,
  useShowToggles,
  useWatchedShowsByIdQuery,
  useWatchProvidersByShowQuery,
} from '@/lib/hooks';
import { type ShowRouteParams } from '@/lib/types';
import { getTmdbUri } from '@/lib/utils';

export default function Show() {
  const local = useLocalSearchParams<ShowRouteParams>();
  const showId = local.id;
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [myEpisodesSeasonNumber, setMyEpisodesSeasonNumber] = useState(0);
  const userId = useAuth().user?.id ?? '';

  useEffect(() => {
    setSeasonNumber(1);
    setMyEpisodesSeasonNumber(0);
  }, [showId]);

  const { data: showDetails, isLoading: isLoadingShowDetails } =
    useShowDetailsQuery(showId);
  const { data: watchProviders } = useWatchProvidersByShowQuery(showId);
  const {
    getEpisodes,
    seasonQuery: { data: season, isLoading: isLoadingSeason },
  } = useSeasonEpisodesQuery(showId, seasonNumber);
  const { data: recommendedShows } = useRecommendedQuery(showId);
  const { data: watchedShow } = useWatchedShowsByIdQuery(showId);

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

  if (showDetails == null) {
    return (
      <Screen>
        <Text className="text-white">Show not found.</Text>
      </Screen>
    );
  }

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
                episodes={
                  season
                    ? getEpisodes(season.episodes, favoriteEpisodes ?? [])
                    : []
                }
                seasons={showDetails.seasons ?? []}
                seasonNumber={seasonNumber}
                setSeasonNumber={(value) => setSeasonNumber(value as number)}
                show={showDetails}
                onFavoriteEpisode={(episode) =>
                  toggleFavoriteEpisode(episode, showDetails)
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
            content: <RecommendedTabContent shows={recommendedShows} />,
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
