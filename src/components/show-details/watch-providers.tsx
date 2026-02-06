import { useMemo } from 'react';

import { type WatchProvidersResponse } from '@/lib/api/tmdb/types';
import { getTmdbUri } from '@/lib/utils/helper';

import { Image, Text, useModal, View } from '../ui';
import { WatchProvidersList } from './watch-providers-list';

interface WatchProvidersProps {
  providers?: NonNullable<WatchProvidersResponse['results']>[string];
}

export const WatchProviders = ({ providers }: WatchProvidersProps) => {
  const modal = useModal();

  const streamingProviders = useMemo(() => {
    const flatrate = providers?.flatrate ?? [];
    const ads = providers?.ads ?? [];
    return [...flatrate, ...ads]
      .sort((a, b) => a.display_priority - b.display_priority)
      .slice(0, 5);
  }, [providers]);

  const purchaseProviders = useMemo(() => {
    const rent = providers?.rent ?? [];
    const buy = providers?.buy ?? [];
    return [...rent, ...buy]
      .sort((a, b) => a.display_priority - b.display_priority)
      .slice(0, 5);
  }, [providers]);

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
        <Text weight="bold">Stream on:</Text>
        {streamingProviders?.map((provider) => (
          <Image
            key={provider.provider_id}
            source={{ uri: getTmdbUri(provider.logo_path) ?? '' }}
            className="size-10 rounded-sm"
          />
        ))}
        {!streamingProviders?.length
          ? purchaseProviders?.map((provider) => (
              <Image
                key={provider.provider_id}
                source={{ uri: getTmdbUri(provider.logo_path) ?? '' }}
                className="size-10 rounded-sm"
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
      />
    </View>
  );
};
