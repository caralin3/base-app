import { Skeleton, View } from '../ui';

interface EpisodeListSkeletonProps {
  simple?: boolean;
}

export const EpisodeListSkeleton = ({ simple }: EpisodeListSkeletonProps) => {
  if (simple) {
    return (
      <View>
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} className="flex-1 gap-2 pt-4">
            <Skeleton height={75} width={125} />
            <Skeleton variant="text" height={25} />
            <Skeleton variant="text" height={25} width={100} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View>
      {Array.from({ length: 3 }).map((_, index) => (
        <View key={index} className="flex-1 gap-2 pt-4">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1 flex-row items-start gap-2">
              <Skeleton height={75} width={125} />
              <View className="flex-1 gap-2">
                <Skeleton variant="text" height={25} />
                <Skeleton variant="text" width={50} />
              </View>
            </View>
            <View>
              <Skeleton variant="circular" height={26} width={26} />
            </View>
          </View>
          <Skeleton variant="text" height={25} />
          <View className="flex-row justify-end">
            <Skeleton variant="text" height={25} width={100} />
          </View>
        </View>
      ))}
    </View>
  );
};
