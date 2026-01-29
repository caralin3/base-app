import { useRouter } from 'expo-router';
import { type PropsWithChildren } from 'react';
import { TouchableOpacity } from 'react-native';

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
  containerClassName?: string;
  right?: {
    icon: {
      color?: string;
      name: IconSymbolName;
      type?: 'community' | 'material';
    };
    onPress: () => void;
  }[];
  showBackButton?: boolean;
  title?: string;
  titleColor?: string;
}

export const Header = ({
  brand,
  children,
  containerClassName,
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
      style={{ backgroundColor }}
      className={`z-[1] flex-row items-center justify-between py-4 shadow-md ${containerClassName ?? 'px-4'}`}
    >
      <View style={{ backgroundColor }} className="flex-row items-center gap-4">
        {showBackButton && (
          <TouchableOpacity onPress={() => router.canGoBack() && router.back()}>
            <IconSymbol size={28} name="arrow.backward" color={color} />
          </TouchableOpacity>
        )}
        <View style={{ backgroundColor }} className="flex-row items-center">
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
            <Text
              style={{ color: titleColor ?? color }}
              className="text-xl font-bold leading-6"
            >
              {title}
            </Text>
          )}
        </View>
      </View>
      {children}
      <View style={{ backgroundColor }} className="flex-row items-center gap-4">
        {right?.length &&
          right.map((rt) => (
            <TouchableOpacity key={rt.icon.name} onPress={rt.onPress}>
              <IconSymbol
                size={28}
                name={rt.icon.name}
                color={rt.icon.color ?? color}
                type={rt.icon.type}
              />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};
