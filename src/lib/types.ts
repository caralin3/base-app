/* eslint-disable @typescript-eslint/no-redeclare */
import { z } from 'zod';

export const Genre = z.object({
  id: z.number(),
  name: z.string(),
});

export type Genre = z.infer<typeof Genre>;

export const Creator = z.object({
  creditId: z.string(),
  id: z.number(),
  name: z.string(),
  profilePath: z.string().nullable(),
});

export type Creator = z.infer<typeof Creator>;

export const Company = z.object({
  id: z.number(),
  logoPath: z.string().nullable(),
  name: z.string(),
  originCountry: z.string(),
});

export type Company = z.infer<typeof Company>;

export const Crew = z.object({
  adult: z.boolean(),
  creditId: z.string(),
  department: z.string(),
  id: z.number(),
  job: z.string(),
  knownForDepartment: z.string(),
  name: z.string(),
  originalName: z.string(),
  popularity: z.number(),
  profilePath: z.string().nullable(),
});

export type Crew = z.infer<typeof Crew>;

export const Star = z.object({
  adult: z.boolean().optional(),
  character: z.string(),
  creditId: z.string(),
  id: z.number().optional(),
  knownForDepartment: z.string().optional(),
  name: z.string().optional(),
  order: z.number(),
  popularity: z.number().optional(),
  profilePath: z.string().nullable().optional(),
});

export type Star = z.infer<typeof Star>;

export const Episode = z.object({
  airDate: z.string(),
  crew: z.array(Crew).optional(),
  episodeNumber: z.number(),
  episodeType: z.string().optional(),
  favoritedAt: z.string().optional(),
  guestStars: z.array(Star).optional(),
  id: z.number(),
  isFavorite: z.boolean().optional(),
  name: z.string(),
  overview: z.string(),
  productionCode: z.string().nullable(),
  runtime: z.number(),
  seasonNumber: z.number(),
  showId: z.number(),
  stillPath: z.string().nullable(),
  voteAverage: z.number(),
  voteCount: z.number(),
});

export type Episode = z.infer<typeof Episode>;

export const Season = z.object({
  airDate: z.string().nullable(),
  episodes: z.array(Episode),
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  posterPath: z.string().nullable(),
  seasonNumber: z.number(),
});

export type Season = z.infer<typeof Season>;

export const Show = z.object({
  backdropPath: z.string().nullable().optional(),
  createdBy: z.array(Creator).optional(),
  credits: z
    .object({
      cast: z.array(Star).optional(),
    })
    .optional(),
  episodeRunTime: z.array(z.number()).optional(),
  favoritedAt: z.string().optional(),
  firstAirDate: z.string().nullable().optional(),
  genres: z.array(Genre).optional(),
  id: z.number(),
  lastAirDate: z.string().nullable().optional(),
  name: z.string(),
  numberOfEpisodes: z.number().optional(),
  numberOfSeasons: z.number(),
  originCountry: z.array(z.string()),
  overview: z.string(),
  popularity: z.number(),
  posterPath: z.string().nullable(),
  productionCompanies: z.array(Company).optional(),
  status: z.string().optional(),
  tagline: z.string().nullable().optional(),
  type: z.string().optional(),
  voteAverage: z.number(),
  voteCount: z.number(),
  watchingAt: z.string().optional(),
});

export type Show = z.infer<typeof Show>;

export const ShowRouteFrom = {
  favorites: 'favorites',
  recommendations: 'recommendations',
  search: 'search',
  trending: 'trending',
  watching: 'watching',
} as const;

export type ShowRouteTab = 'Episodes' | 'My Episodes';

export type ShowRouteParams = {
  id: string;
  episodesSeasonNumber?: string;
  fromList: keyof typeof ShowRouteFrom;
  name: string;
  myEpisodesSeasonNumber?: string;
  tab: ShowRouteTab;
};

export type SeasonModalRouteParams = ShowRouteParams & {
  numberOfSeasons: string;
  posterPath: string;
  showAll: string;
};
