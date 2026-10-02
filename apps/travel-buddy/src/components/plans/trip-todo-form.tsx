import { TodoForm } from './todo-form';

type TripTodoFormProps = {
  onSuccess?: () => void;
  tripId: string;
  userId: string;
};

export const TripTodoForm = ({
  onSuccess,
  tripId,
  userId,
}: TripTodoFormProps) => {
  return <TodoForm onSuccess={onSuccess} tripId={tripId} userId={userId} />;
};
