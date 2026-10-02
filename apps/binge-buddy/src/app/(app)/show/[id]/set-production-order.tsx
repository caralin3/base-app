import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

import {
  colors,
  EpisodeItem,
  IconPopupMenu,
  IconSymbol,
  Screen,
  Skeleton,
  TouchableOpacity,
  View,
} from '@/components';
import { SeasonSelect } from '@/components/show-details/season-select';
import {
  addProductionOrder,
  deleteProductionOrder,
  FIRESTORE_COLLECTIONS,
  updateProductionOrder,
} from '@/lib/firebase';
import {
  useAuth,
  useProductionOrderByShowIdQuery,
  useSeasonEpisodesQuery,
  useShowDetailsQuery,
} from '@/lib/hooks';
import {
  addProductionOrderToStore,
  removeProductionOrderFromStore,
  updateProductionOrderInStore,
} from '@/lib/store';
import { type Episode, type ShowRouteParams } from '@/lib/types';

export default function SetProductionOrder() {
  const local = useLocalSearchParams<ShowRouteParams>();
  const showId = local.id;
  const [editMode, setEditMode] = useState(true);
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const originalEpisodeIds = useRef<number[]>([]);
  const userId = useAuth().user?.id ?? '';
  const queryClient = useQueryClient();

  const { data: showDetailsData, isLoading: isLoadingShowDetails } =
    useShowDetailsQuery(showId);
  const { ...showDetails } = showDetailsData;
  const {
    getEpisodes,
    seasonQuery: { data: season, isLoading: isLoadingSeason },
  } = useSeasonEpisodesQuery(showId, seasonNumber);
  const { data: productionOrder, isLoading: isLoadingProductionOrder } =
    useProductionOrderByShowIdQuery(showId);

  const options = useMemo(() => {
    const showSeasons =
      showDetails?.seasons
        ?.filter((season) => season.seasonNumber > 0)
        ?.map((season) => ({
          label: `Season ${season.seasonNumber}`,
          value: season.seasonNumber,
        })) ?? [];
    return showSeasons;
  }, [showDetails?.seasons]);

  // Reorder episodes based on saved production order
  useEffect(() => {
    if (!season?.episodes) {
      setEpisodes([]);
      originalEpisodeIds.current = [];
      return;
    }
    const baseEpisodes = getEpisodes(season.episodes);
    if (!productionOrder) {
      setEpisodes(baseEpisodes);
      originalEpisodeIds.current = baseEpisodes.map((ep) => ep.id);
      return;
    }
    const seasonOrder = productionOrder.seasonProductionOrders.find(
      (order) => order.seasonNumber === seasonNumber
    );
    if (!seasonOrder) {
      setEpisodes(baseEpisodes);
      originalEpisodeIds.current = baseEpisodes.map((ep) => ep.id);
      return;
    }

    // Reorder episodes based on saved order
    const orderedEpisodes = seasonOrder.episodeIdsInProductionOrder
      .map((episodeId) => baseEpisodes.find((ep) => ep.id === episodeId))
      .filter((ep): ep is Episode => ep !== undefined);

    // Add any episodes not in the saved order to the end
    const unorderedEpisodes = baseEpisodes.filter(
      (ep) => !seasonOrder.episodeIdsInProductionOrder.includes(ep.id)
    );

    const finalEpisodes = [...orderedEpisodes, ...unorderedEpisodes];
    setEpisodes(finalEpisodes);
    originalEpisodeIds.current = finalEpisodes.map((ep) => ep.id);
  }, [season, productionOrder, seasonNumber, getEpisodes]);

  const addProductionOrderMutation = useMutation({
    mutationFn: addProductionOrder,
    onSuccess: (data) => {
      if (data) {
        addProductionOrderToStore(data);
        queryClient.invalidateQueries({
          queryKey: [FIRESTORE_COLLECTIONS.PRODUCTION_ORDERS, showId, userId],
        });
      }
    },
  });

  const updateProductionOrderMutation = useMutation({
    mutationFn: ({
      documentId,
      data,
    }: {
      documentId: string;
      data: Parameters<typeof updateProductionOrder>[0];
    }) => updateProductionOrder(data, documentId),
    onSuccess: (data) => {
      if (data) {
        updateProductionOrderInStore(data.documentId, data);
        queryClient.invalidateQueries({
          queryKey: [FIRESTORE_COLLECTIONS.PRODUCTION_ORDERS, showId, userId],
        });
      }
    },
  });

  const deleteProductionOrderMutation = useMutation({
    mutationFn: deleteProductionOrder,
    onSuccess: (documentId) => {
      if (documentId) {
        removeProductionOrderFromStore(documentId);
        queryClient.invalidateQueries({
          queryKey: [FIRESTORE_COLLECTIONS.PRODUCTION_ORDERS, showId, userId],
        });
      }
    },
  });

  const handleDragEnd = ({ data }: { data: Episode[] }) => {
    setEpisodes(data);
  };

  const moveEpisode = (fromIndex: number, toIndex: number) => {
    const newEpisodes = [...episodes];
    const [movedEpisode] = newEpisodes.splice(fromIndex, 1);
    newEpisodes.splice(toIndex, 0, movedEpisode);
    setEpisodes(newEpisodes);
  };

  const moveToTop = (index: number) => moveEpisode(index, 0);
  const moveUp = (index: number) => moveEpisode(index, index - 1);
  const moveDown = (index: number) => moveEpisode(index, index + 1);
  const moveToBottom = (index: number) =>
    moveEpisode(index, episodes.length - 1);

  const checkHasUnsavedChanges = () => {
    const currentEpisodeIds = episodes.map((ep) => ep.id);
    return (
      currentEpisodeIds.length !== originalEpisodeIds.current.length ||
      currentEpisodeIds.some(
        (id, index) => id !== originalEpisodeIds.current[index]
      )
    );
  };

  const checkIsDefaultOrder = () => {
    const currentEpisodeIds = episodes.map((ep) => ep.id);
    const defaultEpisodes = season?.episodes
      ? getEpisodes(season.episodes)
      : [];
    const defaultEpisodeIds = defaultEpisodes.map((ep) => ep.id);

    return (
      currentEpisodeIds.length === defaultEpisodeIds.length &&
      currentEpisodeIds.every((id, index) => id === defaultEpisodeIds[index])
    );
  };

  const handleSave = () => {
    const episodeIds = episodes.map((ep) => ep.id);
    const isDefaultOrder = checkIsDefaultOrder();

    if (isDefaultOrder) {
      // If order matches default, remove production order if it exists
      if (productionOrder) {
        const otherSeasonOrders = productionOrder.seasonProductionOrders.filter(
          (order) => order.seasonNumber !== seasonNumber
        );

        if (otherSeasonOrders.length === 0) {
          // No other seasons have custom orders, delete the entire document
          deleteProductionOrderMutation.mutate(productionOrder.documentId, {
            onSuccess: () => {
              setEditMode(false);
              originalEpisodeIds.current = episodes.map((ep) => ep.id);
            },
          });
        } else {
          // Other seasons have custom orders, just remove this season
          updateProductionOrderMutation.mutate(
            {
              documentId: productionOrder.documentId,
              data: {
                seasonProductionOrders: otherSeasonOrders,
              },
            },
            {
              onSuccess: () => {
                setEditMode(false);
                originalEpisodeIds.current = episodes.map((ep) => ep.id);
              },
            }
          );
        }
      }
      // If no production order exists and order is default, nothing to do
      setEditMode(false);
      originalEpisodeIds.current = episodes.map((ep) => ep.id);
      return;
    }

    if (!productionOrder) {
      // Create new production order document
      addProductionOrderMutation.mutate(
        {
          showId: Number(showId),
          userId,
          seasonProductionOrders: [
            {
              seasonNumber,
              episodeIdsInProductionOrder: episodeIds,
            },
          ],
        },
        {
          onSuccess: () => {
            setEditMode(false);
            originalEpisodeIds.current = episodes.map((ep) => ep.id);
          },
        }
      );
    } else {
      // Update existing production order
      const existingSeasonOrders =
        productionOrder.seasonProductionOrders.filter(
          (order) => order.seasonNumber !== seasonNumber
        );

      updateProductionOrderMutation.mutate(
        {
          documentId: productionOrder.documentId,
          data: {
            seasonProductionOrders: [
              ...existingSeasonOrders,
              {
                seasonNumber,
                episodeIdsInProductionOrder: episodeIds,
              },
            ],
          },
        },
        {
          onSuccess: () => {
            setEditMode(false);
            originalEpisodeIds.current = episodes.map((ep) => ep.id);
          },
        }
      );
    }
  };

  const handleSeasonSelect = (value: string | number) => {
    const hasUnsavedChanges = checkHasUnsavedChanges();

    if (hasUnsavedChanges && editMode) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Changing seasons will discard them. Do you want to continue?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Continue',
            style: 'destructive',
            onPress: () => {
              setSeasonNumber(Number(value));
              setEditMode(true);
            },
          },
        ]
      );
    } else {
      setSeasonNumber(Number(value));
    }
  };

  if (isLoadingShowDetails || isLoadingSeason) {
    return (
      <Screen
        headerProps={{
          title: 'Set Production Order',
        }}
      >
        <View style={styles.seasonSelectContainer}>
          <Skeleton className="h-40 w-full rounded-lg" />
        </View>
        <View style={{ ...styles.draggableListContainer, marginTop: 24 }}>
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="mt-2 h-16 w-full rounded-lg" />
          <Skeleton className="mt-2 h-16 w-full rounded-lg" />
          <Skeleton className="mt-2 h-16 w-full rounded-lg" />
        </View>
      </Screen>
    );
  }

  const isPending =
    isLoadingProductionOrder ||
    addProductionOrderMutation.isPending ||
    updateProductionOrderMutation.isPending ||
    deleteProductionOrderMutation.isPending;

  return (
    <Screen
      headerProps={{
        title: 'Set Production Order',
        right: editMode
          ? [
              {
                disabled: isPending,
                icon: {
                  name: isPending ? 'slowmo' : 'checkmark',
                  type: isPending ? 'community' : 'material',
                  color: isPending ? colors.charcoal[500] : colors.primary[600],
                },
                onPress: handleSave,
              },
            ]
          : [
              {
                disabled: isPending,
                icon: {
                  name: 'pencil',
                  color: colors.primary[600],
                },
                onPress: () => setEditMode(true),
              },
            ],
      }}
    >
      <View style={styles.seasonSelectContainer}>
        <SeasonSelect
          placeholder="Season"
          options={options}
          value={seasonNumber}
          onSelect={handleSeasonSelect}
          optionsTitle="Seasons"
        />
      </View>
      <DraggableFlatList
        data={episodes}
        onDragEnd={handleDragEnd}
        keyExtractor={(item) => item.id.toString()}
        containerStyle={styles.draggableListContainer}
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => (
          <View className="h-0.5 bg-charcoal-300" />
        )}
        renderItem={({ item, drag, isActive }) => (
          <ScaleDecorator>
            <TouchableOpacity
              onLongPress={drag}
              disabled={!editMode || isActive || isPending}
              style={[
                styles.rowItem,
                isActive ? styles.activeRowItem : undefined,
              ]}
              activeOpacity={0.5}
            >
              {editMode && (
                <IconSymbol name="line.3.horizontal" size={28} color="white" />
              )}
              <EpisodeItem draggable episode={item} />
              {editMode && (
                <View style={styles.menuButton}>
                  <IconPopupMenu
                    iconName="ellipsis"
                    triggerSize={24}
                    triggerColor={colors.white}
                    items={[
                      {
                        label: 'Move to top',
                        iconName: 'arrow.up.to.line',
                        disabled:
                          episodes.findIndex((ep) => ep.id === item.id) === 0,
                        onPress: () =>
                          moveToTop(
                            episodes.findIndex((ep) => ep.id === item.id)
                          ),
                      },
                      {
                        label: 'Move up',
                        iconName: 'arrow.up',
                        disabled:
                          episodes.findIndex((ep) => ep.id === item.id) === 0,
                        onPress: () =>
                          moveUp(episodes.findIndex((ep) => ep.id === item.id)),
                      },
                      {
                        label: 'Move down',
                        iconName: 'arrow.down',
                        disabled:
                          episodes.findIndex((ep) => ep.id === item.id) ===
                          episodes.length - 1,
                        onPress: () =>
                          moveDown(
                            episodes.findIndex((ep) => ep.id === item.id)
                          ),
                      },
                      {
                        label: 'Move to bottom',
                        iconName: 'arrow.down.to.line',
                        disabled:
                          episodes.findIndex((ep) => ep.id === item.id) ===
                          episodes.length - 1,
                        onPress: () =>
                          moveToBottom(
                            episodes.findIndex((ep) => ep.id === item.id)
                          ),
                      },
                    ]}
                  />
                </View>
              )}
            </TouchableOpacity>
          </ScaleDecorator>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  seasonSelectContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  draggableListContainer: {
    paddingHorizontal: 16,
  },
  listContentContainer: {
    paddingBottom: 100,
  },
  rowItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
  },
  menuButton: {
    position: 'absolute',
    right: 8,
    top: 16,
  },
  activeRowItem: {
    backgroundColor: colors.charcoal[600],
    paddingHorizontal: 16,
  },
});
