import { format } from 'date-fns';
import { Link, type LinkProps } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { colors, IconButton, Text, View } from '../ui';
import { PosterImage } from './poster-image';

export interface PosterProps {
  firstAirDate?: string | null;
  horizontal?: boolean;
  href: LinkProps['href'];
  id: number;
  isFavorite: boolean;
  isWatching?: boolean;
  name: string;
  numberOfSeasons?: number;
  onFavorite?: () => void;
  onPress?: (showId: number) => void;
  onWatch?: () => void;
  uri: string | null;
}

export const Poster = ({
  firstAirDate,
  horizontal = false,
  href,
  id,
  isFavorite,
  isWatching,
  name,
  numberOfSeasons,
  onFavorite,
  onPress,
  onWatch,
  uri,
}: PosterProps) => {
  const startYear = useMemo(
    () => (firstAirDate ? format(new Date(firstAirDate), 'yyyy') : null),
    [firstAirDate]
  );
  const alt = useMemo(
    () => `${name} ${startYear ? `(${startYear})` : ''}`,
    [name, startYear]
  );

  if (horizontal) {
    return (
      <View style={styles.container}>
        <Link href={href} style={styles.flex} onPress={() => onPress?.(id)}>
          <View style={styles.imageLink}>
            <PosterImage
              horizontal
              alt={alt}
              uri={uri}
              style={styles.horizontalImage}
            />
            <View style={styles.flex}>
              <Text size="xl" weight="bold" style={styles.name}>
                {name}
              </Text>
              {!!startYear && <Text>{startYear}</Text>}
              {!!numberOfSeasons && (
                <Text>
                  {numberOfSeasons} season{numberOfSeasons > 1 ? 's' : ''}
                </Text>
              )}
            </View>
          </View>
        </Link>
        <View style={styles.buttonContainer}>
          {!!onWatch && (
            <IconButton
              iconName={isWatching ? 'eye.fill' : 'eye'}
              iconType="community"
              color={colors.primary[600]}
              onPress={onWatch}
              size={28}
            />
          )}
          {!!onFavorite && (
            <IconButton
              iconName={isFavorite ? 'heart.fill' : 'heart'}
              color={colors.primary[600]}
              onPress={onFavorite}
              size={28}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.verticalContainer}>
      <Link href={href}>
        <PosterImage alt={alt} uri={uri} style={styles.verticalImage} />
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  flex: {
    flex: 1,
    gap: 4,
  },
  imageLink: {
    flexDirection: 'row',
    gap: 16,
  },
  horizontalImage: {
    height: 140,
    width: 92,
  },
  name: {
    flexWrap: 'wrap',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  verticalContainer: {
    flex: 1,
    paddingRight: 10,
  },
  verticalImage: {
    height: 175,
    width: 115,
    borderRadius: 6,
  },
});
