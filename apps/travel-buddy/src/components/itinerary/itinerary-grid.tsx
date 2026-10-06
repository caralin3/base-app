import { Text, View } from '@base-app/ui';
import { format } from 'date-fns/format';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';

import { itineraryCategories } from '@/lib/static-data';
import {
  formatTimeRange,
  type ItineraryDay,
  type ItineraryItem,
  layoutDayGrid,
  parseDateTime,
} from '@/lib/utils';

const HOUR_HEIGHT = 64;
const GUTTER_WIDTH = 56;

type ItineraryGridProps = {
  days: ItineraryDay[];
  onPressItem?: (item: ItineraryItem) => void;
};

const hourLabel = (minutes: number) => {
  const hour = Math.floor(minutes / 60) % 24;
  const suffix = hour < 12 ? 'AM' : 'PM';
  return `${hour % 12 === 0 ? 12 : hour % 12} ${suffix}`;
};

/** Single-day calendar grid, like the Itinerary tab of the trip sheet. */
export const ItineraryGrid = ({ days, onPressItem }: ItineraryGridProps) => {
  const [selectedDate, setSelectedDate] = useState(days[0]?.date);
  const day = days.find((d) => d.date === selectedDate) ?? days[0];
  const layout = useMemo(() => (day ? layoutDayGrid(day) : undefined), [day]);
  const [gridWidth, setGridWidth] = useState(0);

  if (!day || !layout) return null;

  const hours: number[] = [];
  for (let m = layout.windowStart; m < layout.windowEnd; m += 60) hours.push(m);
  const toY = (minutes: number) =>
    ((minutes - layout.windowStart) / 60) * HOUR_HEIGHT;
  const columnWidth = Math.max(gridWidth - GUTTER_WIDTH, 0);

  return (
    <View className="gap-4">
      <ScrollView
        contentContainerClassName="gap-2"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {days.map((d) => {
          const date = parseDateTime(d.date);
          const selected = d.date === day.date;
          return (
            <Pressable
              key={d.date}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              className={`min-w-14 items-center rounded-sm px-3 py-2 ${
                selected
                  ? 'bg-primary-strong dark:bg-primary-strong-dark'
                  : 'bg-background dark:bg-background-dark'
              }`}
              onPress={() => setSelectedDate(d.date)}
            >
              <Text
                className={`text-xs font-semibold ${
                  selected
                    ? 'text-on-primary dark:text-on-primary-dark'
                    : 'text-muted dark:text-muted-dark'
                }`}
              >
                {date ? format(date, 'EEE') : ''}
              </Text>
              <Text
                className={`text-lg font-bold ${
                  selected ? 'text-on-primary dark:text-on-primary-dark' : ''
                }`}
              >
                {date ? format(date, 'd') : ''}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View
        onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
        style={{ height: toY(layout.windowEnd) }}
      >
        {hours.map((minutes) => (
          <View
            key={minutes}
            className="absolute inset-x-0 flex-row"
            style={{ top: toY(minutes) }}
          >
            <Text
              className="text-xs text-muted dark:text-muted-dark"
              style={{ marginTop: -7, width: GUTTER_WIDTH }}
            >
              {hourLabel(minutes)}
            </Text>
            <View className="h-px flex-1 bg-border dark:bg-border-dark" />
          </View>
        ))}

        {layout.blocks.map((block) => {
          const category = itineraryCategories[block.item.category];
          const width = columnWidth / block.columns;
          const height = Math.max(
            toY(block.endMinutes) - toY(block.startMinutes) - 2,
            24
          );
          return (
            <Pressable
              key={block.item.id}
              accessibilityHint={onPressItem ? 'Edit this plan' : undefined}
              accessibilityRole="button"
              accessibilityLabel={`${block.item.title}, ${formatTimeRange(block.item)}`}
              className="absolute overflow-hidden rounded-sm px-2 py-1"
              disabled={!onPressItem}
              onPress={() => onPressItem?.(block.item)}
              style={{
                backgroundColor: `${category.color}33`,
                borderLeftColor: category.color,
                borderLeftWidth: 3,
                height,
                left: GUTTER_WIDTH + block.column * width,
                top: toY(block.startMinutes) + 1,
                width: width - 2,
              }}
            >
              <Text className="text-xs font-semibold" numberOfLines={2}>
                {block.item.title}
              </Text>
              {height > 40 && (
                <Text
                  className="text-xs text-muted dark:text-muted-dark"
                  numberOfLines={1}
                >
                  {formatTimeRange(block.item)}
                </Text>
              )}
            </Pressable>
          );
        })}

        {!layout.blocks.length && (
          <View
            className="absolute items-center"
            style={{ left: GUTTER_WIDTH, right: 0, top: toY(12 * 60) }}
          >
            <Text className="text-sm text-muted dark:text-muted-dark">
              Nothing planned
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
