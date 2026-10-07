import {
  collection,
  type CollectionReference,
  deleteDoc,
  deleteField,
  doc,
  type DocumentReference,
  getDocs,
  setDoc,
  type UpdateData,
  updateDoc,
} from 'firebase/firestore';

import { firebaseDB } from '../config';

const normalizeDocumentId = (id: string | number) => String(id);

// Firestore rejects `undefined` field values, so drop them before writing.
const stripUndefined = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map(stripUndefined) as T;
  }
  if (value && typeof value === 'object' && value.constructor === Object) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entry]) => entry !== undefined)
        .map(([key, entry]) => [key, stripUndefined(entry)])
    ) as T;
  }
  return value;
};

// On update, a top-level `undefined` means the field was cleared, so delete it
// rather than silently keeping the old value.
const toUpdateData = <T extends object>(data: T): T =>
  Object.fromEntries(
    Object.entries(data).map(([key, entry]) => [
      key,
      entry === undefined ? deleteField() : stripUndefined(entry),
    ])
  ) as T;

export const createFirestoreCollection = <TDocument extends { id: string }>(
  collectionName: string,
  schema: {
    parse: (data: unknown) => TDocument;
  }
) => {
  type DocumentType = TDocument;
  type NewDocumentType = Omit<DocumentType, 'id'>;

  const collectionRef = collection(
    firebaseDB,
    collectionName
  ) as CollectionReference<DocumentType, DocumentType>;

  const addDocument = async (data: NewDocumentType) => {
    const docRef = doc(collectionRef) as DocumentReference<
      DocumentType,
      DocumentType
    >;
    const documentData = {
      ...data,
      id: docRef.id,
    } as DocumentType;

    await setDoc(docRef, stripUndefined(documentData));
    return docRef.id;
  };

  const updateDocument = async (
    data: UpdateData<DocumentType>,
    id: string | number
  ) => {
    const docRef = doc(
      firebaseDB,
      collectionName,
      normalizeDocumentId(id)
    ) as DocumentReference<DocumentType, DocumentType>;

    await updateDoc(docRef, toUpdateData(data));
  };

  const deleteDocument = async (id: string | number) => {
    const docRef = doc(
      firebaseDB,
      collectionName,
      normalizeDocumentId(id)
    ) as DocumentReference<DocumentType, DocumentType>;

    await deleteDoc(docRef);
  };

  const getDocuments = async () => {
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map((snapshot) =>
      schema.parse({
        ...snapshot.data(),
        id: snapshot.id,
      })
    );
  };

  return {
    addDocument,
    deleteDocument,
    getDocuments,
    updateDocument,
  };
};
