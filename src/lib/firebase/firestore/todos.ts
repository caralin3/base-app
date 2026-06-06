/* eslint-disable @typescript-eslint/no-redeclare */

import { z } from 'zod';

import { FIRESTORE_COLLECTIONS } from './constants';
import { createFirestoreCollection } from './shared';

const Todo = z.object({
  createdAt: z.string(),
  id: z.string(),
  isCompleted: z.boolean().default(false),
  notes: z.string().optional(),
  title: z.string(),
  tripId: z.string().optional(),
  updatedAt: z.string(),
  userId: z.string(),
});

export type Todo = z.infer<typeof Todo>;
export const NewTodo = Todo.omit({ id: true });
export type NewTodo = z.infer<typeof NewTodo>;

const todoCollection = createFirestoreCollection(
  FIRESTORE_COLLECTIONS.TODOS,
  Todo
);

export const addTodo = (data: NewTodo) => todoCollection.addDocument(data);
export const updateTodo = todoCollection.updateDocument;
export const deleteTodo = todoCollection.deleteDocument;
export const getTodos = todoCollection.getDocuments;
