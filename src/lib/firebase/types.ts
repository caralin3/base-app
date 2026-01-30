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

export const CurrentlyWatchingShowDocument = z.object({
  ...Show.shape,
  documentId: z.string(),
  isFavorite: z.boolean().optional(),
  isWatching: z.boolean().optional(),
  lastViewedSeason: z.number().optional(),
  watched: z.boolean().optional(),
  userId: z.string(),
});

export type CurrentlyWatchingShowDocument = z.infer<
  typeof CurrentlyWatchingShowDocument
>;

export const NewCurrentlyWatchingShowDocument = z.discriminatedUnion('type', [
  CurrentlyWatchingShowDocument.omit({ documentId: true }),
]);

export type NewCurrentlyWatchingShowDocument = z.infer<
  typeof NewCurrentlyWatchingShowDocument
>;

export const FavoriteShowDocument = z.object({
  ...Show.shape,
  documentId: z.string(),
  isFavorite: z.boolean().optional(),
  isWatching: z.boolean().optional(),
  lastViewedSeason: z.number().optional(),
  watched: z.boolean().optional(),
  userId: z.string(),
});

export type FavoriteShowDocument = z.infer<typeof FavoriteShowDocument>;

export const NewFavoriteShowDocument = z.discriminatedUnion('type', [
  FavoriteShowDocument.omit({ documentId: true }),
]);

export type NewFavoriteShowDocument = z.infer<typeof NewFavoriteShowDocument>;

export const FavoriteEpisodeDocument = z.object({
  ...Episode.shape,
  documentId: z.string(),
  watched: z.boolean().optional(),
  userId: z.string(),
});

export type FavoriteEpisodeDocument = z.infer<typeof FavoriteEpisodeDocument>;

export const NewFavoriteEpisodeDocument = z.discriminatedUnion('type', [
  FavoriteEpisodeDocument.omit({ documentId: true }),
]);

export type NewFavoriteEpisodeDocument = z.infer<
  typeof NewFavoriteEpisodeDocument
>;
