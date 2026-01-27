import { useLocalSearchParams } from 'expo-router';

import {
  Image,
  Screen,
  TabsScrollView,
  TabsView,
  Text,
  View,
} from '@/components';
import { useFavoriteEpisodes, useShowDetails } from '@/lib/hooks';
import { type ShowRouteParams } from '@/lib/types';
import { getTmdbUri } from '@/lib/utils';

export default function Show() {
  const local = useLocalSearchParams<ShowRouteParams>();
  const showId = local.id;
  const {
    data: favoriteEpisodes,
    refetch: refetchEpisodes,
    isRefetching: isRefetchingEpisodes,
  } = useFavoriteEpisodes(showId);
  const {
    data: showDetails,
    refetch: refetchShowDetails,
    isRefetching: isRefetchingShowDetails,
  } = useShowDetails(showId);

  const Header = () => (
    <View className="w-full bg-black">
      <Image
        source={{ uri: getTmdbUri(showDetails?.backdrop_path) ?? '' }}
        className="h-52 w-full"
      />
      <Text>{showDetails?.name}</Text>
      <Text>{showDetails?.overview}</Text>
    </View>
  );

  return (
    <Screen>
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
