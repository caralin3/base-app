import { colorScheme, useColorScheme } from 'nativewind';
import { useCallback, useEffect, useState } from 'react';

import { getItem, setItem } from '../storage';

const SELECTED_THEME = 'SELECTED_THEME';
export type ColorSchemeType = 'light' | 'dark' | 'system';
/**
 * this hooks should only be used while selecting the theme
 * This hooks will return the selected theme which is stored in storage
 * selectedTheme should be one of the following values 'light', 'dark' or 'system'
 * don't use this hooks if you want to use it to style your component based on the theme use useColorScheme from nativewind instead
 *
 */
export const useSelectedTheme = () => {
  const { colorScheme: _color, setColorScheme } = useColorScheme();
  const [theme, setTheme] = useState<ColorSchemeType | null>(null);

  useEffect(() => {
    (async () => {
      const value = await getItem<ColorSchemeType>(SELECTED_THEME);
      setTheme(value ?? null);
    })();
  }, []);

  const setValue = async (value: ColorSchemeType) => {
    await setItem(SELECTED_THEME, value);
    setTheme(value);
  };

  const setSelectedTheme = useCallback(
    (t: ColorSchemeType) => {
      setColorScheme(t);
      setValue(t);
    },
    [setColorScheme, setValue]
  );

  const selectedTheme = (theme ?? 'system') as ColorSchemeType;
  return { selectedTheme, setSelectedTheme } as const;
};
// to be used in the root file to load the selected theme from storage
export const loadSelectedTheme = async () => {
  const theme = await getItem<ColorSchemeType>(SELECTED_THEME);
  if (theme !== undefined) {
    colorScheme.set(theme as ColorSchemeType);
  }
};
