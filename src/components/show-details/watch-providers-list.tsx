import {
  BottomSheetFlatList,
  type BottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback } from 'react';

import {
  type WatchProvider,
  type WatchProvidersByShowResponse,
} from '@/lib/api/tmdb/types';

import { colors, Modal, Pressable, Text, View } from '../ui';

interface WatchProvidersListProps {
  onSelect: (option: WatchProvider) => void;
  providers?: NonNullable<WatchProvidersByShowResponse['results']>[string];
}

interface OptionType {
  label: string;
  value: (WatchProvider & { description?: string })[];
}

export const WatchProvidersList = forwardRef<
  BottomSheetModal,
  WatchProvidersListProps
>(({ onSelect, providers }, ref) => {
  const data: OptionType[] = [
    {
      label: 'Streaming',
      value: [
        ...(providers?.flatrate ?? []),
        ...(providers?.ads?.map((ad) => ({ ...ad, description: 'Ads' })) ?? []),
      ],
    },
    {
      label: 'Buy/Rent',
      value: [...(providers?.buy ?? []), ...(providers?.rent ?? [])],
    },
  ];

  const renderSelectItem = useCallback(
    ({ item }: { item: OptionType }) => {
      if (item.value.length === 0) {
        return null;
      }

      return (
        <View className="gap-2 py-2">
          <Text
            bg-black
            size="xl"
            weight="bold"
            className="bg-black p-4 text-primary-600"
          >
            {item.label}
          </Text>
          {item.value.map((provider, index) => (
            <React.Fragment key={`select-item-${provider.provider_id}`}>
              <Pressable
                onPress={() => onSelect(provider)}
                className="flex-row items-center justify-between px-4 py-2"
              >
                <Text size="lg" weight="semibold">
                  {provider.provider_name}
                  {!!provider.description && (
                    <Text size="sm">&nbsp;({provider.description})</Text>
                  )}
                </Text>
                {/* TODO: Add link to provider */}
                {/* <IconSymbol
                  name="square.and.arrow.up"
                  size={20}
                  color={colors.white}
                /> */}
              </Pressable>
              {index < item.value.length - 1 && (
                <View className="h-px bg-charcoal-300" />
              )}
            </React.Fragment>
          ))}
        </View>
      );
    },
    [onSelect]
  );

  return (
    <Modal
      ref={ref}
      index={0}
      backgroundStyle={{
        backgroundColor: colors.charcoal[400],
      }}
      title="Watch Options"
    >
      <BottomSheetFlatList
        data={data}
        keyExtractor={(item: OptionType) => `select-item-${item.label}`}
        renderItem={renderSelectItem}
        estimatedItemSize={52}
      />
    </Modal>
  );
});
