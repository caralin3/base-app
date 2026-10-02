import { useColorScheme } from 'nativewind';
import React from 'react';

import { Env } from '@/lib';

import { getAppTheme } from './app-themes';

export function useAppColors() {
  const { colorScheme } = useColorScheme();
  const appTheme = React.useMemo(() => getAppTheme(Env.APP_PROJECT), []);

  return colorScheme === 'dark' ? appTheme.dark : appTheme.light;
}
