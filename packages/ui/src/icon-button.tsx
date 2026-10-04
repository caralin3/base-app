import { Link, type LinkProps } from 'expo-router';
import React from 'react';
import {
  type GestureResponderEvent,
  Pressable,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import {
  IconSymbol,
  type IconSymbolName,
  type IconSymbolType,
} from './icon-symbol';
import { Text } from './text';
import { useAppColors } from './theme';

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
  const colors = useAppColors();
  const defaultColor = colors.foreground;

  const PressableIcon = (
    <Pressable
      className="flex-row items-center justify-center"
      style={StyleSheet.flatten([style, disabled && { opacity: 0.5 }])}
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
      <Link
        href={href}
        className="flex-row items-center justify-center"
        asChild
      >
        {PressableIcon}
      </Link>
    );
  }

  return PressableIcon;
};
