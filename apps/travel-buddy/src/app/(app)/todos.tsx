import { useAuth } from '@base-app/core';
import { Screen, Text, View } from '@base-app/ui';

import { TodoForm } from '@/components';

export default function Todos() {
  const userId = useAuth((state) => state.user?.id ?? '');

  return (
    <Screen
      headerProps={{
        title: 'Todos',
        showBackButton: false,
      }}
    >
      <View className="flex-1 gap-4 p-4">
        <Text className="text-base text-muted dark:text-muted-dark">
          Capture follow-up work and trip tasks.
        </Text>
        <TodoForm userId={userId} />
      </View>
    </Screen>
  );
}
