import { useAddShoppingMutation } from '@/lib/hooks/use-firestore-collection-hooks';

import { PlaceForm, type PlaceFormValues, toNewPlace } from './place-form';

type ShoppingFormProps = {
  defaultTripId?: string;
  onSuccess?: () => void;
  userId: string;
};

export const ShoppingForm = ({
  defaultTripId,
  onSuccess,
  userId,
}: ShoppingFormProps) => {
  const addShopping = useAddShoppingMutation(userId);

  const submitForm = async (values: PlaceFormValues) => {
    await addShopping.mutateAsync(toNewPlace(values, userId));
    onSuccess?.();
  };

  return (
    <PlaceForm
      defaultTripId={defaultTripId}
      description="Save a store, market, or purchase stop."
      loading={addShopping.isPending}
      onSubmit={submitForm}
      submitLabel="Add Shopping"
      title="Shopping"
      userId={userId}
    />
  );
};
