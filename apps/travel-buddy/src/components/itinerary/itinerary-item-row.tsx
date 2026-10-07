import { IconSymbol, Text, useAppColors, View } from '@base-app/ui';
import { Pressable } from 'react-native';

import { itineraryCategories } from '@/lib/static-data';
import {
  formatAddress,
  formatFullAddress,
  formatTimeRange,
  type ItineraryItem,
  openInMaps,
} from '@/lib/utils';

type ItineraryItemRowProps = {
  item: ItineraryItem;
  onPress?: (item: ItineraryItem) => void;
};

export const ItineraryItemRow = ({ item, onPress }: ItineraryItemRowProps) => {
  const appColors = useAppColors();
  const category = itineraryCategories[item.category];
  const address = formatAddress(item.address);
  const fullAddress = formatFullAddress(item.address);

  return (
    <Pressable
      accessibilityHint={onPress ? 'Edit this plan' : undefined}
      accessibilityRole="button"
      className="flex-row overflow-hidden rounded-lg bg-background dark:bg-background-dark"
      disabled={!onPress}
      onPress={() => onPress?.(item)}
    >
      <View style={{ backgroundColor: category.color, width: 4 }} />
      <View className="flex-1 gap-1 p-3">
        <View className="flex-row items-center gap-2">
          <IconSymbol color={category.color} name={category.icon} size={16} />
          <Text className="flex-1 text-sm font-semibold text-muted dark:text-muted-dark">
            {formatTimeRange(item)}
          </Text>
          {onPress && (
            <IconSymbol color={appColors.muted} name="pencil" size={14} />
          )}
        </View>
        <Text className="text-base font-semibold">{item.title}</Text>
        {!!item.subtitle && (
          <Text className="text-sm text-muted dark:text-muted-dark">
            {item.subtitle}
          </Text>
        )}
        {!!item.notes && (
          <Text className="text-sm" numberOfLines={2}>
            {item.notes}
          </Text>
        )}
        {!!address && (
          <Pressable
            accessibilityLabel={`Open ${fullAddress} in Maps`}
            accessibilityRole="link"
            className="flex-row items-center gap-1 self-start"
            hitSlop={4}
            onPress={() => openInMaps(fullAddress)}
          >
            <IconSymbol
              color={appColors.primary}
              name="mappin.and.ellipse"
              size={14}
            />
            <Text
              className="text-sm text-primary-strong dark:text-primary-strong-dark"
              numberOfLines={1}
            >
              {address}
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};
