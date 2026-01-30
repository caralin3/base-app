import { type LinkProps } from 'expo-router';
import { Platform } from 'react-native';

import { IconButton, Text, View } from '../ui';
import { type PosterProps } from './poster';
import { PosterList } from './poster-list';

interface PosterSectionProps {
  isLoading?: boolean;
  posters: PosterProps[];
  title: string;
  viewAllHref?: LinkProps['href'];
}

export const PosterSection = ({
  isLoading,
  posters,
  title,
  viewAllHref,
}: PosterSectionProps) => {
  if (posters.length === 0 && !isLoading) {
    return null;
  }

  return (
    <View className="gap-3">
      {!!viewAllHref ? (
        <View className="flex-row items-center justify-between">
          <Text size="xl" weight="bold">
            {title}
          </Text>
          {posters.length > 0 && (
            <IconButton
              href={viewAllHref}
              label="View All"
              iconName="chevron.right"
              size={Platform.select({
                ios: 16,
                default: 24,
              })}
            />
          )}
        </View>
      ) : (
        <Text size="xl" weight="bold">
          {title}
        </Text>
      )}
      <PosterList data={posters} isLoading={isLoading} />
    </View>
  );
};
