import { useMemo } from 'react';

import { buildItinerary } from '@/lib/utils/itinerary';

import {
  useActivitiesQuery,
  useEntertainmentQuery,
  useFlightsQuery,
  useFoodsQuery,
  useLodgingsQuery,
  useShoppingQuery,
  useTransportsQuery,
} from './use-firestore-collection-hooks';

const forTrip = <T extends { tripId?: string }>(
  docs: T[] | undefined,
  tripId?: string
) => (tripId ? (docs ?? []).filter((doc) => doc.tripId === tripId) : []);

/**
 * Every plan linked to a trip. Filters the shared per-collection queries
 * (rather than scoped queries) so optimistic updates show up immediately.
 */
export const useTripPlans = (userId?: string, tripId?: string) => {
  const activities = useActivitiesQuery(userId);
  const entertainment = useEntertainmentQuery(userId);
  const flights = useFlightsQuery(userId);
  const food = useFoodsQuery(userId);
  const lodging = useLodgingsQuery(userId);
  const shopping = useShoppingQuery(userId);
  const transports = useTransportsQuery(userId);

  const queries = [
    activities,
    entertainment,
    flights,
    food,
    lodging,
    shopping,
    transports,
  ];
  const isLoading = queries.some((query) => query.isLoading);

  const plans = useMemo(
    () => ({
      activities: forTrip(activities.data, tripId),
      entertainment: forTrip(entertainment.data, tripId),
      flights: forTrip(flights.data, tripId),
      food: forTrip(food.data, tripId),
      lodging: forTrip(lodging.data, tripId),
      shopping: forTrip(shopping.data, tripId),
      transports: forTrip(transports.data, tripId),
    }),
    [
      activities.data,
      entertainment.data,
      flights.data,
      food.data,
      lodging.data,
      shopping.data,
      transports.data,
      tripId,
    ]
  );

  return { isLoading, plans };
};

export const useTripItinerary = (userId?: string, tripId?: string) => {
  const { isLoading, plans } = useTripPlans(userId, tripId);
  const items = useMemo(
    () => (tripId ? buildItinerary(plans, tripId) : []),
    [plans, tripId]
  );

  return { isLoading, items, plans };
};
