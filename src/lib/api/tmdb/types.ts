/* eslint-disable @typescript-eslint/no-redeclare */
import { z } from 'zod';

const TvDetailsQueryParams = z.object({
  // https://developer.themoviedb.org/docs/append-to-response
  append_to_response: z.string().optional(), // Comma separated value of additional data to fetch
  language: z.string().optional(), // defaults to 'en-US'
});

export type TvDetailsQueryParams = z.infer<typeof TvDetailsQueryParams>;

const CompanyDetails = z.object({
  id: z.number(),
  logo_path: z.string().nullable(),
  name: z.string(),
  origin_country: z.string(),
});

export type CompanyDetails = z.infer<typeof CompanyDetails>;

const TvSeason = z.object({
  air_date: z.string().nullable(),
  episode_count: z.number(),
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  season_number: z.number(),
  vote_average: z.number(),
  vote_count: z.number().optional(),
});

export type TvSeason = z.infer<typeof TvSeason>;

const TvCrew = z.object({
  adult: z.boolean(), // defaults to true
  credit_id: z.string(),
  department: z.string(),
  gender: z.number().nullable(),
  id: z.number(),
  job: z.string(),
  known_for_department: z.string(),
  name: z.string(),
  original_name: z.string(),
  popularity: z.number(),
  profile_path: z.string().nullable(),
});

export type TvCrew = z.infer<typeof TvCrew>;

export const TvStar = z.object({
  adult: z.boolean().optional(), // defaults to true
  character: z.string(),
  credit_id: z.string(),
  gender: z.number().nullable().optional(),
  id: z.number().optional(),
  known_for_department: z.string().optional(),
  name: z.string().optional(),
  order: z.number(),
  original_name: z.string().optional(),
  popularity: z.number().optional(),
  profile_path: z.string().nullable().optional(),
});

export type TvStar = z.infer<typeof TvStar>;

export const TvEpisodeDetails = z.object({
  air_date: z.string(),
  crew: z.array(TvCrew).optional(),
  episode_number: z.number(),
  episode_type: z.string().optional(),
  guest_stars: z.array(TvStar).optional(),
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  production_code: z.string(),
  runtime: z.number().nullable(),
  season_number: z.number(),
  show_id: z.number(),
  still_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export type TvEpisodeDetails = z.infer<typeof TvEpisodeDetails>;

export const TvShowDetails = z.object({
  adult: z.boolean(), // defaults to true
  backdrop_path: z.string().nullable().optional(),
  created_by: z
    .array(
      z.object({
        id: z.number(),
        credit_id: z.string(),
        name: z.string(),
        gender: z.number().nullable(),
        profile_path: z.string().nullable(),
      })
    )
    .optional(),
  credits: z
    .object({
      cast: z.array(TvStar).optional(),
    })
    .optional(),
  episode_run_time: z.array(z.number()).optional(),
  first_air_date: z.string(),
  genre_ids: z.array(z.number()).optional(), // used in search results
  genres: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .optional(),
  id: z.number(),
  in_production: z.boolean().optional(), // defaults to true
  languages: z.array(z.string()).optional(),
  last_air_date: z.string().nullable().optional(),
  last_episode_to_air: TvEpisodeDetails.nullable().optional(),
  name: z.string(),
  next_episode_to_air: TvEpisodeDetails.nullable().optional(),
  networks: z.array(CompanyDetails).optional(),
  number_of_episodes: z.number().optional(),
  number_of_seasons: z.number().optional(),
  origin_country: z.array(z.string()),
  original_language: z.string().optional(),
  original_name: z.string().optional(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  production_companies: z.array(CompanyDetails).optional(),
  production_countries: z
    .array(
      z.object({
        iso_3166_1: z.string(),
        name: z.string(),
      })
    )
    .optional(),
  seasons: z.array(TvSeason).optional(),
  spoken_languages: z
    .array(
      z.object({
        english_name: z.string(),
        iso_639_1: z.string(),
        name: z.string(),
      })
    )
    .optional(),
  status: z.string().optional(),
  tagline: z.string().nullable().optional(),
  type: z.string().optional(),
  vote_average: z.number(),
  vote_count: z.number(),
});

export type TvShowDetails = z.infer<typeof TvShowDetails>;

export const TvShowDetailsWithRecommendations = TvShowDetails.extend({
  recommendations: z.lazy(() => TvShowRecommendationsResponse).optional(),
});

export const TvSeasonDetailsResponse = z.object({
  _id: z.string(),
  air_date: z.string().nullable(),
  episodes: z.array(TvEpisodeDetails),
  name: z.string(),
  overview: z.string(),
  id: z.number(),
  poster_path: z.string().nullable(),
  season_number: z.number(),
});

export type TvSeasonDetailsResponse = z.infer<typeof TvSeasonDetailsResponse>;

export const TvShowRecommendationsQueryParams = z.object({
  language: z.string().optional(), // defaults to 'en-US'
  page: z.number().optional(), // defaults to 1
});

export type TvShowRecommendationsQueryParams = z.infer<
  typeof TvShowRecommendationsQueryParams
>;

export const TvShowRecommendationsResponse = z.object({
  page: z.number(),
  results: z.array(TvShowDetails),
  total_pages: z.number(),
  total_results: z.number(),
});

export type TvShowRecommendationsResponse = z.infer<
  typeof TvShowRecommendationsResponse
>;

export const TrendingTvQueryParams = z.object({
  language: z.string().optional(), // defaults to 'en-US'
});

export type TrendingTvQueryParams = z.infer<typeof TrendingTvQueryParams>;

export const TrendingTvResponse = z.object({
  page: z.number(),
  results: z.array(TvShowDetails),
  total_pages: z.number(),
  total_results: z.number(),
});

export type TrendingTvResponse = z.infer<typeof TrendingTvResponse>;

const SearchTvQueryParams = z.object({
  query: z.string(),
  first_air_date_year: z.number().optional(), // Search only the first air date. Valid values are: 1000..9999
  include_adult: z.boolean().optional(), // defaults to false
  language: z.string().optional(), // defaults to 'en-US'
  page: z.number().optional(), // defaults to 1
  year: z.number().optional(), // Search the first air date and all episode air dates. Valid values are: 1000..9999
});

export type SearchTvQueryParams = z.infer<typeof SearchTvQueryParams>;

export const SearchTvResponse = z.object({
  page: z.number(),
  results: z.array(TvShowDetails),
  total_pages: z.number(),
  total_results: z.number(),
});

export type SearchTvResponse = z.infer<typeof SearchTvResponse>;

export const WatchProvider = z.object({
  display_priorities: z.record(z.string(), z.number()).optional(),
  display_priority: z.number(),
  logo_path: z.string().nullable(),
  provider_id: z.number(),
  provider_name: z.string(),
});

export type WatchProvider = z.infer<typeof WatchProvider>;

export const WatchProvidersByShowResponse = z.object({
  id: z.number(),
  results: z
    .record(
      z.string(),
      z.object({
        flatrate: z.array(WatchProvider).optional(),
        rent: z.array(WatchProvider).optional(),
        buy: z.array(WatchProvider).optional(),
        ads: z.array(WatchProvider).optional(),
      })
    )
    .optional(),
});

export type WatchProvidersByShowResponse = z.infer<
  typeof WatchProvidersByShowResponse
>;

export const TvProvidersResponse = z.object({
  results: z.array(WatchProvider),
});

export type TvProvidersResponse = z.infer<typeof TvProvidersResponse>;
