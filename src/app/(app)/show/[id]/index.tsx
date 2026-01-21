import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { Dimensions, StyleSheet } from 'react-native';
import {
  MaterialTabBar,
  MaterialTabItem,
  type TabBarProps,
  Tabs,
} from 'react-native-collapsible-tab-view';

import { colors, Image, Screen, Text, View } from '@/components';
import { getTvShowDetails } from '@/lib/api';
import { FIRESTORE_COLLECTIONS, getFavoriteEpisodes } from '@/lib/firebase';
import { useAuth } from '@/lib/hooks';
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

  const Header = () => (
    <View style={[styles.header, { backgroundColor: colors.black }]}>
      <Image
        source={{ uri: getTmdbUri(showDetails?.backdrop_path) ?? '' }}
        style={{ width: '100%', height: 200 }}
      />
      <Text>{showDetails?.name}</Text>
      <Text>{showDetails?.overview}</Text>
    </View>
  );

  const TabBar = (props: TabBarProps) => (
    <MaterialTabBar
      {...props}
      scrollEnabled={false}
      contentContainerStyle={{ backgroundColor: colors.black }}
      labelStyle={[styles.labelStyle]}
      indicatorStyle={{ backgroundColor: colors.primary[600] }}
      activeColor={colors.white}
      inactiveColor={colors.neutral[500]}
      // remove auto uppercase
      getLabelText={(name) => name}
      TabItemComponent={(itemProps) => {
        return (
          <MaterialTabItem
            {...itemProps}
            labelStyle={[
              styles.labelStyle,
              {
                width: Dimensions.get('window').width / 3,
              },
            ]}
          />
        );
      }}
    />
  );

  return (
    <Screen>
      <Tabs.Container renderHeader={Header} renderTabBar={TabBar}>
        <Tabs.Tab name="Episodes">
          <Tabs.ScrollView>
            {favoriteEpisodes?.map((episode) => (
              <Text key={episode.id}>
                S{episode.seasonNumber}E{episode.episodeNumber}: {episode.name}
              </Text>
            ))}
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="My Episodes">
          <Tabs.ScrollView>
            <View style={[styles.box, styles.boxA]} />
            <View style={[styles.box, styles.boxB]} />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="More Like This">
          <Tabs.ScrollView>
            {favoriteEpisodes?.map((episode) => (
              <Text key={episode.id}>
                S{episode.seasonNumber}E{episode.episodeNumber}: {episode.name}
              </Text>
            ))}
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 250,
    width: '100%',
  },
  boxA: {
    backgroundColor: 'white',
  },
  boxB: {
    backgroundColor: '#D8D8D8',
  },
  header: {
    width: '100%',
  },
  labelStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
    margin: 0,
    paddingVertical: 16,
    textAlign: 'center',
  },
});
