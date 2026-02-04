
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Vite uses import.meta.env for environment variables. 
// We use a type assertion to satisfy the TypeScript compiler.
const env = (import.meta as any).env;



const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export default firebaseConfig;



// Defensive check for missing environment variables
const isConfigValid = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app;
try {
  if (!isConfigValid) {
    console.error("Firebase configuration is missing or invalid. Check your Vercel/Local environment variables for VITE_FIREBASE_API_KEY, etc.");
  }
  // Prevent multiple initializations
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase failed to initialize:", error);
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export default app;
