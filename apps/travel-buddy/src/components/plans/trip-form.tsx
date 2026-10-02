import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAddTripMutation } from '@/lib/hooks/use-firestore-collection-hooks';
import type { NewTrip } from '@/lib/types/trips';

import { ControlledInput } from '../ui';
import { PlanFormShell } from './form-shell';
import { nowIso, optionalText } from './form-utils';

const tripFormSchema = z.object({
  coverPhotoUrl: z.string().optional(),
  destination: z.string().optional(),
  endDate: z.string().min(1, { message: 'Required' }),
  name: z.string().min(1, { message: 'Required' }),
  notes: z.string().optional(),
  startDate: z.string().min(1, { message: 'Required' }),
});

type TripFormValues = z.infer<typeof tripFormSchema>;

type TripFormProps = {
  onSuccess?: (tripId: string) => void;
  userId: string;
};

export const TripForm = ({ onSuccess, userId }: TripFormProps) => {
  const { control, handleSubmit, formState } = useForm<TripFormValues>({
    defaultValues: {
      coverPhotoUrl: '',
      destination: '',
      endDate: '',
      name: '',
      notes: '',
      startDate: '',
    },
    resolver: zodResolver(tripFormSchema),
  });
  const addTrip = useAddTripMutation(userId);

  const submitForm = async (values: TripFormValues) => {
    const tripData: NewTrip = {
      coverPhotoUrl: optionalText(values.coverPhotoUrl),
      createdAt: nowIso(),
      destination: optionalText(values.destination),
      endDate: values.endDate,
      name: values.name,
      notes: optionalText(values.notes),
      startDate: values.startDate,
      updatedAt: nowIso(),
      userId,
    };

    const id = await addTrip.mutateAsync(tripData);
    onSuccess?.(id);
  };

  return (
    <PlanFormShell
      description="Keep the core trip details in one place."
      disabled={!userId}
      loading={addTrip.isPending}
      onSubmit={handleSubmit(submitForm)}
      submitLabel="Add Trip"
      title="Trip"
    >
      <ControlledInput
        control={control}
        error={formState.errors.name?.message}
        label="Name"
        name="name"
        placeholder="e.g. Summer Vacation"
        required
        autoCapitalize="words"
      />
      <ControlledInput
        control={control}
        error={formState.errors.destination?.message}
        label="Destination"
        name="destination"
        placeholder="e.g. Paris, France"
        autoCapitalize="words"
      />
      <ControlledInput
        testID="startDate"
        control={control}
        name="startDate"
        label="Start Date"
        placeholder="YYYY-MM-DD"
        error={formState.errors.startDate?.message}
        required
      />
      <ControlledInput
        testID="endDate"
        control={control}
        name="endDate"
        label="End Date"
        placeholder="YYYY-MM-DD"
        error={formState.errors.endDate?.message}
        required
      />
      <ControlledInput
        control={control}
        label="Cover Photo URL"
        name="coverPhotoUrl"
        placeholder="https://..."
      />
      <ControlledInput
        control={control}
        label="Notes"
        multiline
        name="notes"
        numberOfLines={4}
        placeholder="Optional trip details"
      />
    </PlanFormShell>
  );
};
