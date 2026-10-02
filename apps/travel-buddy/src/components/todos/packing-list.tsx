import { useMemo } from 'react';

import { type Todo } from '@/lib/firebase';

import {
  Button,
  Checkbox,
  ProgressBar,
  Text,
  type useModal,
  View,
} from '../ui';

interface PackingListProps {
  isLoadingTodos: boolean;
  isUpdating?: boolean;
  modal: ReturnType<typeof useModal>;
  packingList: Record<string, Todo[]>;
  toggleTodo: (todo: Todo) => void;
}

export const PackingList = ({
  isLoadingTodos,
  isUpdating,
  modal,
  packingList,
  toggleTodo,
}: PackingListProps) => {
  const checkedCount = Object.values(packingList)
    .flat()
    .filter((todo) => todo.isCompleted).length;
  const totalCount = Object.values(packingList).flat().length;
  const sortedPackingList: Record<string, Todo[]> = useMemo(() => {
    const sortedByCategory = Object.keys(packingList).sort((a, b) =>
      b.localeCompare(a)
    );
    const sorted: Record<string, Todo[]> = {};
    sortedByCategory.forEach((key) => {
      sorted[key] = packingList[key];
    });
    return sorted;
  }, [packingList]);

  return (
    <View className="gap-4 p-4">
      <View className="flex-1">
        <Text className="text-muted dark:text-muted-dark">
          {isLoadingTodos
            ? 'Loading packing items...'
            : Object.keys(packingList).length === 0
              ? 'No packing items are linked to this trip yet.'
              : null}
        </Text>

        <Text className="text-muted dark:text-muted-dark">
          {checkedCount} of {totalCount} items completed
        </Text>
        <ProgressBar
          initialProgress={totalCount ? checkedCount / totalCount : 0}
        />
      </View>
      <Button label="Add Todo" size="sm" onPress={modal.present} />
      {Object.keys(sortedPackingList).map((key) => (
        <View key={key} className="gap-2">
          <Text className="text-md font-semibold">{key}</Text>
          {sortedPackingList[key].map((todo) => (
            <View
              key={todo.id}
              className="flex-row items-center gap-3 rounded-lg bg-surface p-4 dark:bg-surface-dark"
            >
              <View className="flex-1">
                <Text
                  className={
                    todo.isCompleted
                      ? 'text-base text-muted line-through dark:text-muted-dark'
                      : 'text-base'
                  }
                >
                  {todo.name}
                </Text>
                {!!todo.notes && (
                  <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
                    {todo.notes}
                  </Text>
                )}
              </View>
              <Checkbox.Root
                accessibilityLabel={`Mark ${todo.name} as ${todo.isCompleted ? 'incomplete' : 'complete'}`}
                checked={todo.isCompleted}
                disabled={isUpdating}
                onChange={() => toggleTodo(todo)}
              >
                <Checkbox.Icon checked={todo.isCompleted} />
              </Checkbox.Root>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};
