import { useRouter } from 'expo-router';
import { type PropsWithChildren } from 'react';
import {
  type StyleProp,
  StyleSheet,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native';

import {
  colors,
  IconSymbol,
  type IconSymbolName,
  Image,
  Text,
  View,
} from '../ui';

interface HeaderProps extends PropsWithChildren {
  brand?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  right?: {
    iconName: IconSymbolName;
    iconType?: 'community' | 'material';
    onPress: () => void;
  }[];
  showBackButton?: boolean;
  title?: string;
  titleColor?: string;
}

export const Header = ({
  brand,
  children,
  containerStyle,
  right,
  showBackButton = true,
  title,
  titleColor,
}: HeaderProps) => {
  const router = useRouter();
  const backgroundColor = colors.charcoal[400];
  const color = colors.white;

  return (
    <View
      style={[
        { backgroundColor },
        styles.container,
        containerStyle ?? { paddingHorizontal: 16 },
      ]}
    >
      <View style={[{ backgroundColor }, styles.row]}>
        {showBackButton && (
          <TouchableOpacity onPress={() => router.canGoBack() && router.back()}>
            <IconSymbol size={28} name="arrow.backward" color={color} />
          </TouchableOpacity>
        )}
        <View style={[{ backgroundColor }, styles.brand]}>
          {brand && (
            <Image
              contentFit="cover"
              source={require('../../assets/images/splash-icon.png')}
              style={{
                width: 50,
                height: 40,
              }}
            />
          )}
          {!!title && (
            <Text style={[styles.title, { color: titleColor ?? color }]}>
              {title}
            </Text>
          )}
        </View>
      </View>
      {children}
      <View style={[{ backgroundColor }, styles.row]}>
        {right?.length &&
          right.map((rt) => (
            <TouchableOpacity key={rt.iconName} onPress={rt.onPress}>
              <IconSymbol
                size={28}
                name={rt.iconName}
                color={color}
                type={rt.iconType}
              />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
