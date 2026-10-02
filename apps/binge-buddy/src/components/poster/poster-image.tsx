import { colors, IconSymbol, Text, useAppColors, View } from '@base-app/ui';
import { Image, type ImageProps, type ImageStyle } from 'expo-image';
import { type StyleProp, StyleSheet } from 'react-native';

type PosterImageProps = Omit<ImageProps, 'source'> & {
  alt?: string;
  backdrop?: boolean;
  horizontal?: boolean;
  style: StyleProp<ImageStyle>;
  uri: string | null;
};

export const PosterImage = ({
  alt,
  backdrop,
  horizontal,
  style,
  uri,
}: PosterImageProps) => {
  const appColors = useAppColors();
  const backgroundColor = colors.charcoal[400];
  const iconColor = appColors.primary;

  if (uri === null) {
    if (backdrop) {
      return null;
    }

    if (horizontal) {
      return (
        <View
          style={[
            styles.placeholder,
            styles.horizontalPlaceholder,
            { backgroundColor },
          ]}
        >
          <IconSymbol size={40} name="tv" type="community" color={iconColor} />
        </View>
      );
    }

    return (
      <View
        style={[
          styles.placeholder,
          styles.verticalPlaceholder,
          { backgroundColor },
        ]}
      >
        <IconSymbol size={40} name="tv" type="community" color={iconColor} />
        <Text style={styles.altText}>{alt}</Text>
      </View>
    );
  }

  return <Image style={[styles.image, style]} source={{ uri }} />;
};

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  horizontalPlaceholder: {
    height: 140,
    width: 92,
  },
  verticalPlaceholder: {
    height: 175,
    width: 115,
  },
  image: {
    borderRadius: 2,
  },
  altText: {
    textAlign: 'center',
  },
});
