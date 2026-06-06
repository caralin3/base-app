import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAddLodgingMutation } from '@/lib/hooks/use-firestore-collection-hooks';
import type { NewLodging } from '@/lib/types/plans';

import { ControlledInput, Separator, Text, View } from '../ui';
import { PlanFormShell } from './form-shell';
import { nowIso, optionalAddress, optionalText } from './form-utils';
import { ControlledTripSelect } from './trip-select';

const lodgingFormSchema = z.object({
  addressCity: z.string().optional(),
  addressCountry: z.string().optional(),
  addressPostalCode: z.string().optional(),
  addressState: z.string().optional(),
  addressStreet1: z.string().optional(),
  addressStreet2: z.string().optional(),
  checkInDatetime: z.string().optional(),
  checkOutDatetime: z.string().optional(),
  confirmationNumber: z.string().optional(),
  name: z.string().min(1, { message: 'Required' }),
  notes: z.string().optional(),
  phoneNumber: z.string().optional(),
  tripId: z.string().optional(),
});

type LodgingFormValues = z.infer<typeof lodgingFormSchema>;

type LodgingFormProps = {
  onSuccess?: () => void;
  userId: string;
};

export const LodgingForm = ({ onSuccess, userId }: LodgingFormProps) => {
  const { control, handleSubmit, formState } = useForm<LodgingFormValues>({
    defaultValues: {
      addressCity: '',
      addressCountry: '',
      addressPostalCode: '',
      addressState: '',
      addressStreet1: '',
      addressStreet2: '',
      checkInDatetime: '',
      checkOutDatetime: '',
      confirmationNumber: '',
      name: '',
      notes: '',
      phoneNumber: '',
      tripId: '',
    },
    resolver: zodResolver(lodgingFormSchema),
  });
  const addLodging = useAddLodgingMutation(userId);

  const submitForm = async (values: LodgingFormValues) => {
    const lodgingData: NewLodging = {
      address: optionalAddress({
        city: values.addressCity,
        country: values.addressCountry,
        postalCode: values.addressPostalCode,
        state: values.addressState,
        street1: values.addressStreet1,
        street2: values.addressStreet2,
      }),
      checkInDatetime: optionalText(values.checkInDatetime),
      checkOutDatetime: optionalText(values.checkOutDatetime),
      confirmationNumber: optionalText(values.confirmationNumber),
      createdAt: nowIso(),
      name: values.name,
      notes: optionalText(values.notes),
      phoneNumber: optionalText(values.phoneNumber),
      tripId: optionalText(values.tripId),
      updatedAt: nowIso(),
      userId,
    };

    await addLodging.mutateAsync(lodgingData);
    onSuccess?.();
  };

  return (
    <PlanFormShell
      description="Track the place you are staying and the key check-in details."
      disabled={!userId}
      loading={addLodging.isPending}
      onSubmit={handleSubmit(submitForm)}
      submitLabel="Add Lodging"
      title="Lodging"
    >
      <ControlledInput
        control={control}
        error={formState.errors.name?.message}
        label="Name"
        name="name"
        placeholder="Hotel, rental, or stay name"
        required
      />
      {/* @TODO Add date and time pickers for check in and check out */}
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
        Address
      </Text>
      <View className="gap-3">
        <ControlledInput
          control={control}
          label="Street 1"
          name="addressStreet1"
          placeholder="Street address"
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
          placeholder="City"
        />
        <ControlledInput
          control={control}
          label="State"
          name="addressState"
          placeholder="State"
        />
        <ControlledInput
          control={control}
          label="Postal Code"
          name="addressPostalCode"
          placeholder="Postal code"
        />
        <ControlledInput
          control={control}
          label="Country"
          name="addressCountry"
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
