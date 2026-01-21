import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

import { Image, ParallaxScrollView, Screen, Text } from '@/components';
import { useAuth } from '@/lib';
import { getTvShowDetails } from '@/lib/api';
import { FIRESTORE_COLLECTIONS, getFavoriteEpisodes } from '@/lib/firebase';
import { type ShowRouteParams } from '@/lib/types';
import { getTmdbUri } from '@/lib/utils';

export default function Show() {
  const userId = useAuth().user?.id ?? '';
  const local = useLocalSearchParams<ShowRouteParams>();
  const showId = local.id;
  const {
    data: favoriteEpisodes,
    refetch: refetchEpisodes,
    isRefetching: isRefetchingEpisodes,
  } = useQuery({
    queryKey: [FIRESTORE_COLLECTIONS.FAVORITE_EPISODES, showId, userId],
    queryFn: ({ queryKey }) => getFavoriteEpisodes(queryKey[1], queryKey[2]),
    enabled: !!showId && !!userId,
  });
  const {
    data: showDetails,
    refetch: refetchShowDetails,
    isRefetching: isRefetchingShowDetails,
  } = useQuery({
    queryKey: ['showDetails', showId],
    queryFn: ({ queryKey }) => getTvShowDetails(Number(queryKey[1])),
    enabled: !!showId,
  });

  return (
    <Screen
      headerProps={{
        title: 'Show',
      }}
    >
      <ParallaxScrollView
        headerImage={
          <Image
            source={{ uri: getTmdbUri(showDetails?.backdrop_path) ?? '' }}
            style={{ width: '100%', height: '100%' }}
          />
        }
      >
        <Text>{showDetails?.name}</Text>
        <Text>{showDetails?.overview}</Text>
        {favoriteEpisodes?.map((episode) => (
          <Text key={episode.id}>
            S{episode.seasonNumber}E{episode.episodeNumber}: {episode.name}
          </Text>
        ))}
      </ParallaxScrollView>
    </Screen>
  );
}
