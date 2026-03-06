// Fallback for using MaterialIcons on Android and web.

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { type SymbolViewProps, type SymbolWeight } from 'expo-symbols';
import { type ComponentProps } from 'react';
import {
  type OpaqueColorValue,
  type StyleProp,
  type TextStyle,
} from 'react-native';

type IconMapping = Record<
  SymbolViewProps['name'],
  ComponentProps<typeof MaterialIcons>['name']
>;
export type IconSymbolName = keyof typeof MAPPING;
export type IconSymbolType = 'material' | 'community';

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  airplane: 'flight',
  'arrow.backward': 'arrow-back',
  'bag.fill': 'shopping-bag',
  bookmark: 'bookmark-outline',
  'bookmark.fill': 'bookmark',
  calendar: 'calendar-today',
  'car.fill': 'directions-car',
  checklist: 'checklist',
  checkmark: 'check',
  'checkmark.circle': 'check-circle-outline',
  'checkmark.circle.fill': 'check-circle',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.left': 'chevron-left',
  'chevron.right': 'chevron-right',
  creditcard: 'credit-card',
  dollarsign: 'attach-money',
  'square.and.arrow.up': 'exit-to-app',
  heart: 'favorite-outline',
  'heart.fill': 'favorite',
  'house.fill': 'home',
  'figure.walk': 'directions-walk',
  'fork.knife': 'restaurant',
  gearshape: 'settings',
  suitcase: 'luggage',
  magnifyingglass: 'search',
  map: 'map',
  'music.note': 'music-note',
  'paperplane.fill': 'send',
  pencil: 'edit',
  'person.fill': 'person',
  plus: 'add',
  xmark: 'close',
} as IconMapping;

const COMMUNITY_MAPPING = {
  'chevron.down': 'chevron-down',
  'eye.fill': 'eye',
  eye: 'eye-plus-outline',
  'house.fill': 'home-variant',
  'list.bullet.rectangle': 'view-list',
  'list.dash.header.rectangle': 'view-headline',
  'xmark.circle': 'close-circle-outline',
  trash: 'trash-can-outline',
  tv: 'television-classic',
} as Partial<
  Record<
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialCommunityIcons>['name']
  >
>;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  type = 'material',
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  type?: IconSymbolType;
  weight?: SymbolWeight;
}) {
  if (type === 'community') {
    return (
      <MaterialCommunityIcons
        color={color}
        size={size}
        name={COMMUNITY_MAPPING[name]}
        style={style}
      />
    );
  }

  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
