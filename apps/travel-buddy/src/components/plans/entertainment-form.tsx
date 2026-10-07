import {
  useAddEntertainmentMutation,
  useUpdateEntertainmentMutation,
} from '@/lib/hooks/use-firestore-collection-hooks';
import type { Entertainment } from '@/lib/types/plans';

import { toUpdateData } from './form-utils';
import { PlaceForm, type PlaceFormValues, toNewPlace } from './place-form';

type EntertainmentFormProps = {
  defaultTripId?: string;
  onSuccess?: () => void;
  /** Existing entertainment to edit; omit to create a new one. */
  plan?: Entertainment;
  userId: string;
};

export const EntertainmentForm = ({
  defaultTripId,
  onSuccess,
  plan,
  userId,
}: EntertainmentFormProps) => {
  const addEntertainment = useAddEntertainmentMutation(userId);
  const updateEntertainment = useUpdateEntertainmentMutation(userId);

  const submitForm = async (values: PlaceFormValues) => {
    if (plan) {
      await updateEntertainment.mutateAsync({
        data: toUpdateData(toNewPlace(values, userId, plan.status)),
        id: plan.id,
      });
    } else {
      await addEntertainment.mutateAsync(toNewPlace(values, userId));
    }
    onSuccess?.();
  };

  return (
    <PlaceForm
      defaultTripId={defaultTripId}
      description="Track shows, events, and other plans."
      isIdea={plan?.status === 'idea'}
      loading={addEntertainment.isPending || updateEntertainment.isPending}
      onSubmit={submitForm}
      plan={plan}
      submitLabel={plan ? 'Save Changes' : 'Add Entertainment'}
      title="Entertainment"
      userId={userId}
    />
  );
};
