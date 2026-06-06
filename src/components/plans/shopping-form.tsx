import type { NewShopping } from '@/lib/types/plans';
import { useAddShoppingMutation } from '@/lib/hooks/use-firestore-collection-hooks';

import { nowIso, optionalAddress, optionalText } from './form-utils';
import { PlaceForm, type PlaceFormValues } from './place-form';

type ShoppingFormProps = {
  onSuccess?: () => void;
  userId: string;
};

export const ShoppingForm = ({ onSuccess, userId }: ShoppingFormProps) => {
  const addShopping = useAddShoppingMutation(userId);

  const submitForm = async (values: PlaceFormValues) => {
    const shoppingData: NewShopping = {
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

    await addShopping.mutateAsync(shoppingData);
    onSuccess?.();
  };

  return (
    <PlaceForm
      description="Save a store, market, or purchase stop."
      loading={addShopping.isPending}
      onSuccess={onSuccess}
      onSubmit={submitForm}
      submitLabel="Add Shopping"
      title="Shopping"
      userId={userId}
    />
  );
};
