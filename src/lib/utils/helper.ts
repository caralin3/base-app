import { type LinkProps } from 'expo-router';

import { getTmdbImageUrl } from '../api/tmdb/endpoints';
import {
  type TvSeasonDetailsResponse,
  type TvShowDetails,
} from '../api/tmdb/types';
import {
  type Episode,
  type Genre,
  type Season,
  type Show,
  type ShowRouteParams,
} from '../types';

export const getTmdbUri = (path?: string | null) =>
  path ? getTmdbImageUrl(path) : null;

export const getSeasonsList = (numberOfSeasons: number, showAll: boolean) => {
  const seasons = Array.from({ length: numberOfSeasons }, (_, i) => ({
    label: `Season ${i + 1}`,
    value: i + 1,
  }));
  if (showAll) {
    return [{ label: 'All Seasons', value: 0 }, ...seasons];
  }
  return seasons;
};

export const getShowPosterData = (
  shows: Show[],
  from: ShowRouteParams['fromList'],
  horizontal: boolean = false,
  onFavorite?: (show: Show) => void,
  onWatch?: (id: string) => void
) => {
  return shows.map((show) => {
    let tab = 'Episodes';
    if (from === 'favorites') {
      tab = 'My Episodes';
    } else if (from === 'recommendations') {
      tab = 'More Like This';
    }
    return {
      ...show,
      href: {
        pathname: '/show/[id]',
        params: {
          tab,
          fromList: from,
          id: show.id.toString(),
          name: show.name,
        } as ShowRouteParams,
      } as LinkProps['href'],
      isFavorite: !!show.favoritedAt,
      isWatching: !!show.watchingAt,
      onFavorite: onFavorite ? () => onFavorite(show) : undefined,
      onWatch: onWatch ? () => onWatch(show.id.toString()) : undefined,
      uri: getTmdbUri(horizontal ? show.backdropPath : show.posterPath),
    };
  });
};

export function formatTvShow(show: TvShowDetails, genreList?: Genre[]): Show {
  const genres = genreList ?? show.genres ?? [];

  return {
    genres,
    backdropPath: show.backdrop_path,
    createdBy: show.created_by?.map((creator) => ({
      id: creator.id,
      creditId: creator.credit_id,
      name: creator.name,
      profilePath: creator.profile_path,
    })),
    credits: {
      cast: show.credits?.cast?.map((star) => ({
        adult: star.adult,
        character: star.character,
        creditId: star.credit_id,
        id: star.id,
        knownForDepartment: star.known_for_department,
        name: star.name,
        order: star.order,
        popularity: star.popularity,
        profilePath: star.profile_path,
      })),
    },
    episodeRunTime: show.episode_run_time,
    firstAirDate: show.first_air_date,
    id: show.id,
    lastAirDate: show.last_air_date,
    name: show.name,
    numberOfEpisodes: show.number_of_episodes,
    numberOfSeasons: show.number_of_seasons ?? 0,
    originCountry: show.origin_country,
    overview: show.overview,
    popularity: show.popularity,
    posterPath: show.poster_path,
    productionCompanies: show.production_companies?.map((company) => ({
      id: company.id,
      logoPath: company.logo_path,
      name: company.name,
      originCountry: company.origin_country,
    })),
    status: show.status,
    tagline: show.tagline,
    type: show.type,
    voteAverage: show.vote_average,
    voteCount: show.vote_count,
  };
}

export function formatSeason(season: TvSeasonDetailsResponse): Season {
  return {
    airDate: season.air_date,
    episodes: season.episodes.map((episode) => ({
      airDate: episode.air_date,
      crew: episode.crew?.map((crew) => ({
        adult: crew.adult,
        creditId: crew.credit_id,
        department: crew.department,
        id: crew.id,
        job: crew.job,
        knownForDepartment: crew.known_for_department,
        name: crew.name,
        originalName: crew.original_name,
        popularity: crew.popularity,
        profilePath: crew.profile_path,
      })),
      episodeNumber: episode.episode_number,
      episodeType: episode.episode_type,
      guestStars: episode.guest_stars?.map((star) => ({
        adult: star.adult,
        character: star.character,
        creditId: star.credit_id,
        id: star.id,
        knownForDepartment: star.known_for_department,
        name: star.name,
        order: star.order,
        popularity: star.popularity,
        profilePath: star.profile_path,
      })),
      id: episode.id,
      isFavorite: false,
      name: episode.name,
      overview: episode.overview,
      productionCode: episode.production_code,
      runtime: episode.runtime ?? 0,
      seasonNumber: episode.season_number,
      showId: episode.show_id,
      stillPath: episode.still_path,
      voteAverage: episode.vote_average,
      voteCount: episode.vote_count,
    })),
    id: season.id,
    name: season.name,
    overview: season.overview,
    posterPath: season.poster_path,
    seasonNumber: season.season_number,
  };
}

export function getEpisodes(
  seasonEpisodes: Episode[],
  favoriteEpisodes: Episode[]
): Episode[] {
  return seasonEpisodes.map((episode) => ({
    ...episode,
    isFavorite: !!favoriteEpisodes.find(
      (favEpisode) => favEpisode.id === episode.id
    ),
  }));
}
