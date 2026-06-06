import { type NewTrip, Trip } from '@/lib/types/trips';

import { FIRESTORE_COLLECTIONS } from './constants';
import { createFirestoreCollection } from './shared';

const tripCollection = createFirestoreCollection(
  FIRESTORE_COLLECTIONS.TRIPS,
  Trip
);

export const addTrip = (data: NewTrip) => tripCollection.addDocument(data);
export const updateTrip = tripCollection.updateDocument;
export const deleteTrip = tripCollection.deleteDocument;
export const getTrips = tripCollection.getDocuments;
export const getTripById = tripCollection.getDocumentById;
