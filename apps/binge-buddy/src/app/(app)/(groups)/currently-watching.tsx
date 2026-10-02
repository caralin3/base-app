import { useCallback, useState } from 'react';
import { RefreshControl } from 'react-native-gesture-handler';

import { colors, Screen, Text, View } from '@/components';
import { PosterList } from '@/components/poster/poster-list';
import { useCurrentlyWatching } from '@/lib/hooks';

export default function CurrentlyWatching() {
  const { currentlyWatchingShows, refetch, isRefetching } =
    useCurrentlyWatching();
  const [editMode, setEditMode] = useState(false);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleEdit = () => {
    setEditMode((prev) => !prev);
  };

  return (
    <Screen
      headerProps={{
        bgColor: editMode ? colors.danger[600] : undefined,
        title: editMode ? 'Edit Currently Watching' : 'Currently Watching',
        left: !editMode
          ? undefined
          : {
              icon: {
                name: 'xmark',
                type: 'material',
                color: 'white',
              },
              onPress: () => setEditMode(false),
            },
        right: editMode
          ? undefined
          : [
              {
                icon: {
                  name: 'pencil',
                  type: 'material',
                  color: 'white',
                },
                onPress: handleEdit,
              },
            ],
      }}
    >
      <View className="flex-1 p-4">
        <PosterList
          canToggle
          editMode={editMode}
          list="currentlyWatching"
          data={currentlyWatchingShows ?? []}
          horizontal={false}
          horizontalItem
          isLoading={isRefetching}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View className="flex-1 px-4 py-8">
              <Text className="text-white" align="center">
                You don&apos;t have any shows in your currently watching yet.
              </Text>
              <Text className="text-white" align="center">
                Browse shows and tap the eye icon to add them here!
              </Text>
            </View>
          }
        />
      </View>
    </Screen>
  );
}
