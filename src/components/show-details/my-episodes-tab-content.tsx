import { useState } from 'react';
import { type RefreshControlProps } from 'react-native';

import { type Episode, type Show, type ShowSeason } from '@/lib/types';

import { EpisodesBySeasonList } from '../episodes';
import { Text, View } from '../ui';
import { EpisodeTabHeader } from './episode-tab-header';

interface MyEpisodesTabContentProps {
  episodes: Episode[];
  isLoading?: boolean;
  onFavoriteEpisode: (episode: Episode) => void;
  refreshControl?:
    | React.ReactElement<
        RefreshControlProps,
        string | React.JSXElementConstructor<any>
      >
    | undefined;
  seasons: ShowSeason[];
  seasonNumber: number;
  setSeasonNumber: (value: string | number) => void;
  show: Show;
}

export const MyEpisodesTabContent = ({
  episodes,
  isLoading,
  onFavoriteEpisode,
  refreshControl,
  show,
  ...props
}: MyEpisodesTabContentProps) => {
  const [activeView, setActiveView] = useState<'simple' | 'expanded'>('simple');

  const episodesBySeason = episodes.filter(
    (episode) => episode.seasonNumber === props.seasonNumber
  );
  const allEpisodesSorted = episodes.sort((a, b) => {
    if (a.seasonNumber !== b.seasonNumber) {
      return a.seasonNumber - b.seasonNumber;
    }
    return a.episodeNumber - b.episodeNumber;
  });

  return (
    <EpisodesBySeasonList
      inTabPanel
      episodes={props.seasonNumber === 0 ? allEpisodesSorted : episodesBySeason}
      isLoading={isLoading}
      ListEmptyComponent={
        isLoading ? undefined : (
          <View className="flex-1 px-4 py-8">
            <Text className="text-white" align="center">
              You don&apos;t have any favorite episodes for this season yet.
            </Text>
            <Text className="text-white" align="center">
              Try selecting a different season and add some by tapping the heart
              icon on an episode.
            </Text>
          </View>
        )
      }
      ListHeaderComponent={
        <EpisodeTabHeader {...props} showAll showEpisodeCount={false} />
      }
      onFavorite={onFavoriteEpisode}
      backdropPath={show.backdropPath}
      itemType={activeView}
      refreshControl={refreshControl}
    />
  );
};
