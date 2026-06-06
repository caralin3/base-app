import { Entertainment, type NewEntertainment } from '@/lib/types/plans';

import { FIRESTORE_COLLECTIONS } from './constants';
import { createFirestoreCollection } from './shared';

const entertainmentCollection = createFirestoreCollection(
  FIRESTORE_COLLECTIONS.ENTERTAINMENT,
  Entertainment
);

export const addEntertainment = (data: NewEntertainment) =>
  entertainmentCollection.addDocument(data);
export const updateEntertainment = entertainmentCollection.updateDocument;
export const deleteEntertainment = entertainmentCollection.deleteDocument;
export const getEntertainment = entertainmentCollection.getDocuments;
