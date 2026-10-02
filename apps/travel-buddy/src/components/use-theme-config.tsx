import type { Theme } from '@react-navigation/native';
import {
  DarkTheme as _DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { useColorScheme } from 'nativewind';

import appTheme from '@/theme/app-theme';

const DarkTheme: Theme = {
  ..._DarkTheme,
  colors: {
    ..._DarkTheme.colors,
    primary: appTheme.dark.primary,
    background: appTheme.dark.background,
    text: appTheme.dark.foreground,
    border: appTheme.dark.border,
    card: appTheme.dark.surface,
  },
};

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: appTheme.light.primary,
    background: appTheme.light.background,
    text: appTheme.light.foreground,
    border: appTheme.light.border,
    card: appTheme.light.surface,
  },
};

export function useThemeConfig() {
  const { colorScheme } = useColorScheme();

  if (colorScheme === 'dark') return DarkTheme;

  return LightTheme;
}
