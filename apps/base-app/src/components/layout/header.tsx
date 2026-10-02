import { useRouter } from 'expo-router';
import { type PropsWithChildren } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useAppColors } from '@/theme/use-app-colors';

import { IconSymbol, type IconSymbolName, Image, Text, View } from '../ui';

interface HeaderProps extends PropsWithChildren {
  bgColor?: string;
  backgroundImageUri?: string;
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

const BG_IMAGE_HEIGHT = 300;

export const Header = ({
  bgColor,
  backgroundImageUri,
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
  const colors = useAppColors();
  const backgroundColor = bgColor ?? colors.surface;
  const color = colors.foreground;
  const resolvedHeight = backgroundImageUri ? BG_IMAGE_HEIGHT : undefined;
  const containerStyle = {
    backgroundColor,
    height: resolvedHeight,
  };

  return (
    <View
      style={containerStyle}
      className={`relative z-[1] flex-row ${backgroundImageUri ? 'items-start' : 'items-center'} justify-between overflow-hidden p-4 ${containerClassName ?? ''}`}
    >
      {!!backgroundImageUri && (
        <>
          <Image
            source={{ uri: backgroundImageUri }}
            contentFit="cover"
            style={styles.backgroundImage}
          />
          <View style={styles.overlay} pointerEvents="none" />
        </>
      )}

      <View className="flex-row items-center gap-4">
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
        <View className="flex-row items-center">
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
      <View className="flex-row items-center gap-4">
        {!!right?.length &&
          right.map((rt, index) => (
            <TouchableOpacity
              key={index}
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

const styles = StyleSheet.create({
  backgroundImage: {
    height: BG_IMAGE_HEIGHT,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
});
