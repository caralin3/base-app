import { useAuth } from '@base-app/core';
import { FloatingActionButton, ModalForm, useModal } from '@base-app/ui';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import { type NewTodo } from '@/lib/firebase';
import { useAddTodoMutation } from '@/lib/hooks';
import { defaultTodos } from '@/lib/static-data';

import { ActivityForm } from './activity-form';
import { AddPlanMenu, type PlanType } from './add-plan-menu';
import { EntertainmentForm } from './entertainment-form';
import { FlightForm } from './flight-form';
import { FoodForm } from './food-form';
import { nowIso } from './form-utils';
import { IdeaForm } from './idea-form';
import { LodgingForm } from './lodging-form';
import { ShoppingForm } from './shopping-form';
import { TodoForm } from './todo-form';
import { TransportForm } from './transport-form';
import { TripForm } from './trip-form';

type FloatingAddPlanModalProps = {
  /** Pre-selects the trip on every form, e.g. when opened from a trip screen. */
  defaultTripId?: string;
  showFloatingButton?: boolean;
  title?: string;
};

export type FloatingAddPlanModalRef = {
  dismiss: () => void;
  /** Opens the menu, or jumps straight to one form. */
  present: (form?: PlanType) => void;
};

export const FloatingAddPlanModal = forwardRef<
  FloatingAddPlanModalRef,
  FloatingAddPlanModalProps
>(({ defaultTripId, showFloatingButton = true, title = 'Add a Plan' }, ref) => {
  const modal = useModal();
  const [currentForm, setCurrentForm] = useState<PlanType | 'menu'>('menu');
  const userId = useAuth((state) => state.user?.id || '');
  const addTodo = useAddTodoMutation(userId);

  const dismissForm = useCallback(() => {
    setCurrentForm('menu');
    modal.dismiss();
  }, [modal]);

  const goBack = () => {
    setCurrentForm('menu');
  };

  const createDefaultDataForTrip = async (tripId: string) => {
    defaultTodos.forEach(async (todo) => {
      const todoData: NewTodo = {
        category: todo.category ?? '',
        createdAt: nowIso(),
        isCompleted: false,
        notes: '',
        name: todo.name,
        tripId: tripId,
        updatedAt: nowIso(),
        userId,
      };

      await addTodo.mutateAsync(todoData);
    });
  };

  const onTripCreated = async (tripId: string) => {
    await createDefaultDataForTrip(tripId);
    dismissForm();
  };

  const presentForm = useCallback(
    (form?: PlanType) => {
      setCurrentForm(form ?? 'menu');
      modal.present();
    },
    [modal]
  );

  useImperativeHandle(
    ref,
    () => ({
      dismiss: dismissForm,
      present: presentForm,
    }),
    [dismissForm, presentForm]
  );

  const currentView: Record<
    PlanType | 'menu',
    {
      component: React.ReactNode;
      leftAction?: () => void;
      title: string;
    }
  > = {
    menu: {
      component: <AddPlanMenu onSelect={(value) => setCurrentForm(value)} />,
      title,
    },
    activity: {
      component: (
        <ActivityForm
          defaultTripId={defaultTripId}
          onSuccess={dismissForm}
          userId={userId}
        />
      ),
      leftAction: goBack,
      title: 'Activity',
    },
    entertainment: {
      component: (
        <EntertainmentForm
          defaultTripId={defaultTripId}
          onSuccess={dismissForm}
          userId={userId}
        />
      ),
      leftAction: goBack,
      title: 'Entertainment',
    },
    flight: {
      component: (
        <FlightForm
          defaultTripId={defaultTripId}
          onSuccess={dismissForm}
          userId={userId}
        />
      ),
      leftAction: goBack,
      title: 'Flight',
    },
    food: {
      component: (
        <FoodForm
          defaultTripId={defaultTripId}
          onSuccess={dismissForm}
          userId={userId}
        />
      ),
      leftAction: goBack,
      title: 'Food',
    },
    idea: {
      component: (
        <IdeaForm
          defaultTripId={defaultTripId}
          onSuccess={dismissForm}
          userId={userId}
        />
      ),
      leftAction: goBack,
      title: 'Idea',
    },
    lodging: {
      component: (
        <LodgingForm
          defaultTripId={defaultTripId}
          onSuccess={dismissForm}
          userId={userId}
        />
      ),
      leftAction: goBack,
      title: 'Lodging',
    },
    shopping: {
      component: (
        <ShoppingForm
          defaultTripId={defaultTripId}
          onSuccess={dismissForm}
          userId={userId}
        />
      ),
      leftAction: goBack,
      title: 'Shopping',
    },
    todo: {
      component: (
        <TodoForm
          onSuccess={dismissForm}
          tripId={defaultTripId}
          userId={userId}
        />
      ),
      leftAction: goBack,
      title: 'Todo',
    },
    transport: {
      component: (
        <TransportForm
          defaultTripId={defaultTripId}
          onSuccess={dismissForm}
          userId={userId}
        />
      ),
      leftAction: goBack,
      title: 'Transport',
    },
    trip: {
      component: <TripForm onSuccess={onTripCreated} userId={userId} />,
      leftAction: goBack,
      title: 'Trip',
    },
  };

  return (
    <>
      {showFloatingButton ? (
        <FloatingActionButton name="plus" onPress={() => presentForm()} />
      ) : null}
      <ModalForm
        ref={modal.ref}
        contentContainerStyle={{ gap: currentForm === 'menu' ? 16 : 8 }}
        dismissible={currentForm === 'menu'}
        onLeftActionPress={currentView[currentForm].leftAction}
        snapPoints={currentForm !== 'menu' ? ['95%'] : ['70%', '95%']}
        title={currentView[currentForm].title}
      >
        {currentView[currentForm].component}
      </ModalForm>
    </>
  );
});

FloatingAddPlanModal.displayName = 'FloatingAddPlanModal';
