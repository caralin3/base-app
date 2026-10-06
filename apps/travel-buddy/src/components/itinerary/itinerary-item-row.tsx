import { IconSymbol, Text, useAppColors, View } from '@base-app/ui';
import { useState } from 'react';
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
};

export const ItineraryItemRow = ({ item }: ItineraryItemRowProps) => {
  const appColors = useAppColors();
  const [expanded, setExpanded] = useState(false);
  const category = itineraryCategories[item.category];
  const address = formatAddress(item.address);
  const fullAddress = formatFullAddress(item.address);
  const hasDetails = Boolean(item.notes || fullAddress);

  return (
    <Pressable
      accessibilityHint={hasDetails ? 'Shows notes and address' : undefined}
      accessibilityRole="button"
      className="flex-row overflow-hidden rounded-xl bg-background dark:bg-background-dark"
      disabled={!hasDetails}
      onPress={() => setExpanded((value) => !value)}
    >
      <View style={{ backgroundColor: category.color, width: 4 }} />
      <View className="flex-1 gap-1 p-3">
        <View className="flex-row items-center gap-2">
          <IconSymbol color={category.color} name={category.icon} size={16} />
          <Text className="text-sm font-semibold text-muted dark:text-muted-dark">
            {formatTimeRange(item)}
          </Text>
        </View>
        <Text className="text-base font-semibold">{item.title}</Text>
        {!!item.subtitle && (
          <Text className="text-sm text-muted dark:text-muted-dark">
            {item.subtitle}
          </Text>
        )}
        {!expanded && !!address && (
          <Text
            className="text-sm text-muted dark:text-muted-dark"
            numberOfLines={1}
          >
            {address}
          </Text>
        )}
        {expanded && (
          <View className="mt-1 gap-2">
            {!!item.notes && <Text className="text-sm">{item.notes}</Text>}
            {!!fullAddress && (
              <Pressable
                accessibilityRole="link"
                className="flex-row items-center gap-1"
                onPress={() => openInMaps(fullAddress)}
              >
                <IconSymbol
                  color={appColors.primary}
                  name="mappin.and.ellipse"
                  size={16}
                />
                <Text className="flex-1 text-sm text-primary dark:text-primary-dark">
                  {fullAddress}
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};
