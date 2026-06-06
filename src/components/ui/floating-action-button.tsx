import React from 'react';
import {
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
  StyleSheet,
  View,
} from 'react-native';

import { useAppColors } from '@/theme/use-app-colors';

import { IconSymbol, type IconSymbolName } from './icon-symbol';

type FloatingActionButtonProps = Omit<PressableProps, 'children'> & {
  iconColor?: string;
  name?: IconSymbolName;
  onPress?: (event: GestureResponderEvent) => void;
  size?: number;
};

export const FloatingActionButton = ({
  iconColor,
  name = 'plus',
  onPress,
  size = 24,
  style,
  ...props
}: FloatingActionButtonProps) => {
  const colors = useAppColors();

  return (
    <Pressable
      accessibilityLabel="Add item"
      accessibilityRole="button"
      className="absolute bottom-6 right-6 z-50 size-14 items-center justify-center rounded-full"
      onPress={onPress}
      style={[
        style,
        {
          backgroundColor: colors.primary,
          ...styles.shadow,
        },
      ]}
      {...props}
    >
      <View className="items-center justify-center">
        <IconSymbol
          color={iconColor || colors.background}
          name={name}
          size={size}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  shadow: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
});
