import {
  getTrendingTvUrl,
  getTvDetailsUrl,
  getTvEpisodeUrl,
  getTvSeasonUrl,
  getTvShowRecommendationsUrl,
  getWatchProvidersUrl,
  searchTvUrl,
} from './endpoints';
import {
  type SearchTvQueryParams,
  SearchTvResponse,
  type TrendingTvQueryParams,
  TrendingTvResponse,
  type TvDetailsQueryParams,
  TvEpisodeDetails,
  TvSeasonDetailsResponse,
  TvShowDetails,
  TvShowRecommendationsResponse,
  WatchProvidersResponse,
} from './types';

export const searchTv = async (params: SearchTvQueryParams) => {
  const url = searchTvUrl({ ...params, include_adult: true });

  const response = await fetch(url);
  const errorMessage =
    'Could not fetch search results. Please try again later.';
  if (!response.ok) {
    throw new Error(errorMessage);
  }

  const data = await response.json();

  try {
    return SearchTvResponse.parse(data);
  } catch (error) {
    console.error('Search TV', error);
    return Promise.reject(new Error(errorMessage));
  }
};

export const getTvShowDetails = async (
  seriesId: number,
  params?: TvDetailsQueryParams
) => {
  const url = getTvDetailsUrl(
    seriesId,
    params ?? { append_to_response: 'credits' }
  );

  const response = await fetch(url);
  const errorMessage =
    'Could not fetch tv show details. Please try again later.';
  if (!response.ok) {
    throw new Error(errorMessage);
  }

  const data = await response.json();

  try {
    return TvShowDetails.parse(data);
  } catch (error) {
    console.error('GetTvShowDetails', error);
    return Promise.reject(new Error(errorMessage));
  }
};

export const getTvSeason = async (
  seriesId: number,
  seasonNumber: number,
  params?: TvDetailsQueryParams
) => {
  const url = getTvSeasonUrl(seriesId, seasonNumber, params);

  const response = await fetch(url);
  const errorMessage =
    'Could not fetch tv season details. Please try again later.';
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  const data = await response.json();

  try {
    return TvSeasonDetailsResponse.parse(data);
  } catch (error) {
    console.error('GetTvSeason', error);
    return Promise.reject(new Error(errorMessage));
  }
};

export const getTvEpisode = async (
  seriesId: number,
  seasonNumber: number,
  episodeNumber: number,
  params?: TvDetailsQueryParams
) => {
  const url = getTvEpisodeUrl(seriesId, seasonNumber, episodeNumber, params);

  const response = await fetch(url);
  const errorMessage =
    'Could not fetch tv episode details. Please try again later.';
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  const data = await response.json();

  try {
    return TvEpisodeDetails.parse(data);
  } catch (error) {
    console.error('GetTvEpisode', error);
    return Promise.reject(new Error(errorMessage));
  }
};

export const getTvShowRecommendations = async (
  seriesId: number,
  params?: TvDetailsQueryParams
) => {
  const url = getTvShowRecommendationsUrl(seriesId, params);

  const response = await fetch(url);
  const errorMessage =
    'Could not fetch recommendations. Please try again later.';
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  const data = await response.json();

  try {
    return TvShowRecommendationsResponse.parse(data);
  } catch (error) {
    console.error('GetTvShowRecommendations', error);
    return Promise.reject(new Error(errorMessage));
  }
};

export const getTrendingTvShows = async (
  timeWindow: 'day' | 'week' = 'day',
  params?: TrendingTvQueryParams
) => {
  const url = getTrendingTvUrl(timeWindow, params);

  const response = await fetch(url);
  const errorMessage = 'Could not fetch trending. Please try again later.';
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  const data = await response.json();

  try {
    return TrendingTvResponse.parse(data);
  } catch (error) {
    console.error('GetTrendingTvShows', error);
    return Promise.reject(new Error(errorMessage));
  }
};

export const getWatchProviders = async (seriesId: number) => {
  const url = getWatchProvidersUrl(seriesId);

  const response = await fetch(url);
  const errorMessage =
    'Could not fetch watch providers. Please try again later.';
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  const data = await response.json();

  try {
    return WatchProvidersResponse.parse(data);
  } catch (error) {
    console.error('GetWatchProviders', error);
    return Promise.reject(new Error(errorMessage));
  }
};
