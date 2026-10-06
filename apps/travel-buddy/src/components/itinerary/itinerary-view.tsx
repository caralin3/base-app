import { getItem, setItem } from '@base-app/core';
import { IconSymbol, Text, useAppColors, View } from '@base-app/ui';
import { useEffect, useMemo, useState } from 'react';
import { Pressable } from 'react-native';

import { itineraryCategories, type ItineraryCategory } from '@/lib/static-data';
import type { Trip } from '@/lib/types/trips';
import { groupItineraryByDay, type ItineraryItem } from '@/lib/utils';

import { ItineraryAgenda } from './itinerary-agenda';
import { ItineraryGrid } from './itinerary-grid';

type ViewMode = 'agenda' | 'grid';
const VIEW_MODE_KEY = 'travel-buddy.itinerary-view-mode';

type ItineraryViewProps = {
  isLoading?: boolean;
  items: ItineraryItem[];
  onPressItem?: (item: ItineraryItem) => void;
  trip: Pick<Trip, 'endDate' | 'startDate'>;
};

export const ItineraryView = ({
  isLoading = false,
  items,
  onPressItem,
  trip,
}: ItineraryViewProps) => {
  const appColors = useAppColors();
  const [mode, setMode] = useState<ViewMode>('agenda');
  const days = useMemo(
    () => groupItineraryByDay(items, trip.startDate, trip.endDate),
    [items, trip.endDate, trip.startDate]
  );
  const usedCategories = useMemo(
    () =>
      [
        ...new Set(items.map((item) => item.category)),
      ].sort() as ItineraryCategory[],
    [items]
  );

  useEffect(() => {
    getItem<ViewMode>(VIEW_MODE_KEY)
      .then((saved) => saved && setMode(saved))
      .catch(() => undefined);
  }, []);

  const changeMode = (next: ViewMode) => {
    setMode(next);
    setItem(VIEW_MODE_KEY, next).catch(() => undefined);
  };

  const modes: {
    icon: 'list.bullet' | 'square.grid.2x2';
    label: string;
    value: ViewMode;
  }[] = [
    { icon: 'list.bullet', label: 'Agenda', value: 'agenda' },
    { icon: 'square.grid.2x2', label: 'Grid', value: 'grid' },
  ];

  return (
    <View className="gap-4">
      <View className="flex-row rounded-xl bg-background p-1 dark:bg-background-dark">
        {modes.map((option) => {
          const selected = option.value === mode;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              className={`flex-1 flex-row items-center justify-center gap-2 rounded-lg py-2 ${
                selected ? 'bg-surface dark:bg-surface-dark' : ''
              }`}
              onPress={() => changeMode(option.value)}
            >
              <IconSymbol
                color={selected ? appColors.primary : appColors.muted}
                name={option.icon}
                size={18}
              />
              <Text
                className={`text-sm font-semibold ${
                  selected ? '' : 'text-muted dark:text-muted-dark'
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {usedCategories.length > 0 && (
        <View className="flex-row flex-wrap gap-x-4 gap-y-2">
          {usedCategories.map((category) => (
            <View key={category} className="flex-row items-center gap-1">
              <View
                className="size-2.5 rounded-full"
                style={{ backgroundColor: itineraryCategories[category].color }}
              />
              <Text className="text-xs text-muted dark:text-muted-dark">
                {itineraryCategories[category].label}
              </Text>
            </View>
          ))}
        </View>
      )}

      {isLoading ? (
        <Text className="text-muted dark:text-muted-dark">
          Loading itinerary...
        </Text>
      ) : !items.length ? (
        <Text className="text-muted dark:text-muted-dark">
          Nothing scheduled yet. Add flights, lodging, or plans with a time and
          they will show up here.
        </Text>
      ) : null}

      {!isLoading &&
        (mode === 'agenda' ? (
          <ItineraryAgenda days={days} onPressItem={onPressItem} />
        ) : (
          <ItineraryGrid days={days} onPressItem={onPressItem} />
        ))}
    </View>
  );
};
