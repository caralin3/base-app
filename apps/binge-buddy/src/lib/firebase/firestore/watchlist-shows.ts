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
import { type NewWatchlistShowDocument, WatchlistShowDocument } from '../types';
import { FIRESTORE_COLLECTIONS } from './constants';

export const addWatchlistShow = async (data: NewWatchlistShowDocument) => {
  try {
    const docRef = await addDoc(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.WATCHLIST_SHOWS),
      data
    );
    await updateDoc(docRef, {
      documentId: docRef.id,
    });
    const updatedDoc = await getDoc(docRef);
    return WatchlistShowDocument.parse(updatedDoc.data());
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const updateWatchlistShow = async (
  data: Partial<WatchlistShowDocument>,
  documentId: string
) => {
  try {
    const docRef = doc(
      firebaseDB,
      FIRESTORE_COLLECTIONS.WATCHLIST_SHOWS,
      documentId
    );
    await updateDoc(docRef, data);
    const updatedDoc = await getDoc(docRef);
    return WatchlistShowDocument.parse(updatedDoc.data());
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const deleteWatchlistShow = async (documentId: string) => {
  try {
    await deleteDoc(
      doc(firebaseDB, FIRESTORE_COLLECTIONS.WATCHLIST_SHOWS, documentId)
    );
    return documentId;
  } catch (e) {
    console.error('Error removing document: ', e);
  }
};

export const getWatchlistShows = async (userId: string) => {
  try {
    const q = query(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.WATCHLIST_SHOWS),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const watchlist: WatchlistShowDocument[] = [];
    querySnapshot.forEach((doc) => {
      watchlist.push(WatchlistShowDocument.parse(doc.data()));
    });
    return watchlist;
  } catch (e) {
    console.error('Error fetching watchlist shows: ', e);
    return [];
  }
};
