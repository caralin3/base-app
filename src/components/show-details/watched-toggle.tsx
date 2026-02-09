import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import {
  addWatchedShow,
  deleteWatchedShow,
  FIRESTORE_COLLECTIONS,
  type WatchedShowDocument,
} from '@/lib/firebase';

import { colors, IconSymbol, Pressable, Text, View } from '../ui';

interface WatchedToggleProps {
  showId: number;
  userId: string;
  watchedShow: WatchedShowDocument | null;
}

export const WatchedToggle = ({
  showId,
  userId,
  watchedShow,
}: WatchedToggleProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    if (!!watchedShow) {
      await deleteWatchedShow(watchedShow.documentId);
    } else {
      await addWatchedShow({
        showId,
        userId,
      });
    }
    await queryClient.invalidateQueries({
      queryKey: [
        FIRESTORE_COLLECTIONS.WATCHED_SHOWS,
        userId,
        showId.toString(),
      ],
    });
    setLoading(false);
  };

  return (
    <Pressable className="pb-3 pt-4" disabled={loading} onPress={handleToggle}>
      <View className="flex-row items-center gap-2 rounded-md bg-charcoal-400 p-4">
        <IconSymbol
          name={!!watchedShow ? 'checkmark.circle.fill' : 'checkmark.circle'}
          color={colors.primary[600]}
        />
        <Text
          className="leading-7 text-primary-600"
          transform={!!watchedShow ? undefined : 'uppercase'}
        >
          {!!watchedShow ? 'Watched' : 'Mark as watched'}
        </Text>
      </View>
    </Pressable>
  );
};
