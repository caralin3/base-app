import { useMemo, useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';

import {
  CheckboxIcon,
  colors,
  IconPopupMenu,
  IconSymbol,
  Image,
  Pressable,
  Screen,
  SearchInput,
  Text,
  View,
} from '@/components';
import { useTvProvidersQuery } from '@/lib/hooks';
import { toggleSelectedProvider, useSelectedProvidersStore } from '@/lib/store';
import { getTmdbUri } from '@/lib/utils/helper';

export default function Providers() {
  const { data: tvProviders } = useTvProvidersQuery();
  const { selectedProviders } = useSelectedProvidersStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const filteredProviders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return tvProviders ?? [];
    }

    return (tvProviders ?? []).filter((provider) =>
      provider.provider_name.toLowerCase().includes(normalizedSearch)
    );
  }, [searchTerm, tvProviders]);

  const selectedProviderIds = useMemo(
    () => new Set(selectedProviders.map((provider) => provider.provider_id)),
    [selectedProviders]
  );

  const visibleProviders = useMemo(() => {
    if (!showSelectedOnly) {
      return filteredProviders;
    }

    return filteredProviders.filter((provider) =>
      selectedProviderIds.has(provider.provider_id)
    );
  }, [filteredProviders, selectedProviderIds, showSelectedOnly]);

  const isAllVisibleSelected =
    visibleProviders.length > 0 &&
    visibleProviders.every((provider) =>
      selectedProviderIds.has(provider.provider_id)
    );

  if (tvProviders == null || tvProviders?.length === 0) {
    return (
      <Screen headerProps={{ title: 'Streaming Services' }}>
        <View className="p-4">
          <Text size="2xl" weight="bold" align="center">
            No providers found
          </Text>
        </View>
      </Screen>
    );
  }

  const handlePress = () => {
    if (visibleProviders.length === 0) {
      return;
    }

    if (isAllVisibleSelected) {
      visibleProviders.forEach((provider) => {
        toggleSelectedProvider(provider);
      });
      return;
    }

    visibleProviders.forEach((provider) => {
      if (!selectedProviderIds.has(provider.provider_id)) {
        toggleSelectedProvider(provider);
      }
    });
  };

  return (
    <Screen headerProps={{ title: 'Streaming Services' }}>
      <View className="flex-1 p-4">
        <View className="gap-4">
          <View className="gap-4 pb-4">
            <Text size="xl" weight="semibold">
              Your streaming services
            </Text>
            <FlatList
              data={selectedProviders}
              keyExtractor={(item) => item.provider_id.toString()}
              contentContainerStyle={{ paddingRight: 8, paddingTop: 8 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => toggleSelectedProvider(item)}
                  className="relative"
                >
                  <Image
                    source={{ uri: getTmdbUri(item.logo_path) ?? '' }}
                    className="size-14 rounded-lg border border-charcoal-400"
                  />
                  <View className="absolute -right-2 -top-2 size-4 items-center justify-center rounded-full bg-danger-600">
                    <IconSymbol name="xmark" color="white" size={8} />
                  </View>
                </Pressable>
              )}
              horizontal
              ItemSeparatorComponent={() => <View className="w-4" />}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={
                <Text>No services selected yet. Tap below to add them.</Text>
              }
            />
          </View>
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <SearchInput
                autoFocus={false}
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search for providers"
              />
            </View>
            <IconPopupMenu
              iconName="line.3.horizontal.decrease.circle"
              iconType="community"
              triggerSize={28}
              triggerColor={showSelectedOnly ? colors.primary[600] : undefined}
              menuWidth={175}
              items={[
                {
                  iconName: !showSelectedOnly ? 'checkmark' : undefined,
                  label: 'Show all providers',
                  onPress: () => setShowSelectedOnly(false),
                },
                {
                  iconName: showSelectedOnly ? 'checkmark' : undefined,
                  label: 'Show selected only',
                  onPress: () => setShowSelectedOnly(true),
                },
              ]}
            />
          </View>
        </View>
        <View className="mt-2 flex-row items-center justify-between rounded-lg border-b border-charcoal-400 bg-charcoal-400 p-4">
          <View className="gap-1">
            <Text size="2xl" weight="bold">
              Select your services
            </Text>
            <Text>
              {!showSelectedOnly && `${filteredProviders.length} Services,`}{' '}
              {selectedProviders.length}
              {selectedProviders.length === 1 ? ' selected' : ' selected'}
            </Text>
          </View>
          <Pressable onPress={handlePress}>
            <CheckboxIcon checked={isAllVisibleSelected} checkAll={true} />
          </Pressable>
        </View>
        <FlatList
          className="flex-1"
          data={visibleProviders}
          keyExtractor={(item) => item.provider_id.toString()}
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View className="px-4 py-8">
              <Text size="lg" align="center">
                {showSelectedOnly
                  ? 'No selected providers match your current search.'
                  : `No providers match "${searchTerm.trim()}".`}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isSelected = selectedProviders.some(
              (p) => p.provider_id === item.provider_id
            );
            return (
              <Pressable onPress={() => toggleSelectedProvider(item)}>
                <View className="flex-row items-center justify-between px-4 py-3">
                  <View className="flex-1 flex-row items-center gap-4 pr-3">
                    <Image
                      source={{ uri: getTmdbUri(item.logo_path) ?? '' }}
                      className="size-14 rounded-lg"
                    />
                    <Text size="lg" weight="semibold" className="flex-1">
                      {item.provider_name}
                    </Text>
                  </View>
                  <CheckboxIcon checked={isSelected} />
                </View>
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => (
            <View className="h-0.5 bg-charcoal-400" />
          )}
        />
      </View>
    </Screen>
  );
}
