import { View } from 'react-native';

export const Separator = ({
  hideBottomPadding = false,
  hideTopPadding = false,
}: {
  hideBottomPadding?: boolean;
  hideTopPadding?: boolean;
}) => {
  return (
    <View
      className={`my-4 h-px w-full bg-neutral-300 dark:bg-neutral-700 ${hideBottomPadding ? 'mb-0' : ''} ${hideTopPadding ? 'mt-0' : ''}`}
    />
  );
};
