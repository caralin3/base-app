import { useMemo } from 'react';
import type { FieldValues, Path } from 'react-hook-form';

import { useTripsQuery } from '@/lib/hooks/use-firestore-collection-hooks';

import { ControlledSelect } from '../ui';

type TripSelectProps<T extends FieldValues> = {
  control: import('react-hook-form').Control<T>;
  label?: string;
  name: Path<T>;
  required?: boolean;
  userId: string;
};

export function ControlledTripSelect<T extends FieldValues>({
  control,
  label = 'Trip',
  name,
  required = false,
  userId,
}: TripSelectProps<T>) {
  const tripsQuery = useTripsQuery(userId);

  const options = useMemo(
    () =>
      (tripsQuery.data ?? []).map((trip) => ({
        label: trip.destination
          ? `${trip.name} · ${trip.destination}`
          : trip.name,
        value: trip.id,
      })),
    [tripsQuery.data]
  );

  return (
    <ControlledSelect
      control={control}
      disabled={!userId || tripsQuery.isLoading}
      helpText={
        !userId
          ? 'Sign in to choose a trip'
          : tripsQuery.data?.length
            ? undefined
            : 'Create a trip first to link it here'
      }
      label={label}
      name={name}
      options={options}
      optionsTitle="Trips"
      placeholder={tripsQuery.isLoading ? 'Loading trips...' : 'Select trip'}
      required={required}
    />
  );
}
