import { useIsFocused, useTheme } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform } from 'react-native';

type Props = { hidden?: boolean };
export const FocusAwareStatusBar = ({ hidden = false }: Props) => {
  const isFocused = useIsFocused();
  const theme = useTheme();

  if (Platform.OS === 'web') return null;

  return isFocused ? (
    <StatusBar style={theme.dark ? 'light' : 'dark'} hidden={hidden} />
  ) : null;
};
