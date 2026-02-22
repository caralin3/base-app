import React, { type PropsWithChildren, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import colors from './colors';
import { IconSymbol } from './icon-symbol';
import { Text } from './text';

interface CollapsibleProps extends PropsWithChildren {
  contentClassName?: string;
  rightAction?: React.ReactElement;
  title: string;
}

export function Collapsible({
  children,
  contentClassName,
  rightAction,
  title,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <View className="flex-row items-start justify-between gap-1.5">
        <TouchableOpacity
          className="flex-1 flex-row items-start gap-1.5"
          onPress={() => setIsOpen((value) => !value)}
          activeOpacity={0.8}
        >
          <IconSymbol
            name="chevron.right"
            size={18}
            weight="medium"
            color={colors.white}
            style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
          />

          <Text weight="semibold" className="flex-1">
            {title}
          </Text>
        </TouchableOpacity>
        {rightAction}
      </View>
      {isOpen && (
        <View className={`ml-6 mt-1.5 ${contentClassName ?? ''}`}>
          {children}
        </View>
      )}
    </View>
  );
}
