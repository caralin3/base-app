import { useRouter } from 'expo-router';
import { type PropsWithChildren } from 'react';
import { TouchableOpacity } from 'react-native';

import { colors, IconSymbol, type IconSymbolName, Text, View } from '../ui';

interface HeaderProps extends PropsWithChildren {
  bgColor?: string;
  brand?: boolean;
  containerClassName?: string;
  left?: {
    disabled?: boolean;
    icon: {
      color?: string;
      name: IconSymbolName;
      type?: 'community' | 'material';
    };
    onPress: () => void;
  };
  right?: {
    disabled?: boolean;
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
  bgColor,
  brand,
  children,
  containerClassName,
  left,
  right,
  showBackButton = true,
  title,
  titleColor,
}: HeaderProps) => {
  const router = useRouter();
  const backgroundColor = bgColor ?? colors.charcoal[400];
  const color = colors.white;

  return (
    <View
      style={{ backgroundColor }}
      className={`z-[1] flex-row items-center justify-between py-4 shadow-md ${containerClassName ?? 'px-4'}`}
    >
      <View style={{ backgroundColor }} className="flex-row items-center gap-4">
        {left ? (
          <TouchableOpacity onPress={left.onPress} disabled={left.disabled}>
            <IconSymbol
              size={32}
              name={left.icon.name}
              color={left.icon.color ?? color}
              type={left.icon.type}
            />
          </TouchableOpacity>
        ) : (
          showBackButton && (
            <TouchableOpacity
              onPress={() => router.canGoBack() && router.back()}
            >
              <IconSymbol size={32} name="arrow.backward" color={color} />
            </TouchableOpacity>
          )
        )}
        <View style={{ backgroundColor }} className="flex-row items-center">
          {/* {brand && (
            <Image
              contentFit="cover"
              source={require('../../assets/images/splash-icon.png')}
              className="-ml-4"
              style={{
                width: 60,
                height: 40,
              }}
            />
          )} */}
          {!!title && (
            <Text
              style={{ color: titleColor ?? color }}
              className={`text-2xl font-bold leading-7 ${brand ? '-ml-2' : ''}`}
            >
              {title}
            </Text>
          )}
        </View>
      </View>
      {children}
      <View style={{ backgroundColor }} className="flex-row items-center gap-4">
        {!!right?.length &&
          right.map((rt) => (
            <TouchableOpacity
              key={rt.icon.name}
              onPress={rt.onPress}
              disabled={rt.disabled}
            >
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
