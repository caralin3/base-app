import { useAddFoodMutation } from '@/lib/hooks/use-firestore-collection-hooks';
import type { NewFood } from '@/lib/types/plans';

import { nowIso, optionalAddress, optionalText } from './form-utils';
import { PlaceForm, type PlaceFormValues } from './place-form';

type FoodFormProps = {
  onSuccess?: () => void;
  userId: string;
};

export const FoodForm = ({ onSuccess, userId }: FoodFormProps) => {
  const addFood = useAddFoodMutation(userId);

  const submitForm = async (values: PlaceFormValues) => {
    const foodData: NewFood = {
      address: optionalAddress({
        city: values.addressCity,
        country: values.addressCountry,
        postalCode: values.addressPostalCode,
        state: values.addressState,
        street1: values.addressStreet1,
        street2: values.addressStreet2,
      }),
      createdAt: nowIso(),
      datetime: optionalText(values.datetime),
      name: values.name,
      notes: optionalText(values.notes),
      phoneNumber: optionalText(values.phoneNumber),
      tripId: optionalText(values.tripId),
      updatedAt: nowIso(),
      userId,
    };

    await addFood.mutateAsync(foodData);
    onSuccess?.();
  };

  return (
    <PlaceForm
      description="Save a restaurant, reservation, or meal stop."
      loading={addFood.isPending}
      onSuccess={onSuccess}
      onSubmit={submitForm}
      submitLabel="Add Food"
      title="Food"
      userId={userId}
    />
  );
};
