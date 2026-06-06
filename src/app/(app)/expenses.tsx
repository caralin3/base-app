import { Screen, Text } from '@/components';

export default function Expenses() {
  return (
    <Screen
      headerProps={{
        title: 'Expenses',
        showBackButton: false,
      }}
    >
      <Text>Expenses</Text>
    </Screen>
  );
}
