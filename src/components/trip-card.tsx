import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { Link } from 'expo-router';
import { useMemo } from 'react';

import { type Trip } from '@/lib/types/trips';
import { getCountdownDays } from '@/lib/utils';

import { Pressable, Text, View } from './ui';

interface TripCardProps {
  trip: Trip;
}

export const TripCard = ({ trip }: TripCardProps) => {
  const days = useMemo(
    () => getCountdownDays(new Date(trip.startDate)),
    [trip.startDate]
  );

  return (
    <Link
      href={{
        pathname: '/trip/[id]',
        params: {
          id: trip.id,
          name: trip.name,
        },
      }}
      asChild
    >
      <Pressable>
        <View
          key={trip.id}
          className="mb-4 rounded-lg bg-surface p-4 shadow dark:bg-surface-dark"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl">{trip.name}</Text>
              {!!trip.destination && <Text>{trip.destination}</Text>}
              <Text>
                {format(parseISO(trip.startDate), 'MM/dd/yy')} -{' '}
                {format(parseISO(trip.endDate), 'MM/dd/yy')}
              </Text>
            </View>
            <View className="items-center justify-center">
              {days > 0 ? (
                <>
                  <Text className="text-2xl font-bold">{days}</Text>
                  <Text className="font-semibold">
                    day{days !== 1 ? 's' : ''} to go
                  </Text>
                </>
              ) : null}
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};
