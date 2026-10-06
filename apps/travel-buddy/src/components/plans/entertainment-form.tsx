import { useAddEntertainmentMutation } from '@/lib/hooks/use-firestore-collection-hooks';

import { PlaceForm, type PlaceFormValues, toNewPlace } from './place-form';

type EntertainmentFormProps = {
  defaultTripId?: string;
  onSuccess?: () => void;
  userId: string;
};

export const EntertainmentForm = ({
  defaultTripId,
  onSuccess,
  userId,
}: EntertainmentFormProps) => {
  const addEntertainment = useAddEntertainmentMutation(userId);

  const submitForm = async (values: PlaceFormValues) => {
    await addEntertainment.mutateAsync(toNewPlace(values, userId));
    onSuccess?.();
  };

  return (
    <PlaceForm
      defaultTripId={defaultTripId}
      description="Track shows, events, and other plans."
      loading={addEntertainment.isPending}
      onSubmit={submitForm}
      submitLabel="Add Entertainment"
      title="Entertainment"
      userId={userId}
    />
  );
};
