import { Lodging, type NewLodging } from '@/lib/types/plans';

import { FIRESTORE_COLLECTIONS } from './constants';
import { createFirestoreCollection } from './shared';

const lodgingCollection = createFirestoreCollection(
  FIRESTORE_COLLECTIONS.LODGING,
  Lodging
);

export const addLodging = (data: NewLodging) =>
  lodgingCollection.addDocument(data);
export const updateLodging = lodgingCollection.updateDocument;
export const deleteLodging = lodgingCollection.deleteDocument;
export const getLodgings = lodgingCollection.getDocuments;
