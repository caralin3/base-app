import { type IconSymbolName, type OptionType } from '@base-app/ui';

/** The four place collections that can be ideas or scheduled plans. */
export type PlaceType = 'activity' | 'entertainment' | 'food' | 'shopping';

export const placeTypeOptions: (OptionType & { value: PlaceType })[] = [
  { label: 'Activity', value: 'activity' },
  { label: 'Food', value: 'food' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Shopping', value: 'shopping' },
];

export type ItineraryCategory =
  | 'activity'
  | 'arrival-departure'
  | 'check-in-out'
  | 'commute'
  | 'entertainment'
  | 'food'
  | 'shopping';

type CategoryConfig = {
  /** Mid-tone hex that reads on both light and dark backgrounds. */
  color: string;
  icon: IconSymbolName;
  label: string;
};

export const itineraryCategories: Record<ItineraryCategory, CategoryConfig> = {
  activity: { color: '#22C55E', icon: 'figure.walk', label: 'Activity' },
  'arrival-departure': {
    color: '#3B82F6',
    icon: 'airplane',
    label: 'Arrival/Departure',
  },
  'check-in-out': {
    color: '#A855F7',
    icon: 'bed.double.fill',
    label: 'Check In/Out',
  },
  commute: { color: '#64748B', icon: 'car.fill', label: 'Commute' },
  entertainment: { color: '#EC4899', icon: 'sparkles', label: 'Entertainment' },
  food: { color: '#F59E0B', icon: 'fork.knife', label: 'Food' },
  shopping: { color: '#14B8A6', icon: 'bag.fill', label: 'Shopping' },
};
