import {
  Buttons,
  Colors,
  Inputs,
  Screen,
  ScrollView,
  Skeleton,
  Title,
  Typography,
  View,
} from '@/components';

export default function Style() {
  return (
    <Screen headerProps={{ title: 'Style' }}>
      <ScrollView className="px-4">
        <Typography />
        <Colors />
        <Buttons />
        <Inputs />
        <Title text="Skeletons" />
        <View className="p-4">
          <Skeleton />
          <Skeleton variant="circular" className="mt-4 size-16" />
        </View>
      </ScrollView>
    </Screen>
  );
}
