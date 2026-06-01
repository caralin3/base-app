import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { firebaseAuth, firebaseInitError } from './config';

const getErrorCode = (error: unknown) => {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'string'
  ) {
    return (error as { code: string }).code;
  }

  return undefined;
};

const getAuthInstance = () => {
  if (firebaseAuth) {
    return firebaseAuth;
  }

  if (firebaseInitError) {
    throw firebaseInitError;
  }

  throw new Error('Firebase authentication is unavailable.');
};

const getAuthErrorMessage = (
  code: string | undefined,
  action: 'login' | 'register'
) => {
  if (code === 'auth/invalid-api-key') {
    return 'Firebase API key is invalid for this app configuration. Please verify your environment and Firebase project settings.';
  }

  if (code === 'auth/invalid-credential') {
    return 'Invalid email or password.';
  }

  if (code === 'auth/user-not-found') {
    return 'No account was found for that email address.';
  }

  if (code === 'auth/wrong-password') {
    return 'Invalid email or password.';
  }

  if (code === 'auth/email-already-in-use') {
    return 'An account with this email already exists.';
  }

  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.';
  }

  return action === 'login'
    ? 'Failed to sign in. Please try again.'
    : 'Failed to register. Please try again.';
};

export const registerUser = async (email: string, password: string) => {
  try {
    const auth = getAuthInstance();
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return response.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(getErrorCode(error), 'register'));
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const auth = getAuthInstance();
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(getErrorCode(error), 'login'));
  }
};

export const logoutUser = async () => {
  try {
    const auth = getAuthInstance();
    await auth.signOut();
  } catch (error) {
    console.error('logoutUser', error);
    throw error;
  }
};
