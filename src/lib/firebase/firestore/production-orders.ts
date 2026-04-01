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
  type NewProductionOrderDocument,
  ProductionOrderDocument,
} from '../types';
import { FIRESTORE_COLLECTIONS } from './constants';

export const addProductionOrder = async (data: NewProductionOrderDocument) => {
  try {
    const docRef = await addDoc(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.PRODUCTION_ORDERS),
      data
    );
    await updateDoc(docRef, {
      documentId: docRef.id,
    });
    const updatedDoc = await getDoc(docRef);
    return ProductionOrderDocument.parse(updatedDoc.data());
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const updateProductionOrder = async (
  data: Partial<ProductionOrderDocument>,
  documentId: string
) => {
  try {
    const docRef = doc(
      firebaseDB,
      FIRESTORE_COLLECTIONS.PRODUCTION_ORDERS,
      documentId
    );
    await updateDoc(docRef, data);
    const updatedDoc = await getDoc(docRef);
    return ProductionOrderDocument.parse(updatedDoc.data());
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

export const deleteProductionOrder = async (documentId: string) => {
  try {
    await deleteDoc(
      doc(firebaseDB, FIRESTORE_COLLECTIONS.PRODUCTION_ORDERS, documentId)
    );
    return documentId;
  } catch (e) {
    console.error('Error removing document: ', e);
  }
};

export const getProductionOrders = async (userId: string) => {
  try {
    const q = query(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.PRODUCTION_ORDERS),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const productionOrders: ProductionOrderDocument[] = [];
    querySnapshot.forEach((doc) => {
      productionOrders.push(ProductionOrderDocument.parse(doc.data()));
    });
    return productionOrders;
  } catch (e) {
    console.error('Error fetching production orders: ', e);
    return [];
  }
};

export const getProductionOrderByShowId = async (
  showId: number,
  userId: string
) => {
  try {
    const q = query(
      collection(firebaseDB, FIRESTORE_COLLECTIONS.PRODUCTION_ORDERS),
      where('userId', '==', userId),
      where('showId', '==', showId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const docData = querySnapshot.docs[0].data();
    return ProductionOrderDocument.parse(docData);
  } catch (e) {
    console.error('Error fetching production order: ', e);
    return null;
  }
};
