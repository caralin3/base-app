import { initFirebase } from '@base-app/core';
import { Env } from '@env';

export const { firebaseApp, firebaseAuth, firebaseDB, firebaseInitError } =
  initFirebase({
    apiKey: Env.FIREBASE_API_KEY,
    projectId: Env.FIREBASE_PROJECT_ID,
    androidAppId: Env.FIREBASE_ANDROID_APP_ID,
    iosAppId: Env.FIREBASE_IOS_APP_ID,
  });
