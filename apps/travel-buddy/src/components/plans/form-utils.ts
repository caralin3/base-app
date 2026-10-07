import { type Address } from '@base-app/core';
import { formatISO } from 'date-fns';

export const nowIso = () => formatISO(new Date());

export const optionalText = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : '';
};

export const optionalNumber = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? undefined : parsed;
};

/** zod refine helper: passes when either side is empty or end > start. */
export const endAfterStart =
  <T extends Record<string, unknown>>(
    startKey: keyof T,
    endKey: keyof T,
    { allowEqual = false }: { allowEqual?: boolean } = {}
  ) =>
  (values: T) => {
    const start = values[startKey];
    const end = values[endKey];
    if (typeof start !== 'string' || typeof end !== 'string') return true;
    if (!start || !end) return true;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return allowEqual ? diff >= 0 : diff > 0;
  };

type AddressFields = {
  city?: string;
  country?: string;
  postalCode?: string;
  state?: string;
  street1?: string;
  street2?: string;
};

export const optionalAddress = (fields: AddressFields): Address | undefined => {
  const address = {
    city: optionalText(fields.city),
    country: optionalText(fields.country),
    postalCode: optionalText(fields.postalCode),
    state: optionalText(fields.state),
    street1: optionalText(fields.street1),
    street2: optionalText(fields.street2),
  };

  return Object.values(address).some(Boolean) ? address : undefined;
};

type AddressFieldKey<P extends string> =
  | `${P}City`
  | `${P}Country`
  | `${P}PostalCode`
  | `${P}State`
  | `${P}Street1`
  | `${P}Street2`;

/** Flattens an address into form fields, e.g. prefix "pickup" → pickupCity. */
export const addressToFields = <P extends string>(
  prefix: P,
  address?: Address
) =>
  ({
    [`${prefix}City`]: address?.city ?? '',
    [`${prefix}Country`]: address?.country ?? '',
    [`${prefix}PostalCode`]: address?.postalCode ?? '',
    [`${prefix}State`]: address?.state ?? '',
    [`${prefix}Street1`]: address?.street1 ?? '',
    [`${prefix}Street2`]: address?.street2 ?? '',
  }) as Record<AddressFieldKey<P>, string>;

/** Inverse of addressToFields; undefined when every field is empty. */
export const fieldsToAddress = <P extends string>(
  prefix: P,
  values: Partial<Record<AddressFieldKey<P>, string>>
) =>
  optionalAddress({
    city: values[`${prefix}City`],
    country: values[`${prefix}Country`],
    postalCode: values[`${prefix}PostalCode`],
    state: values[`${prefix}State`],
    street1: values[`${prefix}Street1`],
    street2: values[`${prefix}Street2`],
  });

/** Turns a create payload into an update payload for an existing document. */
export const toUpdateData = <T extends { createdAt: string; userId: string }>({
  createdAt: _createdAt,
  userId: _userId,
  ...data
}: T) => ({ ...data, updatedAt: nowIso() });
