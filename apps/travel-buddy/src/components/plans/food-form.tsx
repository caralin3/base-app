import {
  useAddFoodMutation,
  useUpdateFoodMutation,
} from '@/lib/hooks/use-firestore-collection-hooks';
import type { Food } from '@/lib/types/plans';

import { toUpdateData } from './form-utils';
import { PlaceForm, type PlaceFormValues, toNewPlace } from './place-form';

type FoodFormProps = {
  defaultTripId?: string;
  onSuccess?: () => void;
  /** Existing food to edit; omit to create a new one. */
  plan?: Food;
  userId: string;
};

export const FoodForm = ({
  defaultTripId,
  onSuccess,
  plan,
  userId,
}: FoodFormProps) => {
  const addFood = useAddFoodMutation(userId);
  const updateFood = useUpdateFoodMutation(userId);

  const submitForm = async (values: PlaceFormValues) => {
    if (plan) {
      await updateFood.mutateAsync({
        data: toUpdateData(toNewPlace(values, userId, plan.status)),
        id: plan.id,
      });
    } else {
      await addFood.mutateAsync(toNewPlace(values, userId));
    }
    onSuccess?.();
  };

  return (
    <PlaceForm
      defaultTripId={defaultTripId}
      description="Save a restaurant, reservation, or meal stop."
      isIdea={plan?.status === 'idea'}
      loading={addFood.isPending || updateFood.isPending}
      onSubmit={submitForm}
      plan={plan}
      submitLabel={plan ? 'Save Changes' : 'Add Food'}
      title="Food"
      userId={userId}
    />
  );
};
