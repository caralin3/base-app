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
  useAddFlightMutation,
  useUpdateFlightMutation,
} from '@/lib/hooks/use-firestore-collection-hooks';
import type { Flight, NewFlight } from '@/lib/types/plans';

import { PlanFormShell } from './form-shell';
import {
  endAfterStart,
  nowIso,
  optionalText,
  toUpdateData,
} from './form-utils';
import { ControlledTripSelect } from './trip-select';

const flightFormSchema = z
  .object({
    airline: z.string().min(1, { message: 'Required' }),
    arrivalAirportCode: z.string().min(1, { message: 'Required' }),
    arrivalAirportName: z.string().optional(),
    arrivalCity: z.string().min(1, { message: 'Required' }),
    arrivalCountry: z.string().min(1, { message: 'Required' }),
    arrivalDatetime: z.string().min(1, { message: 'Required' }),
    arrivalState: z.string().optional(),
    arrivalTerminal: z.string().optional(),
    arrivalTimezone: z.string().min(1, { message: 'Required' }),
    confirmationNumber: z.string().optional(),
    departureAirportCode: z.string().min(1, { message: 'Required' }),
    departureAirportName: z.string().optional(),
    departureCity: z.string().min(1, { message: 'Required' }),
    departureCountry: z.string().min(1, { message: 'Required' }),
    departureDatetime: z.string().min(1, { message: 'Required' }),
    departureState: z.string().optional(),
    departureTerminal: z.string().optional(),
    departureTimezone: z.string().min(1, { message: 'Required' }),
    duration: z.string().optional(),
    flightNumber: z.string().min(1, { message: 'Required' }),
    notes: z.string().optional(),
    seatType: z.string().optional(),
    tripId: z.string().optional(),
    website: z.string().optional(),
  })
  .refine(endAfterStart('departureDatetime', 'arrivalDatetime'), {
    message: 'Arrival must be after departure',
    path: ['arrivalDatetime'],
  });

type FlightFormValues = z.infer<typeof flightFormSchema>;

type FlightFormProps = {
  defaultTripId?: string;
  onSuccess?: () => void;
  /** Existing flight to edit; omit to create a new one. */
  plan?: Flight;
  userId: string;
};

const toFlightFormValues = (
  defaultTripId: string,
  plan?: Flight
): FlightFormValues => ({
  airline: plan?.airline ?? '',
  arrivalAirportCode: plan?.arrival.airportCode ?? '',
  arrivalAirportName: plan?.arrival.airportName ?? '',
  arrivalCity: plan?.arrival.city ?? '',
  arrivalCountry: plan?.arrival.country ?? '',
  arrivalDatetime: plan?.arrival.datetime ?? '',
  arrivalState: plan?.arrival.state ?? '',
  arrivalTerminal: plan?.arrival.terminal ?? '',
  arrivalTimezone: plan?.arrival.timezone ?? '',
  confirmationNumber: plan?.confirmationNumber ?? '',
  departureAirportCode: plan?.departure.airportCode ?? '',
  departureAirportName: plan?.departure.airportName ?? '',
  departureCity: plan?.departure.city ?? '',
  departureCountry: plan?.departure.country ?? '',
  departureDatetime: plan?.departure.datetime ?? '',
  departureState: plan?.departure.state ?? '',
  departureTerminal: plan?.departure.terminal ?? '',
  departureTimezone: plan?.departure.timezone ?? '',
  duration: plan?.duration !== undefined ? String(plan.duration) : '',
  flightNumber: plan?.flightNumber ?? '',
  notes: plan?.notes ?? '',
  seatType: plan?.departure.seatType ?? '',
  tripId: plan?.tripId ?? defaultTripId,
  website: plan?.website ?? '',
});

export const FlightForm = ({
  defaultTripId = '',
  onSuccess,
  plan,
  userId,
}: FlightFormProps) => {
  const { control, handleSubmit, formState } = useForm<FlightFormValues>({
    defaultValues: toFlightFormValues(defaultTripId, plan),
    resolver: zodResolver(flightFormSchema),
  });
  const departureDatetime = useWatch({ control, name: 'departureDatetime' });
  const addFlight = useAddFlightMutation(userId);
  const updateFlight = useUpdateFlightMutation(userId);

  const submitForm = async (values: FlightFormValues) => {
    const flightData: NewFlight = {
      airline: values.airline,
      arrival: {
        airportCode: values.arrivalAirportCode,
        airportName: optionalText(values.arrivalAirportName),
        city: values.arrivalCity,
        country: values.arrivalCountry,
        datetime: values.arrivalDatetime,
        seatType: optionalText(values.seatType),
        state: optionalText(values.arrivalState),
        terminal: optionalText(values.arrivalTerminal),
        timezone: values.arrivalTimezone,
      },
      confirmationNumber: optionalText(values.confirmationNumber),
      createdAt: nowIso(),
      departure: {
        airportCode: values.departureAirportCode,
        airportName: optionalText(values.departureAirportName),
        city: values.departureCity,
        country: values.departureCountry,
        datetime: values.departureDatetime,
        seatType: optionalText(values.seatType),
        state: optionalText(values.departureState),
        terminal: optionalText(values.departureTerminal),
        timezone: values.departureTimezone,
      },
      duration: values.duration ? Number(values.duration) : undefined,
      flightNumber: values.flightNumber,
      layoverFlightIds: plan?.layoverFlightIds ?? [],
      notes: optionalText(values.notes),
      tripId: optionalText(values.tripId),
      updatedAt: nowIso(),
      userId,
      website: optionalText(values.website),
    };

    if (plan) {
      await updateFlight.mutateAsync({
        data: toUpdateData(flightData),
        id: plan.id,
      });
    } else {
      await addFlight.mutateAsync(flightData);
    }
    onSuccess?.();
  };

  return (
    <PlanFormShell
      description="Capture the departure and arrival details for a flight."
      disabled={!userId}
      loading={addFlight.isPending || updateFlight.isPending}
      onSubmit={handleSubmit(submitForm)}
      submitLabel={plan ? 'Save Changes' : 'Add Flight'}
      title="Flight"
    >
      <ControlledInput
        control={control}
        error={formState.errors.airline?.message}
        label="Airline"
        name="airline"
        placeholder="Airline name"
        required
      />
      <ControlledInput
        control={control}
        error={formState.errors.flightNumber?.message}
        label="Flight Number"
        name="flightNumber"
        placeholder="Flight number"
        required
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
      <ControlledInput
        control={control}
        keyboardType="url"
        label="Website"
        name="website"
        placeholder="Manage booking URL"
      />
      <Separator hideBottomPadding hideTopPadding />
      <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
        Departure
      </Text>
      <View className="gap-3">
        <ControlledInput
          control={control}
          error={formState.errors.departureAirportCode?.message}
          label="Airport Code"
          name="departureAirportCode"
          placeholder="e.g. SFO"
          required
        />
        <ControlledInput
          control={control}
          label="Airport Name"
          name="departureAirportName"
          placeholder="Optional airport name"
        />
        <ControlledInput
          control={control}
          error={formState.errors.departureCity?.message}
          label="City"
          name="departureCity"
          placeholder="City"
          required
        />
        <ControlledInput
          control={control}
          error={formState.errors.departureCountry?.message}
          label="Country"
          name="departureCountry"
          placeholder="Country"
          required
        />
        <ControlledDateTimeInput
          control={control}
          label="Departs"
          name="departureDatetime"
          required
        />
        <ControlledInput
          control={control}
          error={formState.errors.departureTimezone?.message}
          label="Timezone"
          name="departureTimezone"
          placeholder="Timezone abbreviation"
          required
        />
        <ControlledInput
          control={control}
          label="State"
          name="departureState"
          placeholder="Optional state"
        />
        <ControlledInput
          control={control}
          label="Terminal"
          name="departureTerminal"
          placeholder="Optional terminal"
        />
      </View>
      <Separator hideBottomPadding hideTopPadding />
      <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
        Arrival
      </Text>
      <View className="gap-3">
        <ControlledInput
          control={control}
          error={formState.errors.arrivalAirportCode?.message}
          label="Airport Code"
          name="arrivalAirportCode"
          placeholder="e.g. JFK"
          required
        />
        <ControlledInput
          control={control}
          label="Airport Name"
          name="arrivalAirportName"
          placeholder="Optional airport name"
        />
        <ControlledInput
          control={control}
          error={formState.errors.arrivalCity?.message}
          label="City"
          name="arrivalCity"
          placeholder="City"
          required
        />
        <ControlledInput
          control={control}
          error={formState.errors.arrivalCountry?.message}
          label="Country"
          name="arrivalCountry"
          placeholder="Country"
          required
        />
        <ControlledDateTimeInput
          control={control}
          defaultPickerDate={
            departureDatetime ? new Date(departureDatetime) : undefined
          }
          label="Arrives"
          name="arrivalDatetime"
          required
        />
        <ControlledInput
          control={control}
          error={formState.errors.arrivalTimezone?.message}
          label="Timezone"
          name="arrivalTimezone"
          placeholder="Timezone abbreviation"
          required
        />
        <ControlledInput
          control={control}
          label="State"
          name="arrivalState"
          placeholder="Optional state"
        />
        <ControlledInput
          control={control}
          label="Terminal"
          name="arrivalTerminal"
          placeholder="Optional terminal"
        />
      </View>
      <ControlledInput
        control={control}
        label="Seat Type"
        name="seatType"
        placeholder="Optional seat type"
      />
      <ControlledInput
        control={control}
        label="Duration (minutes)"
        name="duration"
        placeholder="Optional numeric duration"
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
