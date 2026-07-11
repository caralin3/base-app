import { useAddActivityMutation } from '@/lib/hooks/use-firestore-collection-hooks';
import type { NewActivity } from '@/lib/types/plans';

import { nowIso, optionalAddress, optionalText } from './form-utils';
import { PlaceForm, type PlaceFormValues } from './place-form';

type ActivityFormProps = {
  onSuccess?: () => void;
  userId: string;
};

export const ActivityForm = ({ onSuccess, userId }: ActivityFormProps) => {
  const addActivity = useAddActivityMutation(userId);

  const submitForm = async (values: PlaceFormValues) => {
    const activityData: NewActivity = {
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

    await addActivity.mutateAsync(activityData);
    onSuccess?.();
  };

  return (
    <PlaceForm
      description="Record an activity with time, contact, and location details."
      loading={addActivity.isPending}
      onSuccess={onSuccess}
      onSubmit={submitForm}
      submitLabel="Add Activity"
      title="Activity"
      userId={userId}
    />
  );
};
