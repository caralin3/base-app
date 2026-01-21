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
import { FavoriteEpisode, type NewFavoriteEpisode } from '../types';
import { FIRESTORE_COLLECTIONS } from './constants';

export const addFavoriteEpisode = async (data: NewFavoriteEpisode) => {
  try {
    const docRef = await addDoc(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.FAVORITE_EPISODES),
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

export const updateFavoriteEpisode = async (
  data: Partial<FavoriteEpisode>,
  documentId: string
) => {
  try {
    await updateDoc(
      doc(firebaseDB, FIRESTORE_COLLECTIONS.FAVORITE_EPISODES, documentId),
      data
    );
    console.log('Document written with ID: ', documentId);
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const deleteFavoriteEpisode = async (documentId: string) => {
  try {
    await deleteDoc(
      doc(firebaseDB, FIRESTORE_COLLECTIONS.FAVORITE_EPISODES, documentId)
    );
    console.log('Document deleted with ID: ', documentId);
  } catch (e) {
    console.error('Error removing document: ', e);
  }
};

export const getFavoriteEpisodes = async (showId: string, userId: string) => {
  try {
    const q = query(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.FAVORITE_EPISODES),
      where('userId', '==', userId),
      where('showId', '==', Number(showId))
    );
    console.log('Querying favorite episodes with:', { showId, userId });
    const querySnapshot = await getDocs(q);
    const favorites: FavoriteEpisode[] = [];
    querySnapshot.forEach((doc) => {
      favorites.push(FavoriteEpisode.parse(doc.data()));
    });
    return favorites;
  } catch (e) {
    console.error('Error fetching favorite episodes: ', e);
    return [];
  }
};
