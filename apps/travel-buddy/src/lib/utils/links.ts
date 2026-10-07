import { openBrowserAsync } from 'expo-web-browser';
import { Linking, Platform } from 'react-native';

export const normalizeUrl = (url: string) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

export const displayUrl = (url: string) =>
  url
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/$/, '');

export const openWebsite = (url: string) => openBrowserAsync(normalizeUrl(url));

const mapsBase = () =>
  Platform.OS === 'ios'
    ? 'http://maps.apple.com/'
    : 'https://www.google.com/maps/';

export const openInMaps = (query: string) => {
  const q = encodeURIComponent(query);
  return Linking.openURL(
    Platform.OS === 'ios'
      ? `${mapsBase()}?q=${q}`
      : `${mapsBase()}search/?api=1&query=${q}`
  );
};

export const openDirections = (to: string, from?: string) => {
  const destination = encodeURIComponent(to);
  const origin = from ? encodeURIComponent(from) : '';
  return Linking.openURL(
    Platform.OS === 'ios'
      ? `${mapsBase()}?daddr=${destination}${origin ? `&saddr=${origin}` : ''}`
      : `${mapsBase()}dir/?api=1&destination=${destination}${
          origin ? `&origin=${origin}` : ''
        }`
  );
};
