import { useAuth } from '@base-app/core';
import {
  BottomSheetKeyboardAwareScrollView,
  Button,
  ModalForm,
  useModal,
  View,
} from '@base-app/ui';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { Alert } from 'react-native';

import {
  useDeleteActivityMutation,
  useDeleteEntertainmentMutation,
  useDeleteFlightMutation,
  useDeleteFoodMutation,
  useDeleteLodgingMutation,
  useDeleteShoppingMutation,
  useDeleteTransportMutation,
  type useTripPlans,
} from '@/lib/hooks';
import { itineraryCategories } from '@/lib/static-data';
import type { ItinerarySourceType } from '@/lib/utils';

import { ActivityForm } from './activity-form';
import { EntertainmentForm } from './entertainment-form';
import { FlightForm } from './flight-form';
import { FoodForm } from './food-form';
import { LodgingForm } from './lodging-form';
import { ShoppingForm } from './shopping-form';
import { TransportForm } from './transport-form';

type TripPlans = ReturnType<typeof useTripPlans>['plans'];

export type EditPlanTarget = { id: string; type: ItinerarySourceType };

export type EditPlanModalRef = {
  dismiss: () => void;
  edit: (target: EditPlanTarget) => void;
};

type EditPlanModalProps = {
  /** The trip's plans; the plan being edited is looked up here. */
  plans: TripPlans;
};

const titles: Record<ItinerarySourceType, string> = {
  activity: itineraryCategories.activity.label,
  entertainment: itineraryCategories.entertainment.label,
  flight: 'Flight',
  food: itineraryCategories.food.label,
  lodging: 'Lodging',
  shopping: itineraryCategories.shopping.label,
  transport: 'Transport',
};

export const EditPlanModal = forwardRef<EditPlanModalRef, EditPlanModalProps>(
  ({ plans }, ref) => {
    const modal = useModal();
    const userId = useAuth((state) => state.user?.id || '');
    const [target, setTarget] = useState<EditPlanTarget>();
    const deleteMutations: Record<
      ItinerarySourceType,
      { isPending: boolean; mutateAsync: (id: string) => Promise<unknown> }
    > = {
      activity: useDeleteActivityMutation(userId),
      entertainment: useDeleteEntertainmentMutation(userId),
      flight: useDeleteFlightMutation(userId),
      food: useDeleteFoodMutation(userId),
      lodging: useDeleteLodgingMutation(userId),
      shopping: useDeleteShoppingMutation(userId),
      transport: useDeleteTransportMutation(userId),
    };

    const dismiss = useCallback(() => {
      modal.dismiss();
      setTarget(undefined);
    }, [modal]);

    const edit = useCallback(
      (next: EditPlanTarget) => {
        setTarget(next);
        modal.present();
      },
      [modal]
    );

    useImperativeHandle(ref, () => ({ dismiss, edit }), [dismiss, edit]);

    const find = <T extends { id: string }>(docs: T[]) =>
      docs.find((doc) => doc.id === target?.id);

    const renderForm = () => {
      if (!target) return null;
      const common = { onSuccess: dismiss, userId };
      switch (target.type) {
        case 'activity': {
          const plan = find(plans.activities);
          return plan && <ActivityForm {...common} plan={plan} />;
        }
        case 'entertainment': {
          const plan = find(plans.entertainment);
          return plan && <EntertainmentForm {...common} plan={plan} />;
        }
        case 'flight': {
          const plan = find(plans.flights);
          return plan && <FlightForm {...common} plan={plan} />;
        }
        case 'food': {
          const plan = find(plans.food);
          return plan && <FoodForm {...common} plan={plan} />;
        }
        case 'lodging': {
          const plan = find(plans.lodging);
          return plan && <LodgingForm {...common} plan={plan} />;
        }
        case 'shopping': {
          const plan = find(plans.shopping);
          return plan && <ShoppingForm {...common} plan={plan} />;
        }
        case 'transport': {
          const plan = find(plans.transports);
          return plan && <TransportForm {...common} plan={plan} />;
        }
      }
    };

    const confirmDelete = () => {
      if (!target) return;
      const current = target;
      Alert.alert(
        `Delete ${titles[current.type].toLowerCase()}?`,
        'This removes it from the trip and cannot be undone.',
        [
          { style: 'cancel', text: 'Cancel' },
          {
            onPress: async () => {
              await deleteMutations[current.type].mutateAsync(current.id);
              dismiss();
            },
            style: 'destructive',
            text: 'Delete',
          },
        ]
      );
    };

    return (
      <ModalForm
        ref={modal.ref}
        snapPoints={['95%']}
        title={target ? `Edit ${titles[target.type]}` : 'Edit'}
      >
        <BottomSheetKeyboardAwareScrollView
          contentContainerStyle={{ gap: 8 }}
          showsHorizontalScrollIndicator={false}
        >
          {/* Keyed so switching plans resets the form's default values. */}
          <View key={target ? `${target.type}-${target.id}` : 'empty'}>
            {renderForm()}
          </View>
          {target && (
            <View className="pb-8 pt-2">
              <Button
                label="Delete"
                loading={deleteMutations[target.type].isPending}
                onPress={confirmDelete}
                variant="destructive"
              />
            </View>
          )}
        </BottomSheetKeyboardAwareScrollView>
      </ModalForm>
    );
  }
);

EditPlanModal.displayName = 'EditPlanModal';
