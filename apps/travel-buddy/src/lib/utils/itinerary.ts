import { type Address } from '@base-app/core';
import { addDays } from 'date-fns/addDays';
import { differenceInMinutes } from 'date-fns/differenceInMinutes';
import { format } from 'date-fns/format';
import { isValid } from 'date-fns/isValid';
import { parseISO } from 'date-fns/parseISO';
import { startOfDay } from 'date-fns/startOfDay';

import type { ItineraryCategory, PlaceType } from '@/lib/static-data';
import type {
  Activity,
  Entertainment,
  Flight,
  Food,
  Lodging,
  Shopping,
  Transport,
} from '@/lib/types/plans';

export type ItinerarySourceType =
  | 'flight'
  | 'lodging'
  | 'transport'
  | PlaceType;

export type ItineraryItem = {
  address?: Address;
  category: ItineraryCategory;
  end?: string;
  /** Unique per item; a lodging produces separate check-in and check-out items. */
  id: string;
  notes?: string;
  sourceId: string;
  sourceType: ItinerarySourceType;
  start: string;
  subtitle?: string;
  title: string;
};

export type ItinerarySources = {
  activities?: Activity[];
  entertainment?: Entertainment[];
  flights?: Flight[];
  food?: Food[];
  lodging?: Lodging[];
  shopping?: Shopping[];
  transports?: Transport[];
};

export type ItineraryDay = {
  /** yyyy-MM-dd */
  date: string;
  items: ItineraryItem[];
};

export const parseDateTime = (value?: string) => {
  if (!value) return undefined;
  const date = parseISO(value);
  return isValid(date) ? date : undefined;
};

export const toDayKey = (date: Date) => format(date, 'yyyy-MM-dd');

const placeCategory: Record<PlaceType, ItineraryCategory> = {
  activity: 'activity',
  entertainment: 'entertainment',
  food: 'food',
  shopping: 'shopping',
};

const placesToItems = (
  places: Activity[] | undefined,
  sourceType: PlaceType
): ItineraryItem[] =>
  (places ?? [])
    .filter((place) => place.status !== 'idea' && parseDateTime(place.datetime))
    .map((place) => ({
      address: place.address,
      category: placeCategory[sourceType],
      end: place.endDatetime || undefined,
      id: `${sourceType}-${place.id}`,
      notes: place.notes || undefined,
      sourceId: place.id,
      sourceType,
      start: place.datetime as string,
      title: place.name,
    }));

/**
 * Flattens every plan type for one trip into a single, time-sorted list.
 * Plans without a usable start time are left out.
 */
export const buildItinerary = (
  sources: ItinerarySources,
  tripId: string
): ItineraryItem[] => {
  const forTrip = <T extends { tripId?: string }>(docs?: T[]) =>
    (docs ?? []).filter((doc) => doc.tripId === tripId);

  const flights = forTrip(sources.flights)
    .filter((flight) => parseDateTime(flight.departure.datetime))
    .map<ItineraryItem>((flight) => ({
      category: 'arrival-departure',
      end: flight.arrival.datetime || undefined,
      id: `flight-${flight.id}`,
      notes: flight.notes || undefined,
      sourceId: flight.id,
      sourceType: 'flight',
      start: flight.departure.datetime,
      subtitle: [flight.airline, flight.flightNumber].filter(Boolean).join(' '),
      title: `Flight from ${flight.departure.airportCode} to ${flight.arrival.airportCode}`,
    }));

  const lodging = forTrip(sources.lodging).flatMap<ItineraryItem>((stay) => {
    const items: ItineraryItem[] = [];
    if (parseDateTime(stay.checkInDatetime)) {
      items.push({
        address: stay.address,
        category: 'check-in-out',
        id: `lodging-${stay.id}-check-in`,
        sourceId: stay.id,
        sourceType: 'lodging',
        start: stay.checkInDatetime as string,
        subtitle: stay.name,
        title: 'Check In',
      });
    }
    if (parseDateTime(stay.checkOutDatetime)) {
      items.push({
        address: stay.address,
        category: 'check-in-out',
        id: `lodging-${stay.id}-check-out`,
        sourceId: stay.id,
        sourceType: 'lodging',
        start: stay.checkOutDatetime as string,
        subtitle: stay.name,
        title: 'Check Out',
      });
    }
    return items;
  });

  const transports = forTrip(sources.transports)
    .filter((transport) => parseDateTime(transport.departureDatetime))
    .map<ItineraryItem>((transport) => ({
      address: transport.pickupLocation,
      category: 'commute',
      end: transport.arrivalDatetime || undefined,
      id: `transport-${transport.id}`,
      notes: transport.notes || undefined,
      sourceId: transport.id,
      sourceType: 'transport',
      start: transport.departureDatetime as string,
      title: transport.name,
    }));

  return [
    ...flights,
    ...lodging,
    ...transports,
    ...placesToItems(forTrip(sources.activities), 'activity'),
    ...placesToItems(forTrip(sources.entertainment), 'entertainment'),
    ...placesToItems(forTrip(sources.food), 'food'),
    ...placesToItems(forTrip(sources.shopping), 'shopping'),
  ].sort(compareItems);
};

const compareItems = (a: ItineraryItem, b: ItineraryItem) => {
  const diff =
    (parseDateTime(a.start)?.getTime() ?? 0) -
    (parseDateTime(b.start)?.getTime() ?? 0);
  return diff !== 0 ? diff : a.title.localeCompare(b.title);
};

/**
 * Groups items by the day they start. Every day of the trip is included, even
 * empty ones, plus any day outside the trip range that has items (e.g. a
 * red-eye the night before).
 */
export const groupItineraryByDay = (
  items: ItineraryItem[],
  tripStartDate: string,
  tripEndDate: string
): ItineraryDay[] => {
  const days = new Map<string, ItineraryItem[]>();
  const start = parseDateTime(tripStartDate);
  const end = parseDateTime(tripEndDate);

  if (start && end && end >= start) {
    for (let day = startOfDay(start); day <= end; day = addDays(day, 1)) {
      days.set(toDayKey(day), []);
    }
  }

  items.forEach((item) => {
    const itemStart = parseDateTime(item.start);
    if (!itemStart) return;
    const key = toDayKey(itemStart);
    days.set(key, [...(days.get(key) ?? []), item]);
  });

  return [...days.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayItems]) => ({ date, items: dayItems.sort(compareItems) }));
};

export const formatTime = (value?: string) => {
  const date = parseDateTime(value);
  return date ? format(date, 'h:mm a') : '';
};

export const formatTimeRange = (item: ItineraryItem) => {
  const start = parseDateTime(item.start);
  const end = parseDateTime(item.end);
  if (!start) return '';
  if (!end) return format(start, 'h:mm a');
  const endLabel =
    toDayKey(end) === toDayKey(start)
      ? format(end, 'h:mm a')
      : format(end, 'h:mm a (EEE)');
  return `${format(start, 'h:mm a')} – ${endLabel}`;
};

export const formatDayHeading = (dayKey: string) => {
  const date = parseDateTime(dayKey);
  return date ? format(date, 'EEEE, MMM d') : dayKey;
};

export const formatAddress = (address?: Address) =>
  address
    ? [address.street1, address.city, address.state].filter(Boolean).join(', ')
    : '';

/** Full single-line address, suitable for a maps search. */
export const formatFullAddress = (address?: Address) =>
  address
    ? [
        address.street1,
        address.street2,
        address.city,
        [address.state, address.postalCode].filter(Boolean).join(' '),
        address.country,
      ]
        .filter(Boolean)
        .join(', ')
    : '';

// ---------------------------------------------------------------------------
// Time grid layout
// ---------------------------------------------------------------------------

/** Items with no end time are drawn as this many minutes. */
const DEFAULT_DURATION_MINUTES = 60;

export type GridBlock = {
  column: number;
  columns: number;
  /** Minutes from the start of the day. */
  endMinutes: number;
  item: ItineraryItem;
  startMinutes: number;
};

export type DayGridLayout = {
  blocks: GridBlock[];
  /** Visible window, in minutes from midnight of the day (may exceed 24h). */
  windowEnd: number;
  windowStart: number;
};

/**
 * Positions a day's items on a time grid. Overlapping items share the row
 * width, like calendar apps. The window defaults to 7 AM–11 PM (the sheet's
 * range) and stretches to fit earlier or later items, up to 2 AM next day.
 */
export const layoutDayGrid = (day: ItineraryDay): DayGridLayout => {
  const dayStart = parseDateTime(day.date);
  if (!dayStart) return { blocks: [], windowEnd: 23 * 60, windowStart: 7 * 60 };

  const ranges = day.items
    .map((item) => {
      const start = parseDateTime(item.start);
      if (!start) return undefined;
      const end = parseDateTime(item.end);
      const startMinutes = differenceInMinutes(start, dayStart);
      const endMinutes =
        end && end > start
          ? differenceInMinutes(end, dayStart)
          : startMinutes + DEFAULT_DURATION_MINUTES;
      return { endMinutes: Math.min(endMinutes, 26 * 60), item, startMinutes };
    })
    .filter((range) => range !== undefined)
    .sort((a, b) => a.startMinutes - b.startMinutes);

  const blocks: GridBlock[] = [];
  let cluster: GridBlock[] = [];
  let clusterEnd = -Infinity;

  const flushCluster = () => {
    const columns = Math.max(...cluster.map((block) => block.column + 1), 1);
    cluster.forEach((block) => blocks.push({ ...block, columns }));
    cluster = [];
  };

  ranges.forEach((range) => {
    if (range.startMinutes >= clusterEnd && cluster.length) flushCluster();
    // First column whose last block has already ended.
    const used = new Set(
      cluster
        .filter((block) => block.endMinutes > range.startMinutes)
        .map((block) => block.column)
    );
    let column = 0;
    while (used.has(column)) column += 1;
    cluster.push({ ...range, column, columns: 1 });
    clusterEnd = Math.max(clusterEnd, range.endMinutes);
  });
  if (cluster.length) flushCluster();

  const earliest = Math.min(...ranges.map((range) => range.startMinutes));
  const latest = Math.max(...ranges.map((range) => range.endMinutes));
  const windowStart = Math.max(
    0,
    Math.min(7 * 60, Math.floor(earliest / 60) * 60)
  );
  const windowEnd = Math.min(
    26 * 60,
    Math.max(23 * 60, Math.ceil(latest / 60) * 60)
  );

  return { blocks, windowEnd, windowStart };
};
