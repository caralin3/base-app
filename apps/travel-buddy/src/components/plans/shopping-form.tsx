import {
  useAddShoppingMutation,
  useUpdateShoppingMutation,
} from '@/lib/hooks/use-firestore-collection-hooks';
import type { Shopping } from '@/lib/types/plans';

import { toUpdateData } from './form-utils';
import { PlaceForm, type PlaceFormValues, toNewPlace } from './place-form';

type ShoppingFormProps = {
  defaultTripId?: string;
  onSuccess?: () => void;
  /** Existing shopping to edit; omit to create a new one. */
  plan?: Shopping;
  userId: string;
};

export const ShoppingForm = ({
  defaultTripId,
  onSuccess,
  plan,
  userId,
}: ShoppingFormProps) => {
  const addShopping = useAddShoppingMutation(userId);
  const updateShopping = useUpdateShoppingMutation(userId);

  const submitForm = async (values: PlaceFormValues) => {
    if (plan) {
      await updateShopping.mutateAsync({
        data: toUpdateData(toNewPlace(values, userId, plan.status)),
        id: plan.id,
      });
    } else {
      await addShopping.mutateAsync(toNewPlace(values, userId));
    }
    onSuccess?.();
  };

  return (
    <PlaceForm
      defaultTripId={defaultTripId}
      description="Save a store, market, or purchase stop."
      isIdea={plan?.status === 'idea'}
      loading={addShopping.isPending || updateShopping.isPending}
      onSubmit={submitForm}
      plan={plan}
      submitLabel={plan ? 'Save Changes' : 'Add Shopping'}
      title="Shopping"
      userId={userId}
    />
  );
};
