import { Env } from '../../env';
import {
  type SearchTvQueryParams,
  SearchTvResponse,
  type TrendingTvQueryParams,
  TrendingTvResponse,
  type TvDetailsQueryParams,
  TvEpisodeDetails,
  TvSeasonDetailsResponse,
  TvShowDetailsWithRecommendations,
  TvShowRecommendationsResponse,
  WatchProvidersByShowResponse,
} from './types';

export async function tmdbRequest(
  path: string,
  params: { [key: string]: string } = {}
) {
  const url = new URL(`${Env.TMDB_API_URL}${path}`);

  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value)
  );

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${Env.TMDB_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB error ${res.status}: ${text}`);
  }

  return res.json();
}

const transformParams = (
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

export const searchTv = async (params: SearchTvQueryParams) => {
  const data = await tmdbRequest(
    '/search/tv',
    transformParams({
      ...params,
      include_adult: true,
    })
  );

  try {
    return SearchTvResponse.parse(data);
  } catch (error) {
    console.error('Search TV', error);
    return Promise.reject(error);
  }
};

export const getTvShowDetails = async (
  seriesId: number,
  params?: TvDetailsQueryParams
) => {
  console.log('Raw TV Show Details:', seriesId); // Log the raw response for debugging
  const data = await tmdbRequest(
    `/tv/${seriesId}`,
    transformParams(params ?? { append_to_response: 'credits,recommendations' })
  );
  try {
    return TvShowDetailsWithRecommendations.parse(data);
  } catch (error) {
    console.error('GetTvShowDetails', error);
    return Promise.reject(error);
  }
};

export const getTvSeason = async (
  seriesId: number,
  seasonNumber: number,
  params?: TvDetailsQueryParams
) => {
  const data = await tmdbRequest(
    `/tv/${seriesId}/season/${seasonNumber}`,
    params
  );

  try {
    return TvSeasonDetailsResponse.parse(data);
  } catch (error) {
    console.error('GetTvSeason', error);
    return Promise.reject(error);
  }
};

export const getTvEpisode = async (
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number,
  params?: TvDetailsQueryParams
) => {
  const data = await tmdbRequest(
    `/tv/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`,
    params
  );

  try {
    return TvEpisodeDetails.parse(data);
  } catch (error) {
    console.error('GetTvEpisode', error);
    return Promise.reject(error);
  }
};

export const getTvShowRecommendations = async (
  seriesId: number,
  params?: TvDetailsQueryParams
) => {
  const data = await tmdbRequest(
    `/tv/${seriesId}/recommendations`,
    transformParams(params)
  );

  try {
    return TvShowRecommendationsResponse.parse(data);
  } catch (error) {
    console.error('GetTvShowRecommendations', error);
    return Promise.reject(error);
  }
};

export const getTrendingTvShows = async (
  timeWindow: 'day' | 'week' = 'day',
  params?: TrendingTvQueryParams
) => {
  const data = await tmdbRequest(
    `/trending/tv/${timeWindow}`,
    transformParams(params)
  );

  try {
    return TrendingTvResponse.parse(data);
  } catch (error) {
    console.error('GetTrendingTvShows', error);
    return Promise.reject(error);
  }
};

export const getWatchProvidersByShow = async (seriesId: number) => {
  const data = await tmdbRequest(`/tv/${seriesId}/watch/providers`);

  try {
    return WatchProvidersByShowResponse.parse(data);
  } catch (error) {
    console.error('GetWatchProviders', error);
    return Promise.reject(error);
  }
};
