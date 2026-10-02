import { useCallback, useMemo } from 'react';

import {
  type WatchProvider,
  type WatchProvidersByShowResponse,
} from '@/lib/api/tmdb/types';
import { useSelectedProvidersStore } from '@/lib/store';
import { getTmdbUri } from '@/lib/utils/helper';

import { Image, Text, useModal, View } from '../ui';
import { WatchProvidersList } from './watch-providers-list';

interface WatchProvidersProps {
  providers?: NonNullable<WatchProvidersByShowResponse['results']>[string];
}

export const WatchProviders = ({ providers }: WatchProvidersProps) => {
  const modal = useModal();
  const { selectedProviders } = useSelectedProvidersStore();

  const selectedProviderIds = useMemo(
    () => new Set(selectedProviders.map((provider) => provider.provider_id)),
    [selectedProviders]
  );

  const sortSelectedFirst = useCallback(
    (a: WatchProvider, b: WatchProvider) => {
      const aIsSelected = selectedProviderIds.has(a.provider_id);
      const bIsSelected = selectedProviderIds.has(b.provider_id);

      if (aIsSelected !== bIsSelected) {
        return aIsSelected ? -1 : 1;
      }

      return a.display_priority - b.display_priority;
    },
    [selectedProviderIds]
  );

  const uniqueByProviderId = useCallback((items: WatchProvider[]) => {
    const seenProviderIds = new Set<number>();

    return items.filter((provider) => {
      if (seenProviderIds.has(provider.provider_id)) {
        return false;
      }

      seenProviderIds.add(provider.provider_id);
      return true;
    });
  }, []);

  const streamingProviders = useMemo(() => {
    const flatrate = providers?.flatrate ?? [];
    const ads = providers?.ads ?? [];

    return uniqueByProviderId([...flatrate, ...ads])
      .sort(sortSelectedFirst)
      .slice(0, 5);
  }, [providers, sortSelectedFirst, uniqueByProviderId]);

  const purchaseProviders = useMemo(() => {
    const rent = providers?.rent ?? [];
    const buy = providers?.buy ?? [];

    return uniqueByProviderId([...rent, ...buy])
      .sort(sortSelectedFirst)
      .slice(0, 5);
  }, [providers, sortSelectedFirst, uniqueByProviderId]);

  const showViewMore =
    streamingProviders.length > 5 || purchaseProviders.length > 0;

  if (streamingProviders.length === 0 && purchaseProviders.length === 0) {
    return (
      <View className="mt-4 flex-row items-center">
        <Text className="mr-2" weight="bold">
          Stream on:
        </Text>
        <Text>No providers available</Text>
      </View>
    );
  }

  return (
    <View className="gap-2">
      <View className="mt-4 flex-row flex-wrap items-center gap-3">
        <Text weight="bold">
          {streamingProviders?.length > 0 ? 'Stream on:' : 'Buy/Rent:'}
        </Text>
        {streamingProviders?.map((provider) => (
          <Image
            key={provider.provider_id}
            source={{ uri: getTmdbUri(provider.logo_path) ?? '' }}
            className="size-10 rounded-lg"
          />
        ))}
        {!streamingProviders?.length
          ? purchaseProviders?.map((provider) => (
              <Image
                key={provider.provider_id}
                source={{ uri: getTmdbUri(provider.logo_path) ?? '' }}
                className="size-10 rounded-lg"
              />
            ))
          : null}
        <Text
          className="text-sm leading-8 color-primary-600"
          transform="uppercase"
          onPress={modal.present}
        >
          {showViewMore ? 'View more providers' : 'View provider details'}
        </Text>
      </View>
      <WatchProvidersList
        providers={providers}
        ref={modal.ref}
        onSelect={modal.dismiss}
        selectedProviderIds={selectedProviderIds}
      />
    </View>
  );
};
