import { type RefreshControlProps } from 'react-native';

import { PosterList, type PosterProps } from '../poster';
import { Text, View } from '../ui';

interface RecommendedTabContentProps {
  refreshControl?:
    | React.ReactElement<
        RefreshControlProps,
        string | React.JSXElementConstructor<any>
      >
    | undefined;
  shows: PosterProps[] | undefined;
}

export const RecommendedTabContent = ({
  refreshControl,
  shows,
}: RecommendedTabContentProps) => {
  return (
    <PosterList
      inTabPanel
      data={shows ?? []}
      horizontal={false}
      horizontalItem={true}
      ListEmptyComponent={
        <View className="flex-1 px-4 py-8">
          <Text className="text-white" align="center">
            We don&apos;t have any recommendations for this show yet.
          </Text>
          <Text className="text-white" align="center">
            Check back later!
          </Text>
        </View>
      }
      refreshControl={refreshControl}
    />
  );
};
