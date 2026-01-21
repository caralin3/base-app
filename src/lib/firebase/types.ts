/* eslint-disable @typescript-eslint/no-redeclare */
import { z } from 'zod';

import { Episode, Show } from '../types';

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

export const CurrentlyWatchingShow = z.object({
  ...Show.shape,
  documentId: z.string().optional(),
  lastViewedSeason: z.number().optional(),
  userId: z.string(),
});

export type CurrentlyWatchingShow = z.infer<typeof CurrentlyWatchingShow>;

export const NewCurrentlyWatchingShow = z.discriminatedUnion('type', [
  CurrentlyWatchingShow.omit({ documentId: true }),
]);

export type NewCurrentlyWatchingShow = z.infer<typeof NewCurrentlyWatchingShow>;

export const FavoriteShow = z.object({
  ...Show.shape,
  documentId: z.string().optional(),
  watched: z.boolean().optional(),
  lastViewedSeason: z.number().optional(),
  userId: z.string(),
});

export type FavoriteShow = z.infer<typeof FavoriteShow>;

export const NewFavoriteShow = z.discriminatedUnion('type', [
  FavoriteShow.omit({ documentId: true }),
]);

export type NewFavoriteShow = z.infer<typeof NewFavoriteShow>;

export const FavoriteEpisode = z.object({
  ...Episode.shape,
  documentId: z.string().optional(),
  watched: z.boolean().optional(),
  userId: z.string(),
});

export type FavoriteEpisode = z.infer<typeof FavoriteEpisode>;

export const NewFavoriteEpisode = z.discriminatedUnion('type', [
  FavoriteEpisode.omit({ documentId: true }),
]);

export type NewFavoriteEpisode = z.infer<typeof NewFavoriteEpisode>;
