import { Text } from '@base-app/ui';

import { Screen } from '@/components';

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
