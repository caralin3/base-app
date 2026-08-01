import { differenceInCalendarDays } from 'date-fns/differenceInCalendarDays';
import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet } from 'react-native';

import {
  colors,
  ModalForm,
  Screen,
  ScrollableHeader,
  TabsScrollView,
  TabsView,
  Text,
  useModal,
  View,
} from '@/components';
import {
  FloatingAddPlanModal,
  type FloatingAddPlanModalRef,
  TripTodoForm,
} from '@/components/plans';
import { PackingList } from '@/components/todos/packing-list';
import type { Todo } from '@/lib/firebase/firestore/todos';
import {
  useAuth,
  useGetTripByIdQuery,
  useTodosByTripIdQuery,
  useUpdateTodoMutation,
} from '@/lib/hooks';
import { getCountdownDays, groupByCategory } from '@/lib/utils';

export type TripScreenParams = {
  id: string;
  name: string;
};

export default function TripScreen() {
  const local = useLocalSearchParams<TripScreenParams>();
  const router = useRouter();
  const tripId = local.id;
  const userId = useAuth.use.user()?.id;
  const modal = useModal();
  const addPlanModalRef = useRef<FloatingAddPlanModalRef>(null);

  const { data: tripData, isLoading } = useGetTripByIdQuery(tripId, userId);
  const { data: todosData, isLoading: isLoadingTodos } = useTodosByTripIdQuery(
    userId,
    tripId
  );
  const updateTodo = useUpdateTodoMutation(userId);

  if (isLoading) {
    return (
      <Screen
        headerProps={{
          showBackButton: true,
        }}
      >
        <Text>Loading trip details...</Text>
      </Screen>
    );
  }

  if (!tripData) {
    return (
      <Screen
        headerProps={{
          showBackButton: true,
        }}
      >
        <Text>Sorry, we could not find the trip you are looking for.</Text>
      </Screen>
    );
  }

  const startDate = parseISO(tripData.startDate);
  const endDate = parseISO(tripData.endDate);
  const days = getCountdownDays(startDate);
  const daysToGo = days > 0 ? days : 0;
  const tripLengthDays = Math.max(
    differenceInCalendarDays(endDate, startDate) + 1,
    1
  );
  const packingList = groupByCategory(todosData ?? []);
  const headerImageUri = 'https://picsum.photos/300/200';
  const dateRange = `${format(startDate, 'MM/dd/yy')} - ${format(
    endDate,
    'MM/dd/yy'
  )}`;

  const toggleTodo = async (todo: Todo) => {
    await updateTodo.mutateAsync({
      data: {
        isCompleted: !todo.isCompleted,
        updatedAt: new Date().toISOString(),
      },
      id: todo.id,
    });
  };

  const closeTodoModal = () => modal.dismiss();

  const Header = () => (
    <ScrollableHeader
      backgroundImageUri={headerImageUri}
      height={300}
      onBackPress={() => router.back()}
      style={styles.header}
      className="rounded-t-3xl bg-background dark:bg-background-dark"
      right={[
        {
          icon: {
            name: 'plus',
            color: colors.white,
            backgroundColor: colors.primary[500],
          },
          onPress: () => addPlanModalRef.current?.present(),
        },
      ]}
    >
      <View className="flex-row items-center justify-between gap-4">
        <View className="flex-1">
          <Text className="text-2xl font-bold">{tripData.name}</Text>
          <Text className="text-md mt-2 text-muted dark:text-muted-dark">
            {dateRange}
          </Text>
        </View>
        <View className="min-w-20 items-center justify-center rounded-lg bg-background px-3 py-2 dark:bg-background-dark">
          <Text className="text-2xl font-bold">{daysToGo}</Text>
          <Text className="text-center text-sm font-semibold">
            day{daysToGo === 1 ? '' : 's'} to go
          </Text>
        </View>
      </View>
    </ScrollableHeader>
  );

  return (
    <Screen showHeader={false}>
      <TabsView
        header={Header}
        tabs={[
          {
            name: 'Overview',
            content: (
              <TabsScrollView contentContainerStyle={styles.tabContent}>
                <View className="gap-4 py-4">
                  <View className="rounded-lg bg-surface p-4 dark:bg-surface-dark">
                    <Text className="text-lg font-bold">Trip Details</Text>
                    <View className="mt-4 gap-3">
                      <View>
                        <Text className="text-sm font-semibold text-muted dark:text-muted-dark">
                          Destination
                        </Text>
                        <Text className="text-base">
                          {tripData.destination || 'Not set'}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-sm font-semibold text-muted dark:text-muted-dark">
                          Dates
                        </Text>
                        <Text className="text-base">{dateRange}</Text>
                      </View>
                      <View>
                        <Text className="text-sm font-semibold text-muted dark:text-muted-dark">
                          Clothing
                        </Text>
                        <Text className="text-base">
                          Pack for {tripLengthDays} day
                          {tripLengthDays === 1 ? '' : 's'}.
                        </Text>
                      </View>
                      {!!tripData.notes && (
                        <View>
                          <Text className="text-sm font-semibold text-muted dark:text-muted-dark">
                            Notes
                          </Text>
                          <Text className="text-base">{tripData.notes}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TabsScrollView>
            ),
          },
          {
            name: 'Plan',
            content: (
              <TabsScrollView contentContainerStyle={styles.tabContent}>
                <View className="gap-4 py-4">
                  <View className="rounded-lg bg-surface p-4 dark:bg-surface-dark">
                    <Text className="text-lg font-bold">Plan</Text>
                    <Text className="mt-2 text-muted dark:text-muted-dark">
                      Your trip plans will show here.
                    </Text>
                  </View>
                </View>
              </TabsScrollView>
            ),
          },
          {
            name: 'Packing List',
            content: (
              <TabsScrollView contentContainerStyle={styles.tabContent}>
                <PackingList
                  packingList={packingList}
                  modal={modal}
                  isLoadingTodos={isLoadingTodos}
                  isUpdating={updateTodo.isPending}
                  toggleTodo={toggleTodo}
                />
              </TabsScrollView>
            ),
          },
        ]}
      />
      <ModalForm ref={modal.ref} title="Add Packing Todo" snapPoints={['70%']}>
        <TripTodoForm
          onSuccess={closeTodoModal}
          tripId={tripId}
          userId={userId ?? ''}
        />
      </ModalForm>
      <FloatingAddPlanModal
        ref={addPlanModalRef}
        title="Add Plan"
        showFloatingButton={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tabContent: {
    padding: 20,
  },
});
