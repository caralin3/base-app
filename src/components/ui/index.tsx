import { cssInterop } from 'nativewind';
import Svg from 'react-native-svg';

export * from './button';
export * from './checkbox';
export * from './collapsible';
export { default as colors } from './colors';
export * from './focus-aware-status-bar';
export * from './icon-button';
export * from './icon-popup-menu';
export * from './icon-symbol';
export * from './image';
export * from './input';
export * from './modal';
export * from './parallax-scrollview';
export * from './progress-bar';
export * from './select';
export * from './separator';
export * from './skeleton';
export * from './text';

// export base components from react-native
export {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
export { SafeAreaView } from 'react-native-safe-area-context';

//Apply cssInterop to Svg to resolve className string into style
cssInterop(Svg, {
  className: {
    target: 'style',
  },
});
