import { useColorScheme } from 'nativewind';
import React from 'react';
import {
  type GestureResponderEvent,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import colors from './colors';
import { IconSymbol, type IconSymbolName } from './icon-symbol';

type IconButtonProps = {
  icon: IconSymbolName;
  size?: number;
  color?: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  disabled?: boolean;
};

export const IconButton = ({
  icon,
  size = 24,
  color,
  onPress,
  style,
  disabled = false,
}: IconButtonProps) => {
  const { colorScheme } = useColorScheme();
  const defaultColor =
    colorScheme === 'dark' ? colors.neutral[50] : colors.charcoal[800];

  return (
    <Pressable
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <IconSymbol name={icon} size={size} color={color || defaultColor} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    // padding: 8,
    // borderRadius: 24,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  disabled: {
    // opacity: 0.5,
  },
});
