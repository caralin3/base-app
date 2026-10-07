// Fallback for using MaterialIcons on Android and web.

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { type SFSymbol, type SymbolWeight } from 'expo-symbols';
import { type ComponentProps } from 'react';
import {
  type OpaqueColorValue,
  type StyleProp,
  type TextStyle,
} from 'react-native';

type IconMapping = Record<
  SFSymbol,
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
  'arrow.triangle.turn.up.right.diamond': 'directions',
  'bag.fill': 'shopping-bag',
  'bed.double.fill': 'hotel',
  bookmark: 'bookmark-outline',
  'bookmark.fill': 'bookmark',
  calendar: 'calendar-today',
  'car.fill': 'directions-car',
  checklist: 'checklist',
  checkmark: 'check',
  'checkmark.circle': 'check-circle-outline',
  'checkmark.circle.fill': 'check-circle',
  'checkmark.square': 'check-box',
  'chevron.left': 'chevron-left',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  clock: 'schedule',
  creditcard: 'credit-card',
  'doc.on.doc': 'content-copy',
  dollarsign: 'attach-money',
  ellipsis: 'more-vert',
  'figure.walk': 'directions-walk',
  'fork.knife': 'restaurant',
  gearshape: 'settings',
  globe: 'public',
  heart: 'favorite-outline',
  'heart.fill': 'favorite',
  'house.fill': 'home',
  iphone: 'phone-android',
  lightbulb: 'lightbulb-outline',
  'line.3.horizontal': 'drag-indicator',
  link: 'link',
  'list.bullet': 'list',
  magnifyingglass: 'search',
  map: 'map',
  'mappin.and.ellipse': 'place',
  'music.note': 'music-note',
  paintbrush: 'brush',
  'paperplane.fill': 'send',
  pencil: 'edit',
  person: 'person-outline',
  'person.2.fill': 'group',
  'person.fill': 'person',
  'play.circle': 'play-circle-outline',
  plus: 'add',
  sparkles: 'auto-awesome',
  'square.and.arrow.up': 'exit-to-app',
  'square.grid.2x2': 'grid-view',
  suitcase: 'luggage',
  xmark: 'close',
} as IconMapping;

const COMMUNITY_MAPPING = {
  'arrow.up.arrow.down': 'sort',
  'chevron.down': 'chevron-down',
  envelope: 'email-outline',
  'eye.fill': 'eye',
  eye: 'eye-plus-outline',
  'line.3.horizontal.decrease.circle': 'filter',
  'house.fill': 'home-variant',
  'list.bullet.rectangle': 'view-list',
  'list.dash.header.rectangle': 'view-headline',
  slowmo: 'dots-circle',
  trash: 'trash-can-outline',
  tv: 'television-classic',
  'xmark.circle': 'close-circle-outline',
} as Partial<
  Record<SFSymbol, React.ComponentProps<typeof MaterialCommunityIcons>['name']>
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
