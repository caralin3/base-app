import { useColorScheme } from 'nativewind';

import appTheme from './app-theme';

/** Current palette, including the Travel Buddy-only tokens. */
export function useTravelBuddyColors() {
  const { colorScheme } = useColorScheme();

  return colorScheme === 'dark' ? appTheme.dark : appTheme.light;
}
