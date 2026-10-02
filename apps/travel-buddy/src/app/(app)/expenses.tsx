import { Screen, Text } from '@base-app/ui';

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
