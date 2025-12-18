import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update, remove, onDisconnect, serverTimestamp, onValue, type DataSnapshot } from 'firebase/database';

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


export const setSessionLive = (liveSessionId: string) => {
  const sessionRef = ref(database, `liveSessionsStatus/${liveSessionId}`);


  update(sessionRef, {
    isLive: true,
    startedAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });


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

/**
 * Listen to chat messages for a counselor's live session
 * @param liveSessionId - The liveSessionId (which is the counsellorId)
 */
export const listenToChatMessages = (
  liveSessionId: string,
  onMessages: (messages: any[]) => void,
  onSessionInfo: (info: { liveSessionId: string; title: string; startedAt: any } | null) => void
) => {
  const chatRef = ref(database, `liveSessionChats/${liveSessionId}`);
  console.log('🔗 Firebase listener attached to path:', `liveSessionChats/${liveSessionId}`);

  return onValue(chatRef, (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    console.log('📡 Firebase snapshot received:', data);

    if (!data) {
      console.log('⚠️ No data at path:', `liveSessionChats/${liveSessionId}`);
      onSessionInfo(null);
      onMessages([]);
      return;
    }

    const { liveSessionId: sessionId, title, startedAt, messages } = data;
    console.log('📋 Session info:', { sessionId, title, startedAt });
    console.log('💬 Messages object:', messages);
    onSessionInfo({ liveSessionId: sessionId, title, startedAt });

    // Convert messages object to array
    if (messages) {
      const messageArray = Object.entries(messages).map(([id, msg]: [string, any]) => ({
        messageId: id,
        ...msg
      }));

      // Sort by timestamp
      messageArray.sort((a, b) => a.timestamp - b.timestamp);
      console.log('✅ Processed messages array:', messageArray);
      onMessages(messageArray);
    } else {
      onMessages([]);
    }
  });
};

/**
 * Listen to all live sessions status in real-time
 * @param onSessions - Callback with all live sessions
 */
export const listenToLiveSessionsStatus = (
  onSessions: (sessions: Record<string, any>) => void
) => {
  const statusRef = ref(database, 'liveSessionsStatus');

  return onValue(statusRef, (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    onSessions(data || {});
  });
};

/**
 * Listen to a specific counselor's live session status
 * @param counsellorId - The counselor ID to monitor
 * @param onStatusChange - Callback when status changes
 */
export const listenToCounselorLiveStatus = (
  counsellorId: string,
  onStatusChange: (isLive: boolean, lastUpdated: number | null) => void
) => {
  const statusRef = ref(database, `liveSessionsStatus/${counsellorId}`);

  return onValue(statusRef, (snapshot: DataSnapshot) => {
    const data = snapshot.val();

    console.log('🔍 Firebase status data:', data);

    if (!data) {
      onStatusChange(false, null);
      return;
    }

    const isLive = data.isLive || false;
    const lastUpdated = data.lastUpdated || data.endedAt || null;

    console.log('📊 Parsed status:', { isLive, lastUpdated, raw: data });

    onStatusChange(isLive, lastUpdated);
  });
};

/**
 * Track when a user joins a live session (for viewer count)
 * @param liveSessionId - The live session ID (counsellorId)
 * @param userId - The user's ID
 */
export const trackUserJoined = (liveSessionId: string, userId: string) => {
  const userRef = ref(database, `liveSessionsStatus/${liveSessionId}/userIdsInLive/${userId}`);

  // Set user as joined
  update(userRef, { joined: true, timestamp: serverTimestamp() });

  // Auto-remove user when they disconnect
  onDisconnect(userRef).remove();
};

/**
 * Track when a user leaves a live session manually
 * @param liveSessionId - The live session ID (counsellorId)
 * @param userId - The user's ID
 */
export const trackUserLeft = async (liveSessionId: string, userId: string) => {
  const userRef = ref(database, `liveSessionsStatus/${liveSessionId}/userIdsInLive/${userId}`);
  await remove(userRef);
};

/**
 * Listen to live viewer count for a counselor's session
 * @param counsellorId - The counselor ID
 * @param onCountChange - Callback with viewer count
 */
export const listenToViewerCount = (
  counsellorId: string,
  onCountChange: (count: number) => void
) => {
  const viewersRef = ref(database, `liveSessionsStatus/${counsellorId}/userIdsInLive`);

  return onValue(viewersRef, (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    const count = (data && typeof data === 'object') ? Object.keys(data).length : 0;
    onCountChange(count);
  });
};

export { database, ref, update, remove, onDisconnect };
