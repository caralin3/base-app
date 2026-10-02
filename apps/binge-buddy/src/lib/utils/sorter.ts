import { type Episode } from '../types';

// Sort episodes by season and episode number ascending
export function sortEpisodeBySeason(episode1: Episode, episode2: Episode) {
  if (episode1.seasonNumber < episode2.seasonNumber) return -1;
  if (episode1.seasonNumber > episode2.seasonNumber) return 1;
  if (episode1.episodeNumber < episode2.episodeNumber) return -1;
  if (episode1.episodeNumber > episode2.episodeNumber) return 1;
  return 0;
}

export function sortByDate(d1: string, d2: string, dir: 'asc' | 'desc') {
  const date1 = new Date(d1);
  const date2 = new Date(d2);

  if (dir === 'desc') return date2.getTime() - date1.getTime();
  return date1.getTime() - date2.getTime();
}
