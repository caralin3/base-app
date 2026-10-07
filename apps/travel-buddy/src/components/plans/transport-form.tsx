import {
  ControlledDateTimeInput,
  ControlledInput,
  Separator,
  Text,
  View,
} from '@base-app/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import {
  useAddTransportMutation,
  useUpdateTransportMutation,
} from '@/lib/hooks/use-firestore-collection-hooks';
import type { NewTransport, Transport } from '@/lib/types/plans';

import { PlanFormShell } from './form-shell';
import {
  addressToFields,
  endAfterStart,
  fieldsToAddress,
  nowIso,
  optionalText,
  toUpdateData,
} from './form-utils';
import { ControlledTripSelect } from './trip-select';

const transportFormSchema = z
  .object({
    arrivalDatetime: z.string().optional(),
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
    website: z.string().optional(),
  })
  .refine(endAfterStart('departureDatetime', 'arrivalDatetime'), {
    message: 'Arrival must be after departure',
    path: ['arrivalDatetime'],
  });

type TransportFormValues = z.infer<typeof transportFormSchema>;

type TransportFormProps = {
  defaultTripId?: string;
  onSuccess?: () => void;
  /** Existing transport to edit; omit to create a new one. */
  plan?: Transport;
  userId: string;
};

const toTransportFormValues = (
  defaultTripId: string,
  plan?: Transport
): TransportFormValues => ({
  ...addressToFields('dropoff', plan?.dropoffLocation),
  ...addressToFields('pickup', plan?.pickupLocation),
  arrivalDatetime: plan?.arrivalDatetime ?? '',
  confirmationNumber: plan?.confirmationNumber ?? '',
  departureDatetime: plan?.departureDatetime ?? '',
  name: plan?.name ?? '',
  notes: plan?.notes ?? '',
  phoneNumber: plan?.phoneNumber ?? '',
  tripId: plan?.tripId ?? defaultTripId,
  website: plan?.website ?? '',
});

export const TransportForm = ({
  defaultTripId = '',
  onSuccess,
  plan,
  userId,
}: TransportFormProps) => {
  const { control, handleSubmit, formState } = useForm<TransportFormValues>({
    defaultValues: toTransportFormValues(defaultTripId, plan),
    resolver: zodResolver(transportFormSchema),
  });
  const departureDatetime = useWatch({ control, name: 'departureDatetime' });
  const addTransport = useAddTransportMutation(userId);
  const updateTransport = useUpdateTransportMutation(userId);

  const submitForm = async (values: TransportFormValues) => {
    const transportData: NewTransport = {
      arrivalDatetime: optionalText(values.arrivalDatetime),
      confirmationNumber: optionalText(values.confirmationNumber),
      createdAt: nowIso(),
      departureDatetime: optionalText(values.departureDatetime),
      dropoffLocation: fieldsToAddress('dropoff', values),
      name: values.name,
      notes: optionalText(values.notes),
      pickupLocation: fieldsToAddress('pickup', values),
      phoneNumber: optionalText(values.phoneNumber),
      tripId: optionalText(values.tripId),
      updatedAt: nowIso(),
      userId,
      website: optionalText(values.website),
    };

    if (plan) {
      await updateTransport.mutateAsync({
        data: toUpdateData(transportData),
        id: plan.id,
      });
    } else {
      await addTransport.mutateAsync(transportData);
    }
    onSuccess?.();
  };

  return (
    <PlanFormShell
      description="Record the ride, shuttle, or transfer details."
      disabled={!userId}
      loading={addTransport.isPending || updateTransport.isPending}
      onSubmit={handleSubmit(submitForm)}
      submitLabel={plan ? 'Save Changes' : 'Add Transport'}
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
      <ControlledDateTimeInput
        control={control}
        label="Departs"
        name="departureDatetime"
      />
      <ControlledDateTimeInput
        control={control}
        defaultPickerDate={
          departureDatetime ? new Date(departureDatetime) : undefined
        }
        label="Arrives"
        name="arrivalDatetime"
      />
      <ControlledInput
        control={control}
        keyboardType="url"
        label="Website"
        name="website"
        placeholder="Booking or company website"
      />
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
