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

import type { Activity, NewActivity, PlaceStatus } from '@/lib/types/plans';

import { PlanFormShell } from './form-shell';
import {
  addressToFields,
  endAfterStart,
  fieldsToAddress,
  nowIso,
  optionalNumber,
  optionalText,
} from './form-utils';
import { ControlledTripSelect } from './trip-select';

export const placeFormSchema = z
  .object({
    addressCity: z.string().optional(),
    addressCountry: z.string().optional(),
    addressPostalCode: z.string().optional(),
    addressState: z.string().optional(),
    addressStreet1: z.string().optional(),
    addressStreet2: z.string().optional(),
    cost: z
      .string()
      .optional()
      .refine((value) => !value || !Number.isNaN(Number(value)), {
        message: 'Enter a number',
      }),
    datetime: z.string().optional(),
    endDatetime: z.string().optional(),
    name: z.string().min(1, { message: 'Required' }),
    notes: z.string().optional(),
    phoneNumber: z.string().optional(),
    tripId: z.string().optional(),
    website: z.string().optional(),
  })
  .refine(endAfterStart('datetime', 'endDatetime'), {
    message: 'End must be after start',
    path: ['endDatetime'],
  });

export type PlaceFormValues = z.infer<typeof placeFormSchema>;

/** Every place type (activity, food, entertainment, shopping) shares this shape. */
export const toNewPlace = (
  values: PlaceFormValues,
  userId: string,
  status: PlaceStatus = 'planned'
): NewActivity => ({
  address: fieldsToAddress('address', values),
  cost: optionalNumber(values.cost),
  createdAt: nowIso(),
  datetime: status === 'idea' ? '' : optionalText(values.datetime),
  endDatetime: status === 'idea' ? '' : optionalText(values.endDatetime),
  name: values.name,
  notes: optionalText(values.notes),
  phoneNumber: optionalText(values.phoneNumber),
  status,
  tripId: optionalText(values.tripId),
  updatedAt: nowIso(),
  userId,
  website: optionalText(values.website),
});

const toPlaceFormValues = (
  defaultTripId: string,
  plan?: Activity
): PlaceFormValues => ({
  ...addressToFields('address', plan?.address),
  cost: plan?.cost !== undefined ? String(plan.cost) : '',
  datetime: plan?.datetime ?? '',
  endDatetime: plan?.endDatetime ?? '',
  name: plan?.name ?? '',
  notes: plan?.notes ?? '',
  phoneNumber: plan?.phoneNumber ?? '',
  tripId: plan?.tripId ?? defaultTripId,
  website: plan?.website ?? '',
});

type PlaceFormProps = {
  children?: React.ReactNode;
  defaultTripId?: string;
  description: string;
  /** Ideas have no time yet; they are scheduled later from the Ideas tab. */
  isIdea?: boolean;
  loading?: boolean;
  onSubmit: (values: PlaceFormValues) => Promise<void>;
  /** Existing place to edit; the form starts from its values. */
  plan?: Activity;
  submitLabel: string;
  title: string;
  userId: string;
};

export const PlaceForm = ({
  children,
  defaultTripId = '',
  description,
  isIdea = false,
  loading = false,
  onSubmit,
  plan,
  submitLabel,
  title,
  userId,
}: PlaceFormProps) => {
  const { control, handleSubmit, formState } = useForm<PlaceFormValues>({
    defaultValues: toPlaceFormValues(defaultTripId, plan),
    resolver: zodResolver(placeFormSchema),
  });
  const startDatetime = useWatch({ control, name: 'datetime' });

  return (
    <PlanFormShell
      description={description}
      disabled={!userId}
      loading={loading}
      onSubmit={handleSubmit(onSubmit)}
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
      {children}
      {!isIdea && (
        <>
          <ControlledDateTimeInput
            control={control}
            label="Starts"
            name="datetime"
          />
          <ControlledDateTimeInput
            control={control}
            defaultPickerDate={
              startDatetime ? new Date(startDatetime) : undefined
            }
            label="Ends"
            name="endDatetime"
          />
        </>
      )}
      <ControlledTripSelect
        control={control}
        label="Trip"
        name="tripId"
        userId={userId}
      />
      <ControlledInput
        control={control}
        keyboardType="url"
        label="Website"
        name="website"
        placeholder="https://..."
      />
      <ControlledInput
        control={control}
        error={formState.errors.cost?.message}
        keyboardType="decimal-pad"
        label="Cost"
        name="cost"
        placeholder="Optional cost per person"
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
    </PlanFormShell>
  );
};
