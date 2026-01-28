import { formatDate, parseISO } from 'date-fns';
import { useState } from 'react';

import { getTmdbImageUrl } from '@/lib/api/tmdb/endpoints';
import { type Episode } from '@/lib/types';

import { Collapsible, colors, IconButton, Image, Text, View } from '../ui';

interface EpisodeItemProps {
  episode: Episode;
  onFavorite: (episode: Episode) => void;
  posterPath?: string | null;
  type?: 'simple' | 'expanded';
}

export const DATE_FORMAT = 'MM/dd/yyyy';

export const EpisodeItem = ({
  episode,
  onFavorite,
  posterPath,
  type = 'expanded',
}: EpisodeItemProps) => {
  const [hearted, setHearted] = useState(episode.isFavorite);

  if (type === 'simple') {
    return (
      <View className="flex-1 gap-1 pt-4">
        <Collapsible
          title={`S${episode.seasonNumber} E${episode.episodeNumber} - ${episode.name}`}
          rightAction={
            <IconButton
              iconName={hearted ? 'heart.fill' : 'heart'}
              color={colors.primary[600]}
              onPress={() => {
                onFavorite(episode);
                setHearted(!hearted);
              }}
            />
          }
        >
          <View className="flex-row items-start justify-between gap-4">
            {episode.runtime > 0 && (
              <Text className="text-sm">{episode.runtime} min</Text>
            )}
            <Text className="text-sm">
              Air Date: {formatDate(parseISO(episode.airDate), DATE_FORMAT)}
            </Text>
          </View>
          {!!episode.overview && (
            <Text className="text-sm">{episode.overview}</Text>
          )}
        </Collapsible>
      </View>
    );
  }

  const imagePath = episode.stillPath || posterPath;

  return (
    <View className="flex-1 gap-1 pt-4">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 flex-row items-start gap-2">
          {!!imagePath && (
            <Image
              source={{ uri: getTmdbImageUrl(imagePath) }}
              className="h-[75px] w-[125px] rounded-md object-cover"
            />
          )}
          <View className="flex-1">
            <Text className="flex-wrap text-base font-bold capitalize">
              {episode.episodeNumber}. {episode.name}
            </Text>
            {episode.runtime > 0 && (
              <Text className="text-sm">{episode.runtime} min</Text>
            )}
          </View>
        </View>
        <View>
          <IconButton
            iconName={hearted ? 'heart.fill' : 'heart'}
            color={colors.primary[600]}
            onPress={() => {
              onFavorite(episode);
              setHearted(!hearted);
            }}
          />
        </View>
      </View>
      {!!episode.overview && (
        <Text className="text-sm">{episode.overview}</Text>
      )}
      <View className="flex-row justify-end">
        <Text className="text-sm">
          Air Date: {formatDate(parseISO(episode.airDate), DATE_FORMAT)}
        </Text>
      </View>
    </View>
  );
};
