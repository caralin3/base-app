import { formatDate, parseISO } from 'date-fns';
import { StyleSheet } from 'react-native';

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
  if (type === 'simple') {
    return (
      <View style={styles.container}>
        <Collapsible
          title={`S${episode.seasonNumber} E${episode.episodeNumber} - ${episode.name}`}
          rightAction={
            <IconButton
              iconName={episode.isFavorite ? 'heart.fill' : 'heart'}
              color={colors.primary[600]}
              onPress={() => {
                onFavorite(episode);
              }}
            />
          }
        >
          <View style={styles.rowBetween}>
            {episode.runtime > 0 && (
              <Text style={styles.info}>{episode.runtime} min</Text>
            )}
            <Text style={styles.info}>
              {formatDate(parseISO(episode.airDate), DATE_FORMAT)}
            </Text>
          </View>
          {!!episode.overview && (
            <Text clipText style={styles.info}>
              {episode.overview}
            </Text>
          )}
        </Collapsible>
      </View>
    );
  }

  const imagePath = episode.stillPath || posterPath;

  return (
    <View style={styles.container}>
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          {!!imagePath && (
            <Image
              source={{ uri: getTmdbImageUrl(imagePath) }}
              style={styles.image}
            />
          )}
          <View style={styles.flex}>
            <Text style={styles.name}>
              {episode.episodeNumber}. {episode.name}
            </Text>
            {episode.runtime > 0 && (
              <Text style={styles.info}>{episode.runtime} min</Text>
            )}
          </View>
        </View>
        <View>
          <IconButton
            iconName={episode.isFavorite ? 'heart.fill' : 'heart'}
            color={colors.primary[600]}
            onPress={() => {
              onFavorite(episode);
            }}
          />
        </View>
      </View>
      {!!episode.overview && (
        <Text clipText style={styles.info}>
          {episode.overview}
        </Text>
      )}
      <View style={styles.rowEnd}>
        <Text style={styles.info}>
          Air Date: {formatDate(parseISO(episode.airDate), DATE_FORMAT)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 4,
    paddingTop: 16,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  rowEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  flex: {
    flex: 1,
  },
  image: {
    height: 75,
    width: 125,
    borderRadius: 6,
    objectFit: 'cover',
  },
  name: {
    flexWrap: 'wrap',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  info: {
    fontSize: 14,
  },
});
