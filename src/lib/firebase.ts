import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onDisconnect, serverTimestamp } from 'firebase/database';

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
 */
export const setSessionLive = (liveSessionId: string) => {
  const sessionRef = ref(database, `liveSessionsStatus/${liveSessionId}`);
  
  // Set isLive to true
  set(sessionRef, {
    isLive: true,
    startedAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });
  
  // Automatically set to false when user disconnects
  onDisconnect(sessionRef).set({
    isLive: false,
    endedAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });
  
  console.log('✅ Session set to live with auto-cleanup:', liveSessionId);
};

/**
 * Manually end a live session
 */
export const endSessionLive = async (liveSessionId: string) => {
  const sessionRef = ref(database, `liveSessionsStatus/${liveSessionId}`);
  
  await set(sessionRef, {
    isLive: false,
    endedAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });
  
  console.log('✅ Session ended manually:', liveSessionId);
};

export { database, ref, set, onDisconnect };
