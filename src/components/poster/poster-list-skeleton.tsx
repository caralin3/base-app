import { Skeleton, View } from '../ui';

interface PosterListSkeletonProps {
  horizontal?: boolean;
  horizontalItem?: boolean;
}

export const PosterListSkeleton = ({
  horizontal = true,
  horizontalItem = false,
}: PosterListSkeletonProps) => {
  const posterSkeleton = horizontalItem ? (
    <View className="mb-2.5 flex-row items-center gap-2">
      <Skeleton height={75} width={125} />
      <View className="gap-2">
        <Skeleton variant="text" width={150} />
        <Skeleton variant="text" width={50} />
      </View>
    </View>
  ) : (
    <Skeleton className="mr-2.5" height={175} width={115} />
  );

  return (
    <View className={horizontal ? 'flex-row' : undefined}>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index}>{posterSkeleton}</View>
      ))}
    </View>
  );
};
