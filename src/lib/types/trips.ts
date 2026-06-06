/* eslint-disable @typescript-eslint/no-redeclare */

import { z } from 'zod';

export const Trip = z.object({
  coverPhotoUrl: z.string().optional(),
  createdAt: z.string(),
  destination: z.string().optional(),
  endDate: z.string(),
  id: z.string(),
  name: z.string(),
  notes: z.string().optional(),
  startDate: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
});

export type Trip = z.infer<typeof Trip>;
export const NewTrip = Trip.omit({ id: true });
export type NewTrip = z.infer<typeof NewTrip>;
