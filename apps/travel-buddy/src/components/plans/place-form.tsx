import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ControlledInput, Separator, Text, View } from '../ui';
import { PlanFormShell } from './form-shell';
import { ControlledTripSelect } from './trip-select';

export const placeFormSchema = z.object({
  addressCity: z.string().optional(),
  addressCountry: z.string().optional(),
  addressPostalCode: z.string().optional(),
  addressState: z.string().optional(),
  addressStreet1: z.string().optional(),
  addressStreet2: z.string().optional(),
  datetime: z.string().optional(),
  name: z.string().min(1, { message: 'Required' }),
  notes: z.string().optional(),
  phoneNumber: z.string().optional(),
  tripId: z.string().optional(),
});

export type PlaceFormValues = z.infer<typeof placeFormSchema>;

type PlaceFormProps = {
  children?: React.ReactNode;
  description: string;
  loading?: boolean;
  onSuccess?: () => void;
  onSubmit: (values: PlaceFormValues) => Promise<void>;
  submitLabel: string;
  title: string;
  userId: string;
};

export const PlaceForm = ({
  children,
  description,
  loading = false,
  onSuccess,
  onSubmit,
  submitLabel,
  title,
  userId,
}: PlaceFormProps) => {
  const { control, handleSubmit, formState } = useForm<PlaceFormValues>({
    defaultValues: {
      addressCity: '',
      addressCountry: '',
      addressPostalCode: '',
      addressState: '',
      addressStreet1: '',
      addressStreet2: '',
      datetime: '',
      name: '',
      notes: '',
      phoneNumber: '',
      tripId: '',
    },
    resolver: zodResolver(placeFormSchema),
  });

  const submit = async (values: PlaceFormValues) => {
    await onSubmit(values);
    onSuccess?.();
  };

  return (
    <PlanFormShell
      description={description}
      disabled={!userId}
      loading={loading}
      onSubmit={handleSubmit(submit)}
      submitLabel={submitLabel}
      title={title}
    >
      <ControlledInput
        control={control}
        error={formState.errors.name?.message}
        label="Name"
        name="name"
        placeholder="e.g. Dinner at Le Jardin"
        required
      />
      {/* TODO: Add Date and Time fields */}
      <ControlledTripSelect
        control={control}
        label="Trip"
        name="tripId"
        userId={userId}
      />
      <ControlledInput
        control={control}
        label="Phone Number"
        name="phoneNumber"
        placeholder="Optional contact number"
      />
      <Separator hideBottomPadding hideTopPadding />
      <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
        Address
      </Text>
      <View className="gap-3">
        <ControlledInput
          control={control}
          label="Street 1"
          name="addressStreet1"
          placeholder="Optional street address"
        />
        <ControlledInput
          control={control}
          label="Street 2"
          name="addressStreet2"
          placeholder="Apartment, suite, floor"
        />
        <ControlledInput
          control={control}
          label="City"
          name="addressCity"
          placeholder="Optional city"
        />
        <ControlledInput
          control={control}
          label="State"
          name="addressState"
          placeholder="Optional state"
        />
        <ControlledInput
          control={control}
          label="Postal Code"
          name="addressPostalCode"
          placeholder="Optional postal code"
        />
        <ControlledInput
          control={control}
          label="Country"
          name="addressCountry"
          placeholder="Optional country"
        />
      </View>
      <ControlledInput
        control={control}
        label="Notes"
        multiline
        name="notes"
        numberOfLines={4}
        placeholder="Optional details"
      />
      {children}
    </PlanFormShell>
  );
};
