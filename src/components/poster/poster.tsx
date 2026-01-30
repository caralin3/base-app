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
  onPress?: () => void;
  onWatch?: () => void;
  uri: string | null;
}

export const Poster = ({
  firstAirDate,
  horizontal = false,
  href,
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
        <Link href={href} style={styles.flex} onPress={onPress}>
          <View style={styles.imageLink}>
            <PosterImage
              horizontal
              alt={alt}
              uri={uri}
              style={styles.horizontalImage}
            />
            <View style={styles.flex}>
              <Text size="base" weight="bold" style={styles.name}>
                {name}
              </Text>
              {!!startYear && <Text>{startYear}</Text>}
              {!!numberOfSeasons && <Text>{numberOfSeasons} seasons</Text>}
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
            />
          )}
          {!!onFavorite && (
            <IconButton
              iconName={isFavorite ? 'heart.fill' : 'heart'}
              color={colors.primary[600]}
              onPress={() => {
                onFavorite();
              }}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  flex: {
    flex: 1,
  },
  imageLink: {
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: 'center',
    gap: 8,
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
