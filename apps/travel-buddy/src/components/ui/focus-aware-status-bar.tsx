import { useIsFocused, useTheme } from '@react-navigation/native';
import React from 'react';
import { Platform } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';

type Props = { hidden?: boolean };
export const FocusAwareStatusBar = ({ hidden = false }: Props) => {
  const isFocused = useIsFocused();
  const theme = useTheme();

  if (Platform.OS === 'web') return null;

  return isFocused ? (
    <SystemBars style={theme.dark ? 'light' : 'dark'} hidden={hidden} />
  ) : null;
};
