import { Pressable } from 'react-native';

import { IconSymbol, colors, Text, View } from '../ui';

export type PlanType =
  | 'activity'
  | 'entertainment'
  | 'flight'
  | 'food'
  | 'lodging'
  | 'shopping'
  | 'todo'
  | 'transport'
  | 'trip';

type PlanMenuItem = {
  description: string;
  icon: Parameters<typeof IconSymbol>[0]['name'];
  label: string;
  value: PlanType;
};

const menuItems: PlanMenuItem[] = [
  {
    description: 'Plan a getaway or long trip.',
    icon: 'suitcase',
    label: 'Trip',
    value: 'trip',
  },
  {
    description: 'Book a flight or connection.',
    icon: 'airplane',
    label: 'Flight',
    value: 'flight',
  },
  {
    description: 'Track hotels, rentals, and stays.',
    icon: 'bed.double.fill',
    label: 'Lodging',
    value: 'lodging',
  },
  {
    description: 'Save a ride, shuttle, or transfer.',
    icon: 'car.fill',
    label: 'Transport',
    value: 'transport',
  },
  {
    description: 'Add a place to eat.',
    icon: 'fork.knife',
    label: 'Food',
    value: 'food',
  },
  {
    description: 'Add a show, event, or attraction.',
    icon: 'sparkles',
    label: 'Entertainment',
    value: 'entertainment',
  },
  {
    description: 'Keep a purchase or store visit.',
    icon: 'bag.fill',
    label: 'Shopping',
    value: 'shopping',
  },
  {
    description: 'Record a walk, tour, or outing.',
    icon: 'figure.walk',
    label: 'Activity',
    value: 'activity',
  },
  {
    description: 'Capture a follow-up task.',
    icon: 'checklist',
    label: 'Todo',
    value: 'todo',
  },
];

type AddPlanMenuProps = {
  onSelect: (value: PlanType) => void;
};

export const AddPlanMenu = ({ onSelect }: AddPlanMenuProps) => {
  return (
    <View className="gap-4">
      {menuItems.map((item) => (
        <Pressable
          key={item.value}
          className="flex-row items-center gap-4 rounded-2xl border border-border bg-background p-4 dark:border-border-dark dark:bg-surface-dark"
          onPress={() => onSelect(item.value)}
        >
          <IconSymbol color={colors.primary[500]} name={item.icon} size={24} />
          <View className="flex-1 gap-1">
            <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
              {item.label}
            </Text>
            <Text className="text-sm text-muted dark:text-muted-dark">
              {item.description}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};
