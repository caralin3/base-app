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
import { FavoriteShowDocument, type NewFavoriteShowDocument } from '../types';
import { FIRESTORE_COLLECTIONS } from './constants';

export const addFavoriteShow = async (data: NewFavoriteShowDocument) => {
  try {
    const docRef = await addDoc(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.FAVORITE_SHOWS),
      data
    );
    await updateDoc(docRef, {
      documentId: docRef.id,
    });
    const updatedDoc = await getDoc(docRef);
    return FavoriteShowDocument.parse(updatedDoc.data());
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const updateFavoriteShow = async (
  data: Partial<FavoriteShowDocument>,
  documentId: string
) => {
  try {
    const docRef = doc(
      firebaseDB,
      FIRESTORE_COLLECTIONS.FAVORITE_SHOWS,
      documentId
    );
    await updateDoc(docRef, data);
    const updatedDoc = await getDoc(docRef);
    return FavoriteShowDocument.parse(updatedDoc.data());
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const deleteFavoriteShow = async (documentId: string) => {
  try {
    await deleteDoc(
      doc(firebaseDB, FIRESTORE_COLLECTIONS.FAVORITE_SHOWS, documentId)
    );
    return documentId;
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
    const favorites: FavoriteShowDocument[] = [];
    querySnapshot.forEach((doc) => {
      favorites.push(FavoriteShowDocument.parse(doc.data()));
    });
    return favorites;
  } catch (e) {
    console.error('Error fetching favorite shows: ', e);
    return [];
  }
};
