import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { firebaseDB } from '../config';
import { CurrentlyWatchingShow, type NewCurrentlyWatchingShow } from '../types';
import { FIRESTORE_COLLECTIONS } from './constants';

export const addCurrentlyWatchingShow = async (
  data: NewCurrentlyWatchingShow
) => {
  try {
    const docRef = await addDoc(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS),
      data
    );
    await updateDoc(docRef, {
      documentId: docRef.id,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const updateCurrentlyWatchingShow = async (
  data: Partial<CurrentlyWatchingShow>,
  id: string
) => {
  try {
    await updateDoc(
      doc(firebaseDB, FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS, id),
      data
    );
    console.log('Document written with ID: ', id);
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const deleteCurrentlyWatchingShow = async (id: string) => {
  try {
    await deleteDoc(
      doc(firebaseDB, FIRESTORE_COLLECTIONS.CURRENTLY_WATCHING_SHOWS, id)
    );
    console.log('Document deleted with ID: ', id);
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
    const currentlyWatching: CurrentlyWatchingShow[] = [];
    querySnapshot.forEach((doc) => {
      currentlyWatching.push(CurrentlyWatchingShow.parse(doc.data()));
    });
    return currentlyWatching;
  } catch (e) {
    console.error('Error fetching currently watching shows: ', e);
    return [];
  }
};
