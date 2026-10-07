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
  useAddLodgingMutation,
  useUpdateLodgingMutation,
} from '@/lib/hooks/use-firestore-collection-hooks';
import type { Lodging, NewLodging } from '@/lib/types/plans';

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

const lodgingFormSchema = z
  .object({
    addressCity: z.string().optional(),
    addressCountry: z.string().optional(),
    addressPostalCode: z.string().optional(),
    addressState: z.string().optional(),
    addressStreet1: z.string().optional(),
    addressStreet2: z.string().optional(),
    bookingUrl: z.string().optional(),
    checkInDatetime: z.string().optional(),
    checkOutDatetime: z.string().optional(),
    confirmationNumber: z.string().optional(),
    name: z.string().min(1, { message: 'Required' }),
    notes: z.string().optional(),
    phoneNumber: z.string().optional(),
    tripId: z.string().optional(),
    website: z.string().optional(),
  })
  .refine(endAfterStart('checkInDatetime', 'checkOutDatetime'), {
    message: 'Check-out must be after check-in',
    path: ['checkOutDatetime'],
  });

type LodgingFormValues = z.infer<typeof lodgingFormSchema>;

type LodgingFormProps = {
  defaultTripId?: string;
  onSuccess?: () => void;
  /** Existing lodging to edit; omit to create a new one. */
  plan?: Lodging;
  userId: string;
};

const toLodgingFormValues = (
  defaultTripId: string,
  plan?: Lodging
): LodgingFormValues => ({
  ...addressToFields('address', plan?.address),
  bookingUrl: plan?.bookingUrl ?? '',
  checkInDatetime: plan?.checkInDatetime ?? '',
  checkOutDatetime: plan?.checkOutDatetime ?? '',
  confirmationNumber: plan?.confirmationNumber ?? '',
  name: plan?.name ?? '',
  notes: plan?.notes ?? '',
  phoneNumber: plan?.phoneNumber ?? '',
  tripId: plan?.tripId ?? defaultTripId,
  website: plan?.website ?? '',
});

export const LodgingForm = ({
  defaultTripId = '',
  onSuccess,
  plan,
  userId,
}: LodgingFormProps) => {
  const { control, handleSubmit, formState } = useForm<LodgingFormValues>({
    defaultValues: toLodgingFormValues(defaultTripId, plan),
    resolver: zodResolver(lodgingFormSchema),
  });
  const checkInDatetime = useWatch({ control, name: 'checkInDatetime' });
  const addLodging = useAddLodgingMutation(userId);
  const updateLodging = useUpdateLodgingMutation(userId);

  const submitForm = async (values: LodgingFormValues) => {
    const lodgingData: NewLodging = {
      address: fieldsToAddress('address', values),
      bookingUrl: optionalText(values.bookingUrl),
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
      website: optionalText(values.website),
    };

    if (plan) {
      await updateLodging.mutateAsync({
        data: toUpdateData(lodgingData),
        id: plan.id,
      });
    } else {
      await addLodging.mutateAsync(lodgingData);
    }
    onSuccess?.();
  };

  return (
    <PlanFormShell
      description="Track the place you are staying and the key check-in details."
      disabled={!userId}
      loading={addLodging.isPending || updateLodging.isPending}
      onSubmit={handleSubmit(submitForm)}
      submitLabel={plan ? 'Save Changes' : 'Add Lodging'}
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
      <ControlledDateTimeInput
        control={control}
        label="Check In"
        minuteInterval={15}
        name="checkInDatetime"
      />
      <ControlledDateTimeInput
        control={control}
        defaultPickerDate={
          checkInDatetime ? new Date(checkInDatetime) : undefined
        }
        label="Check Out"
        minuteInterval={15}
        name="checkOutDatetime"
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
        keyboardType="url"
        label="Website"
        name="website"
        placeholder="Hotel or rental website"
      />
      <ControlledInput
        control={control}
        keyboardType="url"
        label="Booking Link"
        name="bookingUrl"
        placeholder="Manage reservation URL"
      />
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
