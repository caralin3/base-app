import React from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';

import colors from './colors';
import {
  IconSymbol,
  type IconSymbolName,
  type IconSymbolType,
} from './icon-symbol';
import { Text } from './text';

export interface IconPopupMenuItem {
  destructive?: boolean;
  disabled?: boolean;
  iconName?: IconSymbolName;
  label: string;
  onPress: () => void;
}

type Anchor = {
  height: number;
  x: number;
  y: number;
};

interface IconPopupMenuProps {
  accessibilityLabel?: string;
  iconName: IconSymbolName;
  iconType?: IconSymbolType;
  items: IconPopupMenuItem[];
  label?: string;
  menuWidth?: number;
  triggerColor?: string;
  triggerSize?: number;
}

const EDGE_PADDING = 8;
const ITEM_HEIGHT = 50;

export function IconPopupMenu({
  accessibilityLabel = 'Open menu',
  iconName,
  iconType = 'material',
  items,
  label,
  menuWidth = 220,
  triggerColor,
  triggerSize = 24,
}: IconPopupMenuProps) {
  const triggerRef = React.useRef<View>(null);
  const [visible, setVisible] = React.useState(false);
  const [anchor, setAnchor] = React.useState<Anchor | null>(null);

  const dismiss = React.useCallback(() => {
    setVisible(false);
  }, []);

  const open = React.useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({
        height,
        x,
        y,
      });
      setVisible(true);
    });
  }, []);

  const handleItemPress = React.useCallback(
    (item: IconPopupMenuItem) => {
      dismiss();
      item.onPress();
    },
    [dismiss]
  );

  const menuPosition = React.useMemo(() => {
    if (!anchor) {
      return { left: EDGE_PADDING, top: EDGE_PADDING };
    }

    const { width: screenWidth, height: screenHeight } =
      Dimensions.get('window');
    const estimatedMenuHeight = items.length * ITEM_HEIGHT + 16;

    const left = Math.min(
      Math.max(anchor.x - menuWidth + 24, EDGE_PADDING),
      screenWidth - menuWidth - EDGE_PADDING
    );

    const top = Math.min(
      anchor.y + anchor.height + 8,
      screenHeight - estimatedMenuHeight - EDGE_PADDING
    );

    return { left, top };
  }, [anchor, items.length, menuWidth]);

  return (
    <>
      <View ref={triggerRef} collapsable={false}>
        <Pressable
          onPress={open}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          style={styles.trigger}
        >
          <IconSymbol
            name={iconName}
            type={iconType}
            color={triggerColor || colors.white}
            size={triggerSize}
          />
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={dismiss}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismiss}
          accessibilityLabel="Close menu"
        />

        <View
          style={[
            styles.menu,
            {
              left: menuPosition.left,
              top: menuPosition.top,
              width: menuWidth,
            },
          ]}
        >
          {!!label && (
            <View>
              <Text weight="bold">{label}</Text>
            </View>
          )}
          {items.map((item, index) => (
            <Pressable
              key={`${item.label}-${index}`}
              style={({ pressed }) => [
                styles.item,
                pressed ? styles.itemPressed : undefined,
              ]}
              onPress={() => handleItemPress(item)}
              disabled={item.disabled}
              accessibilityRole="menuitem"
              accessibilityState={{ disabled: item.disabled }}
            >
              <View style={styles.itemContent}>
                {item.iconName ? (
                  <IconSymbol
                    name={item.iconName}
                    color={item.destructive ? colors.danger[500] : colors.white}
                    size={18}
                  />
                ) : null}
                <Text
                  style={{
                    color: item.destructive ? colors.danger[500] : colors.white,
                    opacity: item.disabled ? 0.5 : 1,
                  }}
                  weight="semibold"
                >
                  {item.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  item: {
    borderRadius: 6,
    minHeight: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  itemContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 8,
  },
  itemPressed: {
    backgroundColor: colors.charcoal[400],
  },
  menu: {
    backgroundColor: colors.charcoal[300],
    borderColor: colors.charcoal[300],
    borderRadius: 8,
    borderWidth: 1,
    elevation: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  trigger: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
