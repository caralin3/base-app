import { Flight, type NewFlight } from '@/lib/types/plans';

import { FIRESTORE_COLLECTIONS } from './constants';
import { createFirestoreCollection } from './shared';

const flightCollection = createFirestoreCollection(
  FIRESTORE_COLLECTIONS.FLIGHTS,
  Flight
);

export const addFlight = (data: NewFlight) =>
  flightCollection.addDocument(data);
export const updateFlight = flightCollection.updateDocument;
export const deleteFlight = flightCollection.deleteDocument;
export const getFlights = flightCollection.getDocuments;
