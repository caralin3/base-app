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
import { type NewWatchedShowDocument, WatchedShowDocument } from '../types';
import { FIRESTORE_COLLECTIONS } from './constants';

export const addWatchedShow = async (data: NewWatchedShowDocument) => {
  try {
    const docRef = await addDoc(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.WATCHED_SHOWS),
      data
    );
    await updateDoc(docRef, {
      documentId: docRef.id,
    });
    const updatedDoc = await getDoc(docRef);
    return WatchedShowDocument.parse(updatedDoc.data());
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const updateWatchedShow = async (
  data: Partial<WatchedShowDocument>,
  documentId: string
) => {
  try {
    const docRef = doc(
      firebaseDB,
      FIRESTORE_COLLECTIONS.WATCHED_SHOWS,
      documentId
    );
    await updateDoc(docRef, data);
    const updatedDoc = await getDoc(docRef);
    return WatchedShowDocument.parse(updatedDoc.data());
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const deleteWatchedShow = async (documentId: string) => {
  try {
    await deleteDoc(
      doc(firebaseDB, FIRESTORE_COLLECTIONS.WATCHED_SHOWS, documentId)
    );
    return documentId;
  } catch (e) {
    console.error('Error removing document: ', e);
  }
};

export const getWatchedShows = async (userId: string) => {
  try {
    const q = query(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.WATCHED_SHOWS),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const watchedShows: WatchedShowDocument[] = [];
    querySnapshot.forEach((doc) => {
      watchedShows.push(WatchedShowDocument.parse(doc.data()));
    });
    return watchedShows;
  } catch (e) {
    console.error('Error fetching watched shows: ', e);
    return [];
  }
};

export const getWatchedShowById = async (userId: string, showId: number) => {
  try {
    const q = query(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.WATCHED_SHOWS),
      where('userId', '==', userId),
      where('showId', '==', showId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const docData = querySnapshot.docs[0].data();
    console.log('getWatchedShowById docData', docData);
    return WatchedShowDocument.parse(docData);
  } catch (e) {
    console.error('Error fetching watched show: ', e);
    return null;
  }
};
