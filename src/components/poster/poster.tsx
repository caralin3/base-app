import { format } from 'date-fns';
import { Link, type LinkProps } from 'expo-router';
import { useState } from 'react';

import { IconButton, Text, View } from '../ui';
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
  const [hearted, setHearted] = useState(isFavorite);

  const startYear = firstAirDate ? format(firstAirDate, 'yyyy') : null;
  const alt = `${name} ${startYear ? `(${startYear})` : ''}`;

  if (horizontal) {
    return (
      <View className="flex-1 flex-row items-center justify-between gap-2">
        <Link href={href} className="flex-1" onPress={onPress}>
          <View className="flex-row items-center gap-4">
            <PosterImage
              horizontal
              alt={alt}
              uri={uri}
              className="rounded-md"
              style={{ height: 140, width: 92 }}
            />
            <View className="flex-1">
              <Text size="base" weight="bold" className="flex-wrap break-words">
                {name}
              </Text>
              {!!startYear && <Text>{startYear}</Text>}
              {!!numberOfSeasons && <Text>{numberOfSeasons} seasons</Text>}
            </View>
          </View>
        </Link>
        <View className="flex-row items-center gap-2">
          {!!onWatch && (
            <IconButton
              iconName={isWatching ? 'eye.fill' : 'eye'}
              iconType="community"
              onPress={onWatch}
            />
          )}
          {!!onFavorite && (
            <IconButton
              iconName={hearted ? 'heart.fill' : 'heart'}
              onPress={() => {
                onFavorite();
                setHearted(!hearted);
              }}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 pr-2.5">
      <Link href={href}>
        <PosterImage
          alt={alt}
          uri={uri}
          className="rounded-md"
          style={{ height: 175, width: 115 }}
        />
      </Link>
    </View>
  );
};
