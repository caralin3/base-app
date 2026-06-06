import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAddTodoMutation } from '@/lib/hooks/use-firestore-collection-hooks';
import type { NewTodo } from '@/lib/firebase/firestore/todos';

import { ControlledInput } from '../ui';
import { PlanFormShell } from './form-shell';
import { ControlledTripSelect } from './trip-select';
import { nowIso, optionalText } from './form-utils';

const todoFormSchema = z.object({
  notes: z.string().optional(),
  title: z.string().min(1, { message: 'Required' }),
  tripId: z.string().optional(),
});

type TodoFormValues = z.infer<typeof todoFormSchema>;

type TodoFormProps = {
  onSuccess?: () => void;
  tripId?: string;
  userId: string;
};

export const TodoForm = ({ onSuccess, tripId, userId }: TodoFormProps) => {
  const { control, handleSubmit, formState } = useForm<TodoFormValues>({
    defaultValues: {
      notes: '',
      title: '',
      tripId: tripId ?? '',
    },
    resolver: zodResolver(todoFormSchema),
  });
  const addTodo = useAddTodoMutation(userId);

  const submitForm = async (values: TodoFormValues) => {
    const todoData: NewTodo = {
      createdAt: nowIso(),
      isCompleted: false,
      notes: optionalText(values.notes),
      title: values.title,
      tripId: tripId ?? optionalText(values.tripId),
      updatedAt: nowIso(),
      userId,
    };

    await addTodo.mutateAsync(todoData);
    onSuccess?.();
  };

  return (
    <PlanFormShell
      description="Capture a task without leaving the current flow."
      disabled={!userId}
      loading={addTodo.isPending}
      onSubmit={handleSubmit(submitForm)}
      submitLabel="Add Todo"
      title="Todo"
    >
      <ControlledInput
        control={control}
        error={formState.errors.title?.message}
        label="Title"
        name="title"
        placeholder="What needs doing?"
        required
      />
      {tripId ? null : (
        <ControlledTripSelect
          control={control}
          label="Trip"
          name="tripId"
          userId={userId}
        />
      )}
      <ControlledInput
        control={control}
        label="Notes"
        multiline
        name="notes"
        numberOfLines={4}
        placeholder="Optional details"
      />
    </PlanFormShell>
  );
};
