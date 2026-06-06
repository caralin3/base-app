import { type NewTransport, Transport } from '@/lib/types/plans';

import { FIRESTORE_COLLECTIONS } from './constants';
import { createFirestoreCollection } from './shared';

const transportCollection = createFirestoreCollection(
  FIRESTORE_COLLECTIONS.TRANSPORTS,
  Transport
);

export const addTransport = (data: NewTransport) =>
  transportCollection.addDocument(data);
export const updateTransport = transportCollection.updateDocument;
export const deleteTransport = transportCollection.deleteDocument;
export const getTransports = transportCollection.getDocuments;
