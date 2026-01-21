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
import { FavoriteShow, type NewFavoriteShow } from '../types';
import { FIRESTORE_COLLECTIONS } from './constants';

export const addFavoriteShow = async (data: NewFavoriteShow) => {
  try {
    const docRef = await addDoc(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.FAVORITE_SHOWS),
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

export const updateFavoriteShow = async (
  data: Partial<FavoriteShow>,
  documentId: string
) => {
  try {
    await updateDoc(
      doc(firebaseDB, FIRESTORE_COLLECTIONS.FAVORITE_SHOWS, documentId),
      data
    );
    console.log('Document written with ID: ', documentId);
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const deleteFavoriteShow = async (documentId: string) => {
  try {
    await deleteDoc(
      doc(firebaseDB, FIRESTORE_COLLECTIONS.FAVORITE_SHOWS, documentId)
    );
    console.log('Document deleted with ID: ', documentId);
  } catch (e) {
    console.error('Error removing document: ', e);
  }
};

export const getFavoriteShows = async (userId: string) => {
  try {
    const q = query(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.FAVORITE_SHOWS),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const favorites: FavoriteShow[] = [];
    querySnapshot.forEach((doc) => {
      favorites.push(FavoriteShow.parse(doc.data()));
    });
    return favorites;
  } catch (e) {
    console.error('Error fetching favorite shows: ', e);
    return [];
  }
};
