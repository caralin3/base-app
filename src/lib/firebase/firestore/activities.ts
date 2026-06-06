import { Activity, type NewActivity } from '@/lib/types/plans';

import { FIRESTORE_COLLECTIONS } from './constants';
import { createFirestoreCollection } from './shared';

const activityCollection = createFirestoreCollection(
  FIRESTORE_COLLECTIONS.ACTIVITIES,
  Activity
);

export const addActivity = (data: NewActivity) =>
  activityCollection.addDocument(data);
export const updateActivity = activityCollection.updateDocument;
export const deleteActivity = activityCollection.deleteDocument;
export const getActivities = activityCollection.getDocuments;
