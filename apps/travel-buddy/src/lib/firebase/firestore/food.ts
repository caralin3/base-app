import { Food, type NewFood } from '@/lib/types/plans';

import { FIRESTORE_COLLECTIONS } from './constants';
import { createFirestoreCollection } from './shared';

const foodCollection = createFirestoreCollection(
  FIRESTORE_COLLECTIONS.FOOD,
  Food
);

export const addFood = (data: NewFood) => foodCollection.addDocument(data);
export const updateFood = foodCollection.updateDocument;
export const deleteFood = foodCollection.deleteDocument;
export const getFoods = foodCollection.getDocuments;
