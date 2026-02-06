import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

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
  WatchProviders,
} from '@/components';
import {
  useRecommendedQuery,
  useSeasonEpisodesQuery,
  useShowDetailsQuery,
  useShowToggles,
  useWatchProvidersQuery,
} from '@/lib/hooks';
import { type ShowRouteParams } from '@/lib/types';
import { getTmdbUri } from '@/lib/utils';

export default function Show() {
  const local = useLocalSearchParams<ShowRouteParams>();
  const showId = local.id;
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [myEpisodesSeasonNumber, setMyEpisodesSeasonNumber] = useState(0);

  useEffect(() => {
    setSeasonNumber(1);
    setMyEpisodesSeasonNumber(0);
  }, [showId]);

  const { data: showDetails, isLoading: isLoadingShowDetails } =
    useShowDetailsQuery(showId);
  const { data: watchProviders } = useWatchProvidersQuery(showId);
  const {
    getEpisodes,
    seasonQuery: { data: season, isLoading: isLoadingSeason },
  } = useSeasonEpisodesQuery(showId, seasonNumber);
  const { data: recommendedShows } = useRecommendedQuery(showId);

  const {
    currentlyWatchingShow,
    favoriteEpisodes,
    favoriteShow,
    toggleFavoriteEpisode,
    toggleFavoriteShow,
    toggleCurrentlyWatchingShow,
  } = useShowToggles(showId);

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
    <View className="bg-black">
      <Image
        source={{ uri: getTmdbUri(showDetails.backdropPath) ?? '' }}
        className="h-64 w-full object-cover"
      />
      <View className="px-2 py-4">
        <Text className="pb-2" size="3xl" weight="bold">
          {showDetails.name}
        </Text>
        <Text clipText>{showDetails.overview}</Text>
        <WatchProviders providers={watchProviders} />
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
                numberOfSeasons={showDetails.numberOfSeasons}
                seasonNumber={seasonNumber}
                setSeasonNumber={(value) => setSeasonNumber(value as number)}
                show={showDetails}
                onFavoriteEpisode={(episode) =>
                  toggleFavoriteEpisode(episode, showDetails)
                }
                isLoading={isLoadingSeason}
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
                numberOfSeasons={showDetails.numberOfSeasons}
                seasonNumber={myEpisodesSeasonNumber}
                setSeasonNumber={(value) =>
                  setMyEpisodesSeasonNumber(value as number)
                }
                isLoading={false}
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
