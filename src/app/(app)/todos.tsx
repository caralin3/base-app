import { Screen, Text, TodoForm, View } from '@/components';
import { useAuth } from '@/lib/hooks/use-auth';

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
