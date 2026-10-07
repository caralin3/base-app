import AsyncStorage from '@react-native-async-storage/async-storage';
import { type FirebaseApp, initializeApp } from 'firebase/app';
import {
  type Auth,
  // @ts-ignore: getReactNativePersistence is missing from firebase types
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { type Firestore, getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

export type FirebaseEnv = {
  apiKey?: string;
  projectId?: string;
  androidAppId?: string;
  iosAppId?: string;
};

export type FirebaseServices = {
  firebaseApp: FirebaseApp;
  firebaseAuth: Auth | null;
  firebaseDB: Firestore;
  firebaseInitError: Error | null;
};

let services: FirebaseServices | null = null;

/**
 * Initialise Firebase for the app. Call once, from the app's firebase config
 * module, with values from its env. Auth is left null (with an explanatory
 * error) instead of throwing when the env is incomplete or invalid.
 */
export function initFirebase(env: FirebaseEnv): FirebaseServices {
  if (services) {
    return services;
  }

  const firebaseApp = initializeApp({
    apiKey: env.apiKey,
    authDomain: `${env.projectId}.firebaseapp.com`,
    databaseURL: `https://${env.projectId}.firebaseio.com`,
    projectId: env.projectId,
    appId: Platform.select({
      android: env.androidAppId,
      ios: env.iosAppId,
    }),
  });

  let firebaseAuth: Auth | null = null;
  let firebaseInitError: Error | null = null;

  const hasRequiredAuthConfig =
    Boolean(env.apiKey?.trim()) &&
    Boolean(env.projectId?.trim()) &&
    Boolean(env.androidAppId?.trim() || env.iosAppId?.trim());

  try {
    if (!hasRequiredAuthConfig) {
      firebaseInitError = new Error(
        'Firebase auth is not configured for this project/environment. Set FIREBASE_API_KEY, FIREBASE_PROJECT_ID, and a platform app id.'
      );
    } else {
      // Initialize Firebase Authentication and get a reference to the service
      firebaseAuth = initializeAuth(firebaseApp, {
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

  services = {
    firebaseApp,
    firebaseAuth,
    // Initialize Cloud Firestore and get a reference to the service
    firebaseDB: getFirestore(firebaseApp),
    firebaseInitError,
  };

  return services;
}

export function getFirebaseServices() {
  return services;
}
