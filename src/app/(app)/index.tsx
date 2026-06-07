import { useCallback } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import { FloatingAddPlanModal, Screen, TripCard } from '@/components';
import { useAuth, useTripsQuery } from '@/lib/hooks';
import { useAppColors } from '@/theme/use-app-colors';

export default function Home() {
  const colors = useAppColors();
  const userId = useAuth.use.user()?.id;

  const {
    refetch: refetchTrips,
    data: tripsData,
    isRefetching,
  } = useTripsQuery(userId);

  const onRefresh = useCallback(() => {
    refetchTrips();
  }, [refetchTrips]);

  return (
    <Screen
      headerProps={{
        brand: true,
        title: 'App Home',
        showBackButton: false,
        titleColor: colors.primary,
      }}
    >
      <View className="relative flex-1 gap-4 px-5 py-4">
        <ScrollView
          contentContainerClassName="p-4"
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
        >
          {tripsData?.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </ScrollView>
        <FloatingAddPlanModal title="Add Plan" />
      </View>
    </Screen>
  );
}
