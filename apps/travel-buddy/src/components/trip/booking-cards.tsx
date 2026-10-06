import {
  IconSymbol,
  type IconSymbolName,
  Text,
  useAppColors,
  View,
} from '@base-app/ui';
import { format } from 'date-fns/format';
import { type ReactNode } from 'react';
import { Pressable } from 'react-native';

import type { EditPlanTarget } from '@/components/plans/edit-plan-modal';
import { type useTripPlans } from '@/lib/hooks';
import { itineraryCategories } from '@/lib/static-data';
import type { Flight, Lodging } from '@/lib/types/plans';
import {
  displayUrl,
  formatFullAddress,
  openInMaps,
  openWebsite,
  parseDateTime,
} from '@/lib/utils';

type TripPlans = ReturnType<typeof useTripPlans>['plans'];
type OnEdit = (target: EditPlanTarget) => void;

const formatDateTime = (value?: string) => {
  const date = parseDateTime(value);
  return date ? format(date, 'EEE, MMM d · h:mm a') : undefined;
};

const Card = ({ children, title }: { children: ReactNode; title: string }) => (
  <View className="rounded-lg bg-surface p-4 dark:bg-surface-dark">
    <Text className="text-lg font-bold">{title}</Text>
    <View className="mt-4 gap-4">{children}</View>
  </View>
);

const EditButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => {
  const appColors = useAppColors();
  return (
    <Pressable
      accessibilityLabel={`Edit ${label}`}
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
    >
      <IconSymbol color={appColors.muted} name="pencil" size={16} />
    </Pressable>
  );
};

const Field = ({
  label,
  selectable,
  value,
}: {
  label: string;
  selectable?: boolean;
  value?: string;
}) =>
  value ? (
    <View>
      <Text className="text-sm font-semibold text-muted dark:text-muted-dark">
        {label}
      </Text>
      <Text className="text-base" selectable={selectable}>
        {value}
      </Text>
    </View>
  ) : null;

const LinkRow = ({
  icon,
  label,
  onPress,
}: {
  icon: IconSymbolName;
  label: string;
  onPress: () => void;
}) => {
  const appColors = useAppColors();
  return (
    <Pressable
      accessibilityRole="link"
      className="flex-row items-center gap-2"
      onPress={onPress}
    >
      <IconSymbol color={appColors.primary} name={icon} size={18} />
      <Text className="flex-1 text-base text-primary dark:text-primary-dark">
        {label}
      </Text>
    </Pressable>
  );
};

const StayDetails = ({ onEdit, stay }: { onEdit?: OnEdit; stay: Lodging }) => {
  const address = formatFullAddress(stay.address);
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2">
        <Text className="flex-1 text-base font-semibold">{stay.name}</Text>
        {onEdit && (
          <EditButton
            label={stay.name}
            onPress={() => onEdit({ id: stay.id, type: 'lodging' })}
          />
        )}
      </View>
      {!!address && (
        <LinkRow
          icon="mappin.and.ellipse"
          label={address}
          onPress={() => openInMaps(`${stay.name}, ${address}`)}
        />
      )}
      <View className="flex-row gap-4">
        <View className="flex-1">
          <Field
            label="Check In"
            value={formatDateTime(stay.checkInDatetime)}
          />
        </View>
        <View className="flex-1">
          <Field
            label="Check Out"
            value={formatDateTime(stay.checkOutDatetime)}
          />
        </View>
      </View>
      <Field
        label="Confirmation"
        selectable
        value={stay.confirmationNumber || undefined}
      />
      <Field label="Phone" selectable value={stay.phoneNumber || undefined} />
    </View>
  );
};

export const StayCard = ({
  lodging,
  onEdit,
}: {
  lodging: Lodging[];
  onEdit?: OnEdit;
}) =>
  lodging.length ? (
    <Card title={lodging.length > 1 ? 'Stays' : 'Stay'}>
      {lodging.map((stay) => (
        <StayDetails key={stay.id} onEdit={onEdit} stay={stay} />
      ))}
    </Card>
  ) : null;

const FlightRow = ({ flight, onEdit }: { flight: Flight; onEdit?: OnEdit }) => (
  <View className="gap-1">
    <View className="flex-row items-center gap-2">
      <Text className="flex-1 text-base font-semibold">
        {flight.departure.airportCode} → {flight.arrival.airportCode}
      </Text>
      {onEdit && (
        <EditButton
          label={`flight ${flight.flightNumber}`}
          onPress={() => onEdit({ id: flight.id, type: 'flight' })}
        />
      )}
    </View>
    <Text className="text-sm text-muted dark:text-muted-dark">
      {[
        formatDateTime(flight.departure.datetime),
        [flight.airline, flight.flightNumber].filter(Boolean).join(' '),
      ]
        .filter(Boolean)
        .join(' · ')}
    </Text>
    {!!flight.confirmationNumber && (
      <Text className="text-sm" selectable>
        Confirmation: {flight.confirmationNumber}
      </Text>
    )}
  </View>
);

export const FlightsCard = ({
  flights,
  onEdit,
}: {
  flights: Flight[];
  onEdit?: OnEdit;
}) => {
  const sorted = [...flights].sort(
    (a, b) =>
      (parseDateTime(a.departure.datetime)?.getTime() ?? 0) -
      (parseDateTime(b.departure.datetime)?.getTime() ?? 0)
  );
  return sorted.length ? (
    <Card title="Flights">
      {sorted.map((flight) => (
        <FlightRow key={flight.id} flight={flight} onEdit={onEdit} />
      ))}
    </Card>
  ) : null;
};

type TripLink = {
  icon: IconSymbolName;
  id: string;
  label: string;
  url: string;
};

/** Links come from the trip's plans, so they are edited on each plan. */
export const collectTripLinks = (plans: TripPlans): TripLink[] => {
  const links: TripLink[] = [];
  const add = (
    id: string,
    name: string,
    icon: IconSymbolName,
    url?: string
  ) => {
    if (url)
      links.push({ icon, id, label: `${name} · ${displayUrl(url)}`, url });
  };

  plans.lodging.forEach((stay) => {
    add(
      `lodging-${stay.id}-website`,
      stay.name,
      'bed.double.fill',
      stay.website
    );
    add(
      `lodging-${stay.id}-booking`,
      `${stay.name} booking`,
      'bed.double.fill',
      stay.bookingUrl
    );
  });
  plans.flights.forEach((flight) =>
    add(
      `flight-${flight.id}`,
      `${flight.departure.airportCode} → ${flight.arrival.airportCode}`,
      'airplane',
      flight.website
    )
  );
  plans.transports.forEach((transport) =>
    add(
      `transport-${transport.id}`,
      transport.name,
      'car.fill',
      transport.website
    )
  );
  (
    [
      ['activity', plans.activities],
      ['entertainment', plans.entertainment],
      ['food', plans.food],
      ['shopping', plans.shopping],
    ] as const
  ).forEach(([type, places]) =>
    places
      // Ideas show their links on the Ideas tab.
      .filter((place) => place.status !== 'idea')
      .forEach((place) =>
        add(
          `${type}-${place.id}`,
          place.name,
          itineraryCategories[type].icon,
          place.website
        )
      )
  );

  return links;
};

export const LinksCard = ({ plans }: { plans: TripPlans }) => {
  const links = collectTripLinks(plans);
  return links.length ? (
    <Card title="Links">
      {links.map((link) => (
        <LinkRow
          key={link.id}
          icon={link.icon}
          label={link.label}
          onPress={() => openWebsite(link.url)}
        />
      ))}
    </Card>
  ) : null;
};

/** Booking details from the sheet's "Booking" tab, shown on the trip Overview. */
export const BookingCards = ({
  onEdit,
  plans,
}: {
  onEdit?: OnEdit;
  plans: TripPlans;
}) => (
  <>
    <StayCard lodging={plans.lodging} onEdit={onEdit} />
    <FlightsCard flights={plans.flights} onEdit={onEdit} />
    <LinksCard plans={plans} />
  </>
);
