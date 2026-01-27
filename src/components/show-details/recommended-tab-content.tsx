import { PosterList, type PosterProps } from '../poster';
import { TabsScrollView } from '../tabs-view';
import { Text } from '../ui';

interface RecommendedTabContentProps {
  shows: PosterProps[] | undefined;
}

export const RecommendedTabContent = ({
  shows,
}: RecommendedTabContentProps) => {
  if (!shows || shows.length === 0) {
    return (
      <TabsScrollView className="flex-1 px-4 py-8">
        <Text className="text-white" align="center">
          We don&apos;t have any recommendations for this show yet.
        </Text>
        <Text className="text-white" align="center">
          Check back later!
        </Text>
      </TabsScrollView>
    );
  }

  return (
    <PosterList
      inTabPanel
      horizontal={false}
      horizontalItem={true}
      data={shows}
    />
  );
};
