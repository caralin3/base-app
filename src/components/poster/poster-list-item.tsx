import { useShowToggles } from '@/lib/hooks';
import { type CurrentlyWatchingShow, type FavoriteShow } from '@/lib/store';

import { Poster } from './poster';

interface PosterListItemProps {
  canToggle?: boolean;
  item: CurrentlyWatchingShow | FavoriteShow;
  horizontalItem?: boolean;
  onPress?: (showId: number) => void;
}

export const PosterListItem = ({
  canToggle = false,
  item,
  horizontalItem,
  onPress,
}: PosterListItemProps) => {
  const {
    toggleFavoriteShow,
    toggleCurrentlyWatchingShow,
    favoriteShow,
    currentlyWatchingShow,
  } = useShowToggles(item.id.toString());

  // Use current values from stores instead of stale item prop
  const isFavorite = favoriteShow?.id === item.id;
  const isWatching = currentlyWatchingShow?.id === item.id;

  return (
    <Poster
      {...item}
      isFavorite={isFavorite}
      isWatching={isWatching}
      horizontal={horizontalItem}
      onFavorite={canToggle ? () => toggleFavoriteShow(item) : undefined}
      onPress={onPress}
      onWatch={canToggle ? () => toggleCurrentlyWatchingShow(item) : undefined}
    />
  );
};
