import React, { useCallback, useMemo } from 'react';

import { type ColorSchemeType, useSelectedTheme } from '@/lib/hooks';

import { Options, type OptionType, useModal } from '../ui';
import { Item } from './item';

export const ThemeItem = () => {
  const { selectedTheme, setSelectedTheme } = useSelectedTheme();
  const modal = useModal();

  const onSelect = useCallback(
    (option: OptionType) => {
      setSelectedTheme(option.value as ColorSchemeType);
      modal.dismiss();
    },
    [setSelectedTheme, modal]
  );

  const themes = useMemo(
    () => [
      { label: `Dark 🌙`, value: 'dark' },
      { label: `Light 🌞`, value: 'light' },
      { label: `System ⚙️`, value: 'system' },
    ],
    []
  );

  const theme = useMemo(
    () => themes.find((t) => t.value === selectedTheme),
    [selectedTheme, themes]
  );

  return (
    <>
      <Item text="Theme" value={theme?.label} onPress={modal.present} />
      <Options
        ref={modal.ref}
        options={themes}
        onSelect={onSelect}
        value={theme?.value}
      />
    </>
  );
};
