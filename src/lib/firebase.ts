import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onDisconnect, serverTimestamp } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDb_zz0woAHGNq8W1RlU-0giJaT3vstJ44",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "procounsellor-71824.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://procounsellor-71824-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "procounsellor-71824",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "procounsellor-71824.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1000407154647",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1000407154647:web:0cc6c26e11d212a233d592",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-B3YPBQMY6L"
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
