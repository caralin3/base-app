import { Env } from '../../env';
import {
  type SearchTvQueryParams,
  type TrendingTvQueryParams,
  type TvDetailsQueryParams,
  type TvShowRecommendationsQueryParams,
} from './types';

export const getTmdbApiUrl = (
  path: string,
  additionalParams?: { [key: string]: string }
) => {
  const params = new URLSearchParams();
  params.append('api_key', Env.TMDB_API_KEY ?? '');
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      params.append(key, value);
    });
  }
  const queryString = params.toString();

  return `${Env.TMDB_API_URL}${path}?${queryString}`;
};

export const getTmdbImageUrl = (id: string) =>
  `${Env.TMDB_IMAGE_URL}/t/p/original/${id}`;

export const transformParams = (
  params?: object
): { [key: string]: string } | undefined => {
  if (!params) {
    return;
  }
  const searchParams: { [key: string]: string } = {};
  Object.entries(params).forEach(([key, value]) => {
    searchParams[key] = value.toString();
  });

  return searchParams;
};

export const searchTvUrl = (params: SearchTvQueryParams) =>
  getTmdbApiUrl('/search/tv', transformParams(params));

export const getTvDetailsUrl = (
  seriesId: number,
  params?: TvDetailsQueryParams
) => getTmdbApiUrl(`/tv/${seriesId}`, transformParams(params));

export const getTvSeasonUrl = (
  seriesId: number,
  seasonNumber: number,
  params?: TvDetailsQueryParams
) => getTmdbApiUrl(`/tv/${seriesId}/season/${seasonNumber}`, params);

export const getTvEpisodeUrl = (
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number,
  params?: TvDetailsQueryParams
) =>
  getTmdbApiUrl(
    `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`,
    params
  );

export const getTvShowRecommendationsUrl = (
  seriesId: number,
  params?: TvShowRecommendationsQueryParams
) => getTmdbApiUrl(`/tv/${seriesId}/recommendations`, transformParams(params));

export const getTrendingTvUrl = (
  timeWindow?: 'day' | 'week',
  params?: TrendingTvQueryParams
) => getTmdbApiUrl(`/trending/tv/${timeWindow}`, transformParams(params));

export const getWatchProvidersByShowUrl = (seriesId: number) =>
  getTmdbApiUrl(`/tv/${seriesId}/watch/providers`);
