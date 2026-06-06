import { View } from 'react-native';

import { Button, Screen, Text } from '@/components';
import {
  useActivitiesQuery,
  useAddActivityMutation,
  useAuth,
} from '@/lib/hooks';
import { useAppColors } from '@/theme/use-app-colors';

export default function Home() {
  const colors = useAppColors();
  const userId = useAuth.use.user()?.id;
  const activitiesQuery = useActivitiesQuery(userId);
  const addActivityMutation = useAddActivityMutation(userId);
  const isAddingActivity =
    addActivityMutation.isPending && !addActivityMutation.isPaused;

  const handleAddSampleActivity = async () => {
    if (!userId) {
      return;
    }

    await addActivityMutation.mutateAsync({
      createdAt: new Date().toISOString(),
      name: `Sample activity ${(activitiesQuery.data?.length ?? 0) + 1}`,
      updatedAt: new Date().toISOString(),
      userId,
    });
  };

  const activities = activitiesQuery.data ?? [];

  return (
    <Screen
      headerProps={{
        brand: true,
        title: 'App Home',
        showBackButton: false,
        titleColor: colors.primary,
      }}
    >
      <View className="flex-1 gap-4 px-5 py-4">
        <View className="gap-2">
          <Text size="2xl" weight="bold">
            Firestore proof of concept
          </Text>
          <Text variant="muted">
            Activities are read from React Query cache and can be created from
            this screen.
          </Text>
        </View>

        <View className="rounded-2xl border border-border bg-white p-4 dark:border-border-dark dark:bg-neutral-900">
          <Text weight="semibold">Activities</Text>
          <Text variant="muted" className="mt-1">
            {activitiesQuery.isLoading
              ? 'Loading cached Firestore data...'
              : `${activities.length} item${activities.length === 1 ? '' : 's'} loaded`}
          </Text>

          <View className="mt-4 gap-3">
            {activities.slice(0, 3).map((activity) => (
              <View
                key={activity.id}
                className="rounded-xl bg-neutral-100 px-4 py-3 dark:bg-neutral-800"
              >
                <Text weight="semibold">{activity.name}</Text>
                <Text variant="muted" size="sm">
                  {activity.id}
                </Text>
              </View>
            ))}

            {activities.length === 0 && !activitiesQuery.isLoading ? (
              <Text variant="muted">No activities yet. Add one below.</Text>
            ) : null}
          </View>
        </View>

        <Button
          label={
            addActivityMutation.isPaused
              ? 'Queued while offline'
              : isAddingActivity
                ? 'Adding activity...'
                : 'Add sample activity'
          }
          onPress={handleAddSampleActivity}
          loading={isAddingActivity}
          disabled={!userId || addActivityMutation.isPending}
        />

        {!userId ? (
          <Text variant="muted">
            Sign in first to try the Firestore write flow.
          </Text>
        ) : null}
      </View>
    </Screen>
  );
}
