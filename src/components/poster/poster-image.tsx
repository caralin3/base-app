import { Image, type ImageProps, type ImageStyle } from 'expo-image';
import { type StyleProp } from 'react-native';

import { colors, IconSymbol, Text, View } from '../ui';

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
  const backgroundColor = colors.charcoal[400];
  const iconColor = colors.primary[600];

  if (uri === null) {
    if (backdrop) {
      return null;
    }

    if (horizontal) {
      return (
        <View
          className="items-center justify-center gap-2 p-4"
          style={[{ backgroundColor, height: 75, width: 125 }]}
        >
          <IconSymbol size={40} name="tv" type="community" color={iconColor} />
        </View>
      );
    }

    return (
      <View
        className="items-center justify-center gap-2 p-4"
        style={[{ backgroundColor, height: 175, width: 115 }]}
      >
        <IconSymbol size={40} name="tv" type="community" color={iconColor} />
        <Text align="center">{alt}</Text>
      </View>
    );
  }

  return <Image className="rounded-sm" source={{ uri }} style={style} />;
};
