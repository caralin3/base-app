import { useColorScheme } from 'nativewind';

import { useAppTheme } from './app-theme-provider';

export function useAppColors() {
  const { colorScheme } = useColorScheme();
  const appTheme = useAppTheme();

  return colorScheme === 'dark' ? appTheme.dark : appTheme.light;
}
