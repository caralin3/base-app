import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

import { Screen, ScrollView, Text } from '@/components';
import { useAuth } from '@/lib';
import { getTvShowDetails } from '@/lib/api';
import { FIRESTORE_COLLECTIONS, getFavoriteEpisodes } from '@/lib/firebase';
import { type ShowRouteParams } from '@/lib/types';

export default function Show() {
  const userId = useAuth().user?.id ?? '';
  const local = useLocalSearchParams<ShowRouteParams>();
  const showId = local.id;
  console.log('ShowId:', showId);
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
      <ScrollView contentContainerClassName="p-4">
        <Text>{showDetails?.name}</Text>
        <Text>{showDetails?.overview}</Text>
        {favoriteEpisodes?.map((episode) => (
          <Text key={episode.id}>
            S{episode.seasonNumber}E{episode.episodeNumber}: {episode.name}
          </Text>
        ))}
      </ScrollView>
    </Screen>
  );
}
