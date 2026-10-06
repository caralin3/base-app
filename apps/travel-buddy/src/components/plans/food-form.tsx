import { useAddFoodMutation } from '@/lib/hooks/use-firestore-collection-hooks';

import { PlaceForm, type PlaceFormValues, toNewPlace } from './place-form';

type FoodFormProps = {
  defaultTripId?: string;
  onSuccess?: () => void;
  userId: string;
};

export const FoodForm = ({
  defaultTripId,
  onSuccess,
  userId,
}: FoodFormProps) => {
  const addFood = useAddFoodMutation(userId);

  const submitForm = async (values: PlaceFormValues) => {
    await addFood.mutateAsync(toNewPlace(values, userId));
    onSuccess?.();
  };

  return (
    <PlaceForm
      defaultTripId={defaultTripId}
      description="Save a restaurant, reservation, or meal stop."
      loading={addFood.isPending}
      onSubmit={submitForm}
      submitLabel="Add Food"
      title="Food"
      userId={userId}
    />
  );
};
