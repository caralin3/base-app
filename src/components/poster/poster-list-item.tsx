import { useMemo } from 'react';

import { useShowToggles } from '@/lib/hooks';
import { type CurrentlyWatchingShow, type FavoriteShow } from '@/lib/store';

import { Poster } from './poster';

interface PosterListItemProps {
  canToggle?: boolean;
  item: CurrentlyWatchingShow | FavoriteShow;
  horizontalItem?: boolean;
  list?: 'favorites' | 'currentlyWatching' | 'watchlist';
  onPress?: (showId: number) => void;
}

export const PosterListItem = ({
  canToggle = false,
  item,
  horizontalItem,
  list,
  onPress,
}: PosterListItemProps) => {
  const {
    toggleFavoriteShow,
    toggleCurrentlyWatchingShow,
    toggleWatchlistShow,
    favoriteShow,
    currentlyWatchingShow,
    watchlistShow,
  } = useShowToggles(item.id.toString());

  // Use current values from stores instead of stale item prop
  const isFavorite = useMemo(
    () => favoriteShow?.id === item.id,
    [favoriteShow, item.id]
  );
  const isCurrentlyWatching = useMemo(
    () => currentlyWatchingShow?.id === item.id,
    [currentlyWatchingShow, item.id]
  );
  const isInWatchlist = useMemo(
    () => watchlistShow?.id === item.id,
    [watchlistShow, item.id]
  );

  const canToggleFavorite = useMemo(
    () => canToggle && list !== 'favorites',

    [canToggle, list]
  );
  const canToggleCurrentlyWatching = useMemo(
    () => canToggle && list !== 'currentlyWatching',
    [canToggle, list]
  );
  const canToggleWatchlist = useMemo(
    () => canToggle && list !== 'watchlist',
    [canToggle, list]
  );

  return (
    <Poster
      {...item}
      isFavorite={isFavorite}
      isCurrentlyWatching={isCurrentlyWatching}
      isInWatchlist={isInWatchlist}
      horizontal={horizontalItem}
      onFavorite={
        canToggleFavorite ? () => toggleFavoriteShow(item) : undefined
      }
      onPress={onPress}
      onCurrentlyWatching={
        canToggleCurrentlyWatching
          ? () => toggleCurrentlyWatchingShow(item)
          : undefined
      }
      onSaveToWatchlist={
        canToggleWatchlist ? () => toggleWatchlistShow(item) : undefined
      }
    />
  );
};
