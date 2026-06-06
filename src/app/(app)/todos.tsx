import { Screen, Text } from '@/components';

export default function Todos() {
  return (
    <Screen
      headerProps={{
        title: 'Todos',
        showBackButton: false,
      }}
    >
      <Text>Todos</Text>
    </Screen>
  );
}
