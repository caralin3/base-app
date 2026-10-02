import { Link, type LinkProps } from 'expo-router';
import React from 'react';
import {
  type GestureResponderEvent,
  Pressable,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import colors from './colors';
import {
  IconSymbol,
  type IconSymbolName,
  type IconSymbolType,
} from './icon-symbol';
import { Text } from './text';

type IconButtonProps = {
  color?: string;
  disabled?: boolean;
  href?: LinkProps['href'];
  iconName: IconSymbolName;
  iconType?: IconSymbolType;
  label?: string;
  onPress?: (event: GestureResponderEvent) => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export const IconButton = ({
  disabled = false,
  color,
  href,
  iconName,
  iconType = 'material',
  label,
  onPress,
  size = 24,
  style,
}: IconButtonProps) => {
  const defaultColor = colors.white;
  const pressableStyle = StyleSheet.flatten([
    style,
    disabled ? { opacity: 0.5 } : undefined,
  ]);

  const PressableIcon = (
    <Pressable
      className="flex-row items-center justify-center"
      style={pressableStyle}
      onPress={onPress}
      disabled={disabled}
    >
      {!!label && (
        <Text transform="uppercase" weight="semibold">
          {label}
        </Text>
      )}
      <IconSymbol
        name={iconName}
        size={size}
        color={color || defaultColor}
        type={iconType}
      />
    </Pressable>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        {PressableIcon}
      </Link>
    );
  }

  return PressableIcon;
};
