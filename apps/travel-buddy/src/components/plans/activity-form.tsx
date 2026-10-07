import {
  useAddActivityMutation,
  useUpdateActivityMutation,
} from '@/lib/hooks/use-firestore-collection-hooks';
import type { Activity } from '@/lib/types/plans';

import { toUpdateData } from './form-utils';
import { PlaceForm, type PlaceFormValues, toNewPlace } from './place-form';

type ActivityFormProps = {
  defaultTripId?: string;
  onSuccess?: () => void;
  /** Existing activity to edit; omit to create a new one. */
  plan?: Activity;
  userId: string;
};

export const ActivityForm = ({
  defaultTripId,
  onSuccess,
  plan,
  userId,
}: ActivityFormProps) => {
  const addActivity = useAddActivityMutation(userId);
  const updateActivity = useUpdateActivityMutation(userId);

  const submitForm = async (values: PlaceFormValues) => {
    if (plan) {
      await updateActivity.mutateAsync({
        data: toUpdateData(toNewPlace(values, userId, plan.status)),
        id: plan.id,
      });
    } else {
      await addActivity.mutateAsync(toNewPlace(values, userId));
    }
    onSuccess?.();
  };

  return (
    <PlaceForm
      defaultTripId={defaultTripId}
      description="Record an activity with time, contact, and location details."
      isIdea={plan?.status === 'idea'}
      loading={addActivity.isPending || updateActivity.isPending}
      onSubmit={submitForm}
      plan={plan}
      submitLabel={plan ? 'Save Changes' : 'Add Activity'}
      title="Activity"
      userId={userId}
    />
  );
};
