import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { firebaseDB } from '../config';
import {
  CurrentlyWatchingShowDocument,
  type NewCurrentlyWatchingShowDocument,
} from '../types';
import { FIRESTORE_COLLECTIONS } from './constants';

export const addCurrentlyWatchingShow = async (
  data: NewCurrentlyWatchingShowDocument
) => {
  try {
    const docRef = await addDoc(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS),
      data
    );
    await updateDoc(docRef, {
      documentId: docRef.id,
    });
    const updatedDoc = await getDoc(docRef);
    return CurrentlyWatchingShowDocument.parse(updatedDoc.data());
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const updateCurrentlyWatchingShow = async (
  data: Partial<CurrentlyWatchingShowDocument>,
  id: string
) => {
  try {
    const docRef = doc(
      firebaseDB,
      FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS,
      id
    );
    await updateDoc(docRef, data);
    const updatedDoc = await getDoc(docRef);
    return CurrentlyWatchingShowDocument.parse(updatedDoc.data());
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const deleteCurrentlyWatchingShow = async (documentId: string) => {
  try {
    await deleteDoc(
      doc(
        firebaseDB,
        FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS,
        documentId
      )
    );
    return documentId;
  } catch (e) {
    console.error('Error removing document: ', e);
  }
};

export const getCurrentlyWatchingShows = async (userId: string) => {
  try {
    const q = query(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const currentlyWatching: CurrentlyWatchingShowDocument[] = [];
    querySnapshot.forEach((doc) => {
      currentlyWatching.push(CurrentlyWatchingShowDocument.parse(doc.data()));
    });
    return currentlyWatching;
  } catch (e) {
    console.error('Error fetching currently watching shows: ', e);
    return [];
  }
};
