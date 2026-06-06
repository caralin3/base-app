import { formatISO } from 'date-fns';

import type { Address } from '@/lib/firebase/types';

export const nowIso = () => formatISO(new Date());

export const optionalText = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : '';
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
