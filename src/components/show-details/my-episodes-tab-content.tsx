import { useState } from 'react';
import { type RefreshControlProps } from 'react-native';

import { type Episode, type Show } from '@/lib/types';

import { EpisodesBySeasonList } from '../episodes';
import { Text, View } from '../ui';

interface MyEpisodesTabContentProps {
  episodes: Episode[];
  onFavoriteEpisode: (episode: Episode) => void;
  refreshControl?:
    | React.ReactElement<
        RefreshControlProps,
        string | React.JSXElementConstructor<any>
      >
    | undefined;
  show: Show;
}

export const MyEpisodesTabContent = ({
  episodes,
  onFavoriteEpisode,
  refreshControl,
  show,
}: MyEpisodesTabContentProps) => {
  const [activeView, setActiveView] = useState<'simple' | 'expanded'>('simple');

  return (
    <EpisodesBySeasonList
      inTabPanel
      episodes={episodes}
      // episodes={seasonNumber === 0 ? allEpisodes : episodesBySeason}
      ListEmptyComponent={
        <View className="flex-1 px-4 py-8">
          <Text className="text-white" align="center">
            You don&apos;t have any favorite episodes for this season yet.
          </Text>
          <Text className="text-white" align="center">
            Try selecting a different season and add some by tapping the heart
            icon on an episode.
          </Text>
        </View>
      }
      // ListHeaderComponent={flatListHeaderComponent}
      onFavorite={onFavoriteEpisode}
      posterPath={show.posterPath}
      itemType={activeView}
      refreshControl={refreshControl}
    />
  );
};
