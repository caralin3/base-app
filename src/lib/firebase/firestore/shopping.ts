import { type NewShopping, Shopping } from '@/lib/types/plans';

import { FIRESTORE_COLLECTIONS } from './constants';
import { createFirestoreCollection } from './shared';

const shoppingCollection = createFirestoreCollection(
  FIRESTORE_COLLECTIONS.SHOPPING,
  Shopping
);

export const addShopping = (data: NewShopping) =>
  shoppingCollection.addDocument(data);
export const updateShopping = shoppingCollection.updateDocument;
export const deleteShopping = shoppingCollection.deleteDocument;
export const getShopping = shoppingCollection.getDocuments;
