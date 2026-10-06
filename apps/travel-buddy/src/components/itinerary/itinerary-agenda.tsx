import { Text, View } from '@base-app/ui';

import { formatDayHeading, type ItineraryDay } from '@/lib/utils';

import { ItineraryItemRow } from './itinerary-item-row';

type ItineraryAgendaProps = {
  days: ItineraryDay[];
};

export const ItineraryAgenda = ({ days }: ItineraryAgendaProps) => (
  <View className="gap-6">
    {days.map((day) => (
      <View key={day.date} className="gap-2">
        <Text className="text-lg font-bold">{formatDayHeading(day.date)}</Text>
        {day.items.length ? (
          day.items.map((item) => (
            <ItineraryItemRow key={item.id} item={item} />
          ))
        ) : (
          <Text className="text-sm text-muted dark:text-muted-dark">
            Nothing planned
          </Text>
        )}
      </View>
    ))}
  </View>
);
