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

export const WatchedShowDocument = z.object({
  showId: z.number(),
  documentId: z.string(),
  userId: z.string(),
});

export type WatchedShowDocument = z.infer<typeof WatchedShowDocument>;

export const NewWatchedShowDocument = z.discriminatedUnion('type', [
  WatchedShowDocument.omit({ documentId: true }),
]);

export type NewWatchedShowDocument = z.infer<typeof NewWatchedShowDocument>;

export const WatchlistShowDocument = z.object({
  ...Show.shape,
  documentId: z.string(),
  isFavorite: z.boolean().optional(),
  isWatching: z.boolean().optional(),
  lastViewedSeason: z.number().optional(),
  watched: z.boolean().optional(),
  userId: z.string(),
  addedAt: z.string().optional(),
});

export type WatchlistShowDocument = z.infer<typeof WatchlistShowDocument>;

export const NewWatchlistShowDocument = z.discriminatedUnion('type', [
  WatchlistShowDocument.omit({ documentId: true }),
]);

export type NewWatchlistShowDocument = z.infer<typeof NewWatchlistShowDocument>;

export const ProductionOrderDocument = z.object({
  showId: z.number(),
  seasonProductionOrders: z.array(
    z.object({
      seasonNumber: z.number(),
      episodeIdsInProductionOrder: z.array(z.number()),
    })
  ),
  documentId: z.string(),
  userId: z.string(),
});

export type ProductionOrderDocument = z.infer<typeof ProductionOrderDocument>;

export const NewProductionOrderDocument = ProductionOrderDocument.omit({
  documentId: true,
});

export type NewProductionOrderDocument = z.infer<
  typeof NewProductionOrderDocument
>;
