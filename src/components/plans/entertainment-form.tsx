import type { NewEntertainment } from '@/lib/types/plans';
import { useAddEntertainmentMutation } from '@/lib/hooks/use-firestore-collection-hooks';

import { nowIso, optionalAddress, optionalText } from './form-utils';
import { PlaceForm, type PlaceFormValues } from './place-form';

type EntertainmentFormProps = {
  onSuccess?: () => void;
  userId: string;
};

export const EntertainmentForm = ({
  onSuccess,
  userId,
}: EntertainmentFormProps) => {
  const addEntertainment = useAddEntertainmentMutation(userId);

  const submitForm = async (values: PlaceFormValues) => {
    const entertainmentData: NewEntertainment = {
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

    await addEntertainment.mutateAsync(entertainmentData);
    onSuccess?.();
  };

  return (
    <PlaceForm
      description="Track shows, events, and other plans."
      loading={addEntertainment.isPending}
      onSuccess={onSuccess}
      onSubmit={submitForm}
      submitLabel="Add Entertainment"
      title="Entertainment"
      userId={userId}
    />
  );
};
