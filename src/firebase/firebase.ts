import {initializeApp, getApps, getApp} from "firebase/app";
import {getAuth, connectAuthEmulator} from "firebase/auth";
import {getFirestore, connectFirestoreEmulator} from "firebase/firestore";
import {getStorage, connectStorageEmulator} from "firebase/storage";

import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  MESSAGING_SENDER_ID,
  PROJECT_ID,
  STORAGE_BUCKET,
} from "./config";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}

export {app, auth, db, storage};
