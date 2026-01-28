import { type RefreshControlProps } from 'react-native';

import { type Episode, type Show } from '@/lib/types';

import { EpisodesBySeasonList } from '../episodes';
import { Text, View } from '../ui';

interface EpisodesTabContentProps {
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

export const EpisodesTabContent = ({
  episodes,
  onFavoriteEpisode,
  refreshControl,
  show,
}: EpisodesTabContentProps) => {
  return (
    <EpisodesBySeasonList
      inTabPanel
      episodes={episodes}
      // episodes={seasonNumber === 0 ? allEpisodes : episodesBySeason}
      ListEmptyComponent={
        <View className="flex-1 px-4 py-8">
          <Text className="text-white" align="center">
            There are no episodes for this season yet.
          </Text>
        </View>
      }
      // ListHeaderComponent={flatListHeaderComponent}
      onFavorite={onFavoriteEpisode}
      posterPath={show.posterPath}
      itemType="expanded"
      refreshControl={refreshControl}
    />
  );
};
