import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAddTransportMutation } from '@/lib/hooks/use-firestore-collection-hooks';
import type { NewTransport } from '@/lib/types/plans';

import { ControlledInput, Separator, Text, View } from '../ui';
import { PlanFormShell } from './form-shell';
import { nowIso, optionalAddress, optionalText } from './form-utils';
import { ControlledTripSelect } from './trip-select';

const transportFormSchema = z.object({
  confirmationNumber: z.string().optional(),
  departureDatetime: z.string().optional(),
  dropoffCity: z.string().optional(),
  dropoffCountry: z.string().optional(),
  dropoffPostalCode: z.string().optional(),
  dropoffState: z.string().optional(),
  dropoffStreet1: z.string().optional(),
  dropoffStreet2: z.string().optional(),
  name: z.string().min(1, { message: 'Required' }),
  notes: z.string().optional(),
  pickupCity: z.string().optional(),
  pickupCountry: z.string().optional(),
  pickupPostalCode: z.string().optional(),
  pickupState: z.string().optional(),
  pickupStreet1: z.string().optional(),
  pickupStreet2: z.string().optional(),
  phoneNumber: z.string().optional(),
  tripId: z.string().optional(),
});

type TransportFormValues = z.infer<typeof transportFormSchema>;

type TransportFormProps = {
  onSuccess?: () => void;
  userId: string;
};

export const TransportForm = ({ onSuccess, userId }: TransportFormProps) => {
  const { control, handleSubmit, formState } = useForm<TransportFormValues>({
    defaultValues: {
      confirmationNumber: '',
      departureDatetime: '',
      dropoffCity: '',
      dropoffCountry: '',
      dropoffPostalCode: '',
      dropoffState: '',
      dropoffStreet1: '',
      dropoffStreet2: '',
      name: '',
      notes: '',
      pickupCity: '',
      pickupCountry: '',
      pickupPostalCode: '',
      pickupState: '',
      pickupStreet1: '',
      pickupStreet2: '',
      phoneNumber: '',
      tripId: '',
    },
    resolver: zodResolver(transportFormSchema),
  });
  const addTransport = useAddTransportMutation(userId);

  const submitForm = async (values: TransportFormValues) => {
    const transportData: NewTransport = {
      confirmationNumber: optionalText(values.confirmationNumber),
      createdAt: nowIso(),
      departureDatetime: optionalText(values.departureDatetime),
      dropoffLocation: optionalAddress({
        city: values.dropoffCity,
        country: values.dropoffCountry,
        postalCode: values.dropoffPostalCode,
        state: values.dropoffState,
        street1: values.dropoffStreet1,
        street2: values.dropoffStreet2,
      }),
      name: values.name,
      notes: optionalText(values.notes),
      pickupLocation: optionalAddress({
        city: values.pickupCity,
        country: values.pickupCountry,
        postalCode: values.pickupPostalCode,
        state: values.pickupState,
        street1: values.pickupStreet1,
        street2: values.pickupStreet2,
      }),
      phoneNumber: optionalText(values.phoneNumber),
      tripId: optionalText(values.tripId),
      updatedAt: nowIso(),
      userId,
    };

    await addTransport.mutateAsync(transportData);
    onSuccess?.();
  };

  return (
    <PlanFormShell
      description="Record the ride, shuttle, or transfer details."
      disabled={!userId}
      loading={addTransport.isPending}
      onSubmit={handleSubmit(submitForm)}
      submitLabel="Add Transport"
      title="Transport"
    >
      <ControlledInput
        control={control}
        error={formState.errors.name?.message}
        label="Name"
        name="name"
        placeholder="e.g. Airport transfer"
        required
      />
      {/* TODO: Add Date and Time fields */}
      <ControlledInput
        control={control}
        label="Confirmation Number"
        name="confirmationNumber"
        placeholder="Optional confirmation"
      />
      <ControlledTripSelect
        control={control}
        label="Trip"
        name="tripId"
        userId={userId}
      />
      <Separator hideBottomPadding hideTopPadding />
      <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
        Pickup Location
      </Text>
      <View className="gap-3">
        <ControlledInput
          control={control}
          label="Street 1"
          name="pickupStreet1"
          placeholder="Pickup address"
        />
        <ControlledInput
          control={control}
          label="Street 2"
          name="pickupStreet2"
          placeholder="Apartment, suite, floor"
        />
        <ControlledInput
          control={control}
          label="City"
          name="pickupCity"
          placeholder="City"
        />
        <ControlledInput
          control={control}
          label="State"
          name="pickupState"
          placeholder="State"
        />
        <ControlledInput
          control={control}
          label="Postal Code"
          name="pickupPostalCode"
          placeholder="Postal code"
        />
        <ControlledInput
          control={control}
          label="Country"
          name="pickupCountry"
          placeholder="Country"
        />
      </View>
      <Separator hideBottomPadding hideTopPadding />
      <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
        Dropoff Location
      </Text>
      <View className="gap-3">
        <ControlledInput
          control={control}
          label="Street 1"
          name="dropoffStreet1"
          placeholder="Dropoff address"
        />
        <ControlledInput
          control={control}
          label="Street 2"
          name="dropoffStreet2"
          placeholder="Apartment, suite, floor"
        />
        <ControlledInput
          control={control}
          label="City"
          name="dropoffCity"
          placeholder="City"
        />
        <ControlledInput
          control={control}
          label="State"
          name="dropoffState"
          placeholder="State"
        />
        <ControlledInput
          control={control}
          label="Postal Code"
          name="dropoffPostalCode"
          placeholder="Postal code"
        />
        <ControlledInput
          control={control}
          label="Country"
          name="dropoffCountry"
          placeholder="Country"
        />
      </View>
      <ControlledInput
        control={control}
        label="Phone Number"
        name="phoneNumber"
        placeholder="Optional contact number"
      />
      <ControlledInput
        control={control}
        label="Notes"
        multiline
        name="notes"
        numberOfLines={4}
        placeholder="Optional details"
      />
    </PlanFormShell>
  );
};
