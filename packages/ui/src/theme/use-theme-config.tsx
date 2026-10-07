import {
  DarkTheme as _DarkTheme,
  DefaultTheme,
  type Theme,
} from 'expo-router/react-navigation';
import { useColorScheme } from 'nativewind';
import { useMemo } from 'react';

import { type AppTheme, type ThemePalette } from './types';

function toNavigationTheme(base: Theme, palette: ThemePalette): Theme {
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.primary,
      background: palette.background,
      text: palette.foreground,
      border: palette.border,
      card: palette.surface,
    },
  };
}

/**
 * React Navigation theme for the current color scheme.
 * Takes the palette directly because the root layout calls it before
 * AppThemeProvider is mounted.
 */
export function useThemeConfig(appTheme: AppTheme) {
  const { colorScheme } = useColorScheme();

  return useMemo(
    () =>
      colorScheme === 'dark'
        ? toNavigationTheme(_DarkTheme, appTheme.dark)
        : toNavigationTheme(DefaultTheme, appTheme.light),
    [appTheme, colorScheme]
  );
}
