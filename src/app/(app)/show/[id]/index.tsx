import { useLocalSearchParams } from 'expo-router';

import {
  colors,
  Image,
  Screen,
  TabsScrollView,
  TabsView,
  Text,
  View,
} from '@/components';
import {
  useCurrentlyWatchingShows,
  useFavoriteEpisodes,
  useFavoriteShows,
  useShowDetails,
  useShowToggles,
} from '@/lib/hooks';
import { type ShowRouteParams } from '@/lib/types';
import { getTmdbUri } from '@/lib/utils';

export default function Show() {
  const local = useLocalSearchParams<ShowRouteParams>();
  const showId = local.id;
  const favoriteShow = useFavoriteShows().data?.find(
    (show) => show.id.toString() === showId
  );
  const currentlyWatchingShow = useCurrentlyWatchingShows().data?.find(
    (show) => show.id.toString() === showId
  );
  const { toggleFavoriteShow, toggleCurrentlyWatchingShow } =
    useShowToggles(showId);

  const {
    data: favoriteEpisodes,
    refetch: refetchEpisodes,
    isRefetching: isRefetchingEpisodes,
  } = useFavoriteEpisodes(showId);
  const { data: showDetails, isRefetching: isRefetchingShowDetails } =
    useShowDetails(showId);

  if (showDetails == null) {
    return (
      <Screen>
        <Text className="text-white">Show not found.</Text>
      </Screen>
    );
  }

  if (isRefetchingShowDetails) {
    return (
      <Screen>
        <Text className="text-white">Loading Show Details...</Text>
      </Screen>
    );
  }

  const Header = () => (
    <View className="w-full bg-black">
      <Image
        source={{ uri: getTmdbUri(showDetails.backdropPath) ?? '' }}
        className="h-52 w-full"
      />
      <Text>{showDetails.name}</Text>
      <Text>{showDetails.overview}</Text>
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
            name: 'My Episodes',
            content: (
              <TabsScrollView>
                <Text className="text-white">My Episodes Content</Text>
              </TabsScrollView>
            ),
          },
          {
            name: 'Episodes',
            content: (
              <TabsScrollView>
                <Text className="text-white">Episodes Content</Text>
              </TabsScrollView>
            ),
          },
          {
            name: 'More Like This',
            content: (
              <TabsScrollView>
                <Text className="text-white">More Content</Text>
              </TabsScrollView>
            ),
          },
        ]}
      />
    </Screen>
  );
}
