import { Env } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  type Auth,
  // @ts-ignore: getReactNativePersistence is missing from firebase types
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

// Initialize Firebase
const firebaseConfig = {
  apiKey: Env.FIREBASE_API_KEY,
  authDomain: `${Env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${Env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: Env.FIREBASE_PROJECT_ID,
  appId: Platform.select({
    android: Env.FIREBASE_ANDROID_APP_ID,
    ios: Env.FIREBASE_IOS_APP_ID,
  }),
};

const app = initializeApp(firebaseConfig);

let firebaseAuth: Auth | null = null;
let firebaseInitError: Error | null = null;

const hasRequiredAuthConfig =
  Boolean(Env.FIREBASE_API_KEY?.trim()) &&
  Boolean(Env.FIREBASE_PROJECT_ID?.trim()) &&
  Boolean(
    Env.FIREBASE_ANDROID_APP_ID?.trim() || Env.FIREBASE_IOS_APP_ID?.trim()
  );

try {
  if (!hasRequiredAuthConfig) {
    firebaseInitError = new Error(
      'Firebase auth is not configured for this project/environment. Set FIREBASE_API_KEY, FIREBASE_PROJECT_ID, and a platform app id.'
    );
  } else {
    // Initialize Firebase Authentication and get a reference to the service
    firebaseAuth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
} catch (error) {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code?: string }).code === 'auth/invalid-api-key'
  ) {
    firebaseInitError = new Error(
      'Firebase API key is invalid for this app configuration. Please verify your env values and Firebase app setup.'
    );
  } else {
    firebaseInitError =
      error instanceof Error
        ? error
        : new Error('Failed to initialize Firebase authentication.');
  }
}

export { firebaseAuth, firebaseInitError };

// Initialize Cloud Firestore and get a reference to the service
export const firebaseDB = getFirestore(app);
