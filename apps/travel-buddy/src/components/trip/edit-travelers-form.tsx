import { Button, View } from '@base-app/ui';
import { useState } from 'react';

import { TravelersInput } from '@/components/plans';
import { nowIso } from '@/components/plans/form-utils';
import { useUpdateTripMutation } from '@/lib/hooks';
import type { Trip } from '@/lib/types/trips';

type EditTravelersFormProps = {
  onSuccess?: () => void;
  trip: Trip;
  userId?: string;
};

export const EditTravelersForm = ({
  onSuccess,
  trip,
  userId,
}: EditTravelersFormProps) => {
  const [travelers, setTravelers] = useState(trip.travelers ?? []);
  const updateTrip = useUpdateTripMutation(userId);

  const save = async () => {
    await updateTrip.mutateAsync({
      data: { travelers, updatedAt: nowIso() },
      id: trip.id,
    });
    onSuccess?.();
  };

  return (
    <View className="gap-4">
      <TravelersInput onChange={setTravelers} value={travelers} />
      <Button
        label="Save Travelers"
        loading={updateTrip.isPending}
        onPress={save}
        size="lg"
        variant="secondary"
      />
    </View>
  );
};
