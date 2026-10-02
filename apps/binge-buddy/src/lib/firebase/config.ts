import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  // @ts-ignore: getReactNativePersistence is missing from firebase types
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

import { Env } from '../env';

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

// Initialize Firebase Authentication and get a reference to the service
export const firebaseAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Cloud Firestore and get a reference to the service
export const firebaseDB = getFirestore(app);
