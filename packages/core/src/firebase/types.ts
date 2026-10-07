/* eslint-disable @typescript-eslint/no-redeclare */

import { z } from 'zod';

export const Address = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  state: z.string().optional(),
  street1: z.string().optional(),
  street2: z.string().optional(),
});

export type Address = z.infer<typeof Address>;

export const User = z.object({
  address: Address.optional(),
  displayName: z.string().nullable(),
  email: z.email().nullable(),
  id: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().optional(),
});

export type User = z.infer<typeof User>;
