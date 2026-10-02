import { isFuture, isPast, parseISO } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import { FloatingAddPlanModal, Screen, Text, TripCard } from '@/components';
import { useAuth, useTripsQuery } from '@/lib/hooks';
import { getCountdownDays } from '@/lib/utils/dates';
import { useAppColors } from '@/theme/use-app-colors';

export default function Home() {
  const colors = useAppColors();
  const userId = useAuth.use.user()?.id;

  const {
    refetch: refetchTrips,
    data: tripsData,
    isRefetching,
  } = useTripsQuery(userId);

  const currentTrips = useMemo(
    () =>
      tripsData?.filter(
        (trip) =>
          isPast(parseISO(trip.startDate)) &&
          getCountdownDays(parseISO(trip.endDate)) > 0
      ) ?? [],
    [tripsData]
  );

  const upcomingTrips = useMemo(
    () => tripsData?.filter((trip) => isFuture(parseISO(trip.startDate))) ?? [],
    [tripsData]
  );

  const pastTrips = useMemo(
    () => tripsData?.filter((trip) => isPast(parseISO(trip.startDate))) ?? [],
    [tripsData]
  );

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
          contentContainerClassName="p-4 gap-8"
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
          }
        >
          {currentTrips.length > 0 ? (
            <View>
              <Text className="mb-4" size="xl" weight="bold">
                Current Trips
              </Text>
              {currentTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </View>
          ) : null}
          {upcomingTrips.length > 0 ? (
            <View>
              <Text className="mb-4" size="xl" weight="bold">
                Upcoming Trips
              </Text>
              {upcomingTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </View>
          ) : null}
          {pastTrips.length > 0 ? (
            <View>
              <Text className="mb-4" size="lg" weight="bold">
                Past Trips
              </Text>
              {pastTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </View>
          ) : null}
        </ScrollView>
        <FloatingAddPlanModal title="Add Plan" />
      </View>
    </Screen>
  );
}
