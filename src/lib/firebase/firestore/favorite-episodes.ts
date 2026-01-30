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
  FavoriteEpisodeDocument,
  type NewFavoriteEpisodeDocument,
} from '../types';
import { FIRESTORE_COLLECTIONS } from './constants';

export const addFavoriteEpisode = async (data: NewFavoriteEpisodeDocument) => {
  try {
    const docRef = await addDoc(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.FAVORITE_EPISODES),
      data
    );
    await updateDoc(docRef, {
      documentId: docRef.id,
    });
    const updatedDoc = await getDoc(docRef);
    return FavoriteEpisodeDocument.parse(updatedDoc.data());
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const updateFavoriteEpisode = async (
  data: Partial<FavoriteEpisodeDocument>,
  documentId: string
) => {
  try {
    const docRef = doc(
      firebaseDB,
      FIRESTORE_COLLECTIONS.FAVORITE_EPISODES,
      documentId
    );
    await updateDoc(docRef, data);
    const updatedDoc = await getDoc(docRef);
    return FavoriteEpisodeDocument.parse(updatedDoc.data());
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const deleteFavoriteEpisode = async (documentId: string) => {
  try {
    await deleteDoc(
      doc(firebaseDB, FIRESTORE_COLLECTIONS.FAVORITE_EPISODES, documentId)
    );
    return documentId;
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
    const querySnapshot = await getDocs(q);
    const favorites: FavoriteEpisodeDocument[] = [];
    querySnapshot.forEach((doc) => {
      favorites.push(FavoriteEpisodeDocument.parse(doc.data()));
    });
    return favorites;
  } catch (e) {
    console.error('Error fetching favorite episodes: ', e);
    return [];
  }
};
