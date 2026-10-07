import { Select } from '@base-app/ui';
import { useState } from 'react';

import {
  useAddActivityMutation,
  useAddEntertainmentMutation,
  useAddFoodMutation,
  useAddShoppingMutation,
} from '@/lib/hooks/use-firestore-collection-hooks';
import { type PlaceType, placeTypeOptions } from '@/lib/static-data';

import { PlaceForm, type PlaceFormValues, toNewPlace } from './place-form';

type IdeaFormProps = {
  defaultTripId?: string;
  onSuccess?: () => void;
  userId: string;
};

export const IdeaForm = ({
  defaultTripId,
  onSuccess,
  userId,
}: IdeaFormProps) => {
  const [placeType, setPlaceType] = useState<PlaceType>('activity');
  const mutations = {
    activity: useAddActivityMutation(userId),
    entertainment: useAddEntertainmentMutation(userId),
    food: useAddFoodMutation(userId),
    shopping: useAddShoppingMutation(userId),
  };
  const addIdea = mutations[placeType];

  const submitForm = async (values: PlaceFormValues) => {
    await addIdea.mutateAsync(toNewPlace(values, userId, 'idea'));
    onSuccess?.();
  };

  return (
    <PlaceForm
      defaultTripId={defaultTripId}
      description="Save something you might do. Everyone can vote on it, and you can schedule it later."
      isIdea
      loading={addIdea.isPending}
      onSubmit={submitForm}
      submitLabel="Add Idea"
      title="Idea"
      userId={userId}
    >
      <Select
        label="Category"
        onSelect={(value) => setPlaceType(value as PlaceType)}
        options={placeTypeOptions}
        optionsTitle="Category"
        value={placeType}
      />
    </PlaceForm>
  );
};
