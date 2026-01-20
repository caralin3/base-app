import {
  Buttons,
  Colors,
  Inputs,
  Screen,
  ScrollView,
  Typography,
} from '@/components';

export default function Style() {
  return (
    <Screen headerProps={{ title: 'Style' }}>
      <ScrollView className="px-4">
        <Typography />
        <Colors />
        <Buttons />
        <Inputs />
      </ScrollView>
    </Screen>
  );
}
