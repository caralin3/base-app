/* eslint-disable @typescript-eslint/no-redeclare */

import { z } from 'zod';

export const Traveler = z.object({
  id: z.string(),
  name: z.string(),
  // Optional link to a real account once trips can be shared.
  userId: z.string().optional(),
});

export type Traveler = z.infer<typeof Traveler>;

export const Trip = z.object({
  coverPhotoUrl: z.string().optional(),
  createdAt: z.string(),
  destination: z.string().optional(),
  endDate: z.string(),
  id: z.string(),
  name: z.string(),
  notes: z.string().optional(),
  startDate: z.string(),
  travelers: z.array(Traveler).optional(),
  updatedAt: z.string(),
  userId: z.string(),
});

export type Trip = z.infer<typeof Trip>;
export const NewTrip = Trip.omit({ id: true });
export type NewTrip = z.infer<typeof NewTrip>;
