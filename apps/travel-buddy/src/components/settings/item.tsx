import React from 'react';
import { StyleSheet } from 'react-native';

import { useAppColors } from '@/theme/use-app-colors';

import { IconSymbol, type IconSymbolName, Pressable, Text, View } from '../ui';

type ItemProps = {
  text: string;
  value?: string;
  onPress?: () => void;
  icon?: {
    color?: string;
    name: IconSymbolName;
    type?: 'community' | 'material';
  };
};

export const Item = ({ text, value, icon, onPress }: ItemProps) => {
  const isPressable = onPress !== undefined;
  const colors = useAppColors();

  const containerStyle = React.useMemo(
    () => [styles.container, { backgroundColor: colors.surface }],
    [colors.surface]
  );

  return (
    <Pressable
      onPress={onPress}
      pointerEvents={isPressable ? 'auto' : 'none'}
      style={containerStyle}
    >
      <View style={styles.leftSection}>
        {icon && (
          <IconSymbol
            size={24}
            name={icon.name}
            color={icon.color ?? colors.foreground}
            type={icon.type}
          />
        )}
        <Text tx={text} />
      </View>
      <View style={styles.rightSection}>
        <Text>{value}</Text>
        {isPressable && (
          <View style={styles.chevronContainer}>
            <IconSymbol
              name="chevron.right"
              size={24}
              color={colors.foreground}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chevronContainer: {
    paddingLeft: 8,
  },
});
