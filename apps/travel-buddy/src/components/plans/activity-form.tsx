import { useAddActivityMutation } from '@/lib/hooks/use-firestore-collection-hooks';

import { PlaceForm, type PlaceFormValues, toNewPlace } from './place-form';

type ActivityFormProps = {
  defaultTripId?: string;
  onSuccess?: () => void;
  userId: string;
};

export const ActivityForm = ({
  defaultTripId,
  onSuccess,
  userId,
}: ActivityFormProps) => {
  const addActivity = useAddActivityMutation(userId);

  const submitForm = async (values: PlaceFormValues) => {
    await addActivity.mutateAsync(toNewPlace(values, userId));
    onSuccess?.();
  };

  return (
    <PlaceForm
      defaultTripId={defaultTripId}
      description="Record an activity with time, contact, and location details."
      loading={addActivity.isPending}
      onSubmit={submitForm}
      submitLabel="Add Activity"
      title="Activity"
      userId={userId}
    />
  );
};
