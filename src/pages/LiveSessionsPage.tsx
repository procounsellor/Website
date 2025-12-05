import { useEffect, useState } from 'react';
import { unlockScroll } from '@/lib/scrollLock';
import { getAllOngoingLiveSessions } from '@/api/liveSessions';
import type { LiveSession } from '@/api/liveSessions';
import { useLiveStreamStore } from '@/store/LiveStreamStore';

interface OngoingSessionAvatarProps {
  session: LiveSession;
}

function OngoingSessionAvatar({ session }: OngoingSessionAvatarProps) {
  const { startStream } = useLiveStreamStore();
  
  const getAvatarUrl = (photoUrl: string | null, fullName: string) => {
    if (photoUrl) return photoUrl;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E0E7FF&color=4F46E5`;
  };

  const avatarUrl = getAvatarUrl(session.counsellorPhotoUrl, session.counsellorFullName);

  const handleAvatarClick = () => {
    startStream(
      'livepeer',
      session.playbackId,
      session.title,
      `${session.description} • By ${session.counsellorFullName}`,
      session.liveSessionId
    );
  };

  return (
    <div 
      className="relative shrink-0 cursor-pointer"
      onClick={handleAvatarClick}
      // The 120x120 container with a 32px gap between items
      style={{ width: '120px', height: '120px' }} 
    >
      <div 
        className="w-full h-full rounded-full overflow-hidden"
        // Applying the circular gradient border style
        style={{
          padding: '3.24px', // Simulates the inner border padding
          background: 'linear-gradient(90deg, #FA660F 0%, #13097D 100%)', // Orange to Blue gradient
        }}
      >
        {/* Inner container to hold the image */}
        <div className="w-full h-full rounded-full overflow-hidden">
          <img
            src={avatarUrl}
            alt={session.counsellorFullName}
            className="w-full h-full object-cover rounded-full"
            // The image itself is slightly smaller than the container (110.27px)
          />
        </div>
      </div>
      
      {/* "Live" Badge at the bottom center */}
      <div 
        className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#FA660F] text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg"
      >
        Live
      </div>
    </div>
  );
}


export default function LiveSessionsPage() {
  const [ongoingSessions, setOngoingSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    unlockScroll();
    
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const sessions = await getAllOngoingLiveSessions();
        setOngoingSessions(sessions);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setError("Failed to load ongoing sessions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);


  const renderContent = () => {
    if (loading) {
      return <div className="p-8 text-center text-gray-600">Loading ongoing sessions...</div>;
    }

    if (error) {
      return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    if (ongoingSessions.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm">
          No ongoing live sessions at the moment.
        </div>
      );
    }
    
    return (
      <div className="flex overflow-x-auto pb-4 gap-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {ongoingSessions.map((session) => (
          <OngoingSessionAvatar key={session.liveSessionId} session={session} />
        ))}
      </div>
    );
  };


  return (
    <div className="bg-gray-50 pt-20 md:pt-28 pb-8 px-4 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Ongoing Sessions Heading */}
        <h1 
          className="text-2xl font-medium mb-6"
          style={{ 
            color: '#13097D', // Background: #13097D for the font color
            fontFamily: 'Poppins', 
            fontWeight: 500,
            lineHeight: '125%', // Line height 125%
          }}
        >
          Ongoing Sessions
        </h1>

        {/* List of Ongoing Sessions */}
        {renderContent()}

        {/* Upcoming Sessions Placeholder (to maintain visual hierarchy) */}
        <h2 
          className="text-2xl font-medium mt-12 mb-6"
          style={{ 
            color: '#13097D', // Background: #13097D for the font color
            fontFamily: 'Poppins', 
            fontWeight: 500,
            lineHeight: '125%',
          }}
        >
          Upcoming Sessions
        </h2>
        <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
          <p className="text-xl text-gray-600 font-semibold">
            We will implement Upcoming Sessions next.
          </p>
        </div>
        
      </main>
    </div>
  );
}