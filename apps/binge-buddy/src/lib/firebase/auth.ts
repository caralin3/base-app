import {
  type AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { firebaseAuth } from './config';

export const registerUser = async (email: string, password: string) => {
  try {
    const response = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    return response.user;
  } catch (error) {
    const errorCode = (error as AuthError).code;
    const errorMessage = (error as AuthError).message;
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    return response.user;
  } catch (error) {
    const errorCode = (error as AuthError).code;
    const errorMessage = (error as AuthError).message;
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await firebaseAuth.signOut();
  } catch (error) {
    console.error('logoutUser', error);
    throw error;
  }
};
