import {
  addActivity,
  addEntertainment,
  addFlight,
  addFood,
  addLodging,
  addShopping,
  addTodo,
  addTransport,
  addTrip,
  deleteActivity,
  deleteEntertainment,
  deleteFlight,
  deleteFood,
  deleteLodging,
  deleteShopping,
  deleteTodo,
  deleteTransport,
  deleteTrip,
  FIRESTORE_COLLECTIONS,
  getActivities,
  getEntertainment,
  getFlights,
  getFoods,
  getLodgings,
  getShopping,
  getTodos,
  getTransports,
  getTrips,
  updateActivity,
  updateEntertainment,
  updateFlight,
  updateFood,
  updateLodging,
  updateShopping,
  updateTodo,
  updateTransport,
  updateTrip,
} from '@/lib/firebase/firestore';
import type { NewTodo, Todo } from '@/lib/firebase/firestore/todos';
import type {
  Activity,
  Entertainment,
  Flight,
  Food,
  Lodging,
  NewActivity,
  NewEntertainment,
  NewFlight,
  NewFood,
  NewLodging,
  NewShopping,
  NewTransport,
  Shopping,
  Transport,
} from '@/lib/types/plans';
import type { NewTrip, Trip } from '@/lib/types/trips';

import { createFirestoreCollectionHooks } from './use-firestore-collections';

export const useActivitiesQuery = (userId?: string) =>
  activitiesHooks.useCollectionQuery(userId);
export const useAddActivityMutation = (userId?: string) =>
  activitiesHooks.useCreateMutation(userId);
export const useDeleteActivityMutation = (userId?: string) =>
  activitiesHooks.useDeleteMutation(userId);
export const useUpdateActivityMutation = (userId?: string) =>
  activitiesHooks.useUpdateMutation(userId);

const activitiesHooks = createFirestoreCollectionHooks<Activity, NewActivity>({
  addDocument: addActivity,
  collectionName: FIRESTORE_COLLECTIONS.ACTIVITIES,
  deleteDocument: deleteActivity,
  getDocuments: getActivities,
  updateDocument: updateActivity,
});

export const useEntertainmentQuery = (userId?: string) =>
  entertainmentHooks.useCollectionQuery(userId);
export const useAddEntertainmentMutation = (userId?: string) =>
  entertainmentHooks.useCreateMutation(userId);
export const useDeleteEntertainmentMutation = (userId?: string) =>
  entertainmentHooks.useDeleteMutation(userId);
export const useUpdateEntertainmentMutation = (userId?: string) =>
  entertainmentHooks.useUpdateMutation(userId);

const entertainmentHooks = createFirestoreCollectionHooks<
  Entertainment,
  NewEntertainment
>({
  addDocument: addEntertainment,
  collectionName: FIRESTORE_COLLECTIONS.ENTERTAINMENT,
  deleteDocument: deleteEntertainment,
  getDocuments: getEntertainment,
  updateDocument: updateEntertainment,
});

export const useFlightsQuery = (userId?: string) =>
  flightsHooks.useCollectionQuery(userId);
export const useAddFlightMutation = (userId?: string) =>
  flightsHooks.useCreateMutation(userId);
export const useDeleteFlightMutation = (userId?: string) =>
  flightsHooks.useDeleteMutation(userId);
export const useUpdateFlightMutation = (userId?: string) =>
  flightsHooks.useUpdateMutation(userId);

const flightsHooks = createFirestoreCollectionHooks<Flight, NewFlight>({
  addDocument: addFlight,
  collectionName: FIRESTORE_COLLECTIONS.FLIGHTS,
  deleteDocument: deleteFlight,
  getDocuments: getFlights,
  updateDocument: updateFlight,
});

export const useFoodsQuery = (userId?: string) =>
  foodHooks.useCollectionQuery(userId);
export const useAddFoodMutation = (userId?: string) =>
  foodHooks.useCreateMutation(userId);
export const useDeleteFoodMutation = (userId?: string) =>
  foodHooks.useDeleteMutation(userId);
export const useUpdateFoodMutation = (userId?: string) =>
  foodHooks.useUpdateMutation(userId);

const foodHooks = createFirestoreCollectionHooks<Food, NewFood>({
  addDocument: addFood,
  collectionName: FIRESTORE_COLLECTIONS.FOOD,
  deleteDocument: deleteFood,
  getDocuments: getFoods,
  updateDocument: updateFood,
});

export const useLodgingsQuery = (userId?: string) =>
  lodgingHooks.useCollectionQuery(userId);
export const useAddLodgingMutation = (userId?: string) =>
  lodgingHooks.useCreateMutation(userId);
export const useDeleteLodgingMutation = (userId?: string) =>
  lodgingHooks.useDeleteMutation(userId);
export const useUpdateLodgingMutation = (userId?: string) =>
  lodgingHooks.useUpdateMutation(userId);

const lodgingHooks = createFirestoreCollectionHooks<Lodging, NewLodging>({
  addDocument: addLodging,
  collectionName: FIRESTORE_COLLECTIONS.LODGING,
  deleteDocument: deleteLodging,
  getDocuments: getLodgings,
  updateDocument: updateLodging,
});

export const useShoppingQuery = (userId?: string) =>
  shoppingHooks.useCollectionQuery(userId);
export const useAddShoppingMutation = (userId?: string) =>
  shoppingHooks.useCreateMutation(userId);
export const useDeleteShoppingMutation = (userId?: string) =>
  shoppingHooks.useDeleteMutation(userId);
export const useUpdateShoppingMutation = (userId?: string) =>
  shoppingHooks.useUpdateMutation(userId);

const shoppingHooks = createFirestoreCollectionHooks<Shopping, NewShopping>({
  addDocument: addShopping,
  collectionName: FIRESTORE_COLLECTIONS.SHOPPING,
  deleteDocument: deleteShopping,
  getDocuments: getShopping,
  updateDocument: updateShopping,
});

export const useTodosQuery = (userId?: string) =>
  todoHooks.useCollectionQuery(userId);
export const useTodosByTripIdQuery = (userId?: string, tripId?: string) =>
  todoHooks.useCollectionQuery(userId, {
    scopeKey: tripId,
    select: (todos) => todos.filter((todo) => todo.tripId === tripId),
  });
export const useAddTodoMutation = (userId?: string) =>
  todoHooks.useCreateMutation(userId);
export const useDeleteTodoMutation = (userId?: string) =>
  todoHooks.useDeleteMutation(userId);
export const useUpdateTodoMutation = (userId?: string) =>
  todoHooks.useUpdateMutation(userId);

const todoHooks = createFirestoreCollectionHooks<Todo, NewTodo>({
  addDocument: addTodo,
  collectionName: FIRESTORE_COLLECTIONS.TODOS,
  deleteDocument: deleteTodo,
  getDocuments: getTodos,
  updateDocument: updateTodo,
});

export const useTransportsQuery = (userId?: string) =>
  transportHooks.useCollectionQuery(userId);
export const useAddTransportMutation = (userId?: string) =>
  transportHooks.useCreateMutation(userId);
export const useDeleteTransportMutation = (userId?: string) =>
  transportHooks.useDeleteMutation(userId);
export const useUpdateTransportMutation = (userId?: string) =>
  transportHooks.useUpdateMutation(userId);

const transportHooks = createFirestoreCollectionHooks<Transport, NewTransport>({
  addDocument: addTransport,
  collectionName: FIRESTORE_COLLECTIONS.TRANSPORTS,
  deleteDocument: deleteTransport,
  getDocuments: getTransports,
  updateDocument: updateTransport,
});

export const useTripsQuery = (userId?: string) =>
  tripsHooks.useCollectionQuery(userId);
export const useAddTripMutation = (userId?: string) =>
  tripsHooks.useCreateMutation(userId);
export const useDeleteTripMutation = (userId?: string) =>
  tripsHooks.useDeleteMutation(userId);
export const useUpdateTripMutation = (userId?: string) =>
  tripsHooks.useUpdateMutation(userId);
export const useGetTripByIdQuery = (tripId: string, userId?: string) =>
  tripsHooks.useGetByIdQuery(tripId, userId);

const tripsHooks = createFirestoreCollectionHooks<Trip, NewTrip>({
  addDocument: addTrip,
  collectionName: FIRESTORE_COLLECTIONS.TRIPS,
  deleteDocument: deleteTrip,
  getDocuments: getTrips,
  updateDocument: updateTrip,
});
