import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update, remove, onDisconnect, serverTimestamp } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/**
 * Set session as live and auto-set to false on disconnect
 * Uses update() to only modify specific fields without removing existing data
 */
export const setSessionLive = (liveSessionId: string) => {
  const sessionRef = ref(database, `liveSessionsStatus/${liveSessionId}`);
  
  // Update only specific fields - preserves other existing data
  update(sessionRef, {
    isLive: true,
    startedAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });
  
  // Automatically update to false when user disconnects
  onDisconnect(sessionRef).update({
    isLive: false,
    endedAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });
};

/**
 * Manually end a live session
 * Deletes the session from Firebase
 */
export const endSessionLive = async (liveSessionId: string) => {
  const sessionRef = ref(database, `liveSessionsStatus/${liveSessionId}`);
  
  await remove(sessionRef);
};

export { database, ref, update, remove, onDisconnect };
