import { useState, useEffect } from 'react';
import {  Calendar, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import BroadcastView from '@/components/live/BroadcastView';
import ScheduleLiveModal from '@/components/counselor-details/ScheduleLiveModal';
import SessionCard from '@/components/counselor-dashboard/SessionCard';
import SessionDetailsModal from '@/components/counselor-dashboard/SessionDetailsModal';
import { getAllLiveSessions, getUpcomingLiveSessions, getLiveSessionById, startScheduledLive, type LiveSessionItem, type LiveSessionDetail } from '@/api/liveSessionList';
import type { User } from '@/types/user';

interface SessionsTabProps {
  user: User | null;
  token: string;
}

export default function SessionsTab({ user, token }: SessionsTabProps) {
  const [sessionSubTab, setSessionSubTab] = useState<'all' | 'upcoming'>('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [streamKey, setStreamKey] = useState('');
  const [streamTitle, setStreamTitle] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [sessions, setSessions] = useState<LiveSessionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<LiveSessionDetail | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.userName && token) {
      fetchSessions();
    }
  }, [sessionSubTab, user?.userName, token]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = sessionSubTab === 'upcoming' 
        ? await getUpcomingLiveSessions(user!.userName, token)
        : await getAllLiveSessions(user!.userName, token);
      
      if (response.success) {
        setSessions(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const canJoinSession = (session: LiveSessionDetail | null): { canJoin: boolean; message: string } => {
    if (!session) return { canJoin: false, message: 'Session not found' };
    
    // Hide join button for DIRECT_LIVE sessions (counselor creates these to go live)
    if (session.type === 'DIRECT_LIVE') {
      return { canJoin: false, message: 'This session was created for direct streaming' };
    }
    
    // Scheduled sessions can always be joined
    return { canJoin: true, message: '' };
  };

  const handleViewSession = async (session: LiveSessionItem) => {
    setLoadingSessionId(session.liveSessionId);
    setLoadingDetails(true);
    setShowDetailsModal(true);
    try {
      // First get initial session details to check type
      const initialResponse = await getLiveSessionById(user!.userName, session.liveSessionId, token);
      
      if (!initialResponse.success) {
        toast.error('Failed to load session details');
        setShowDetailsModal(false);
        return;
      }

      // If it's a scheduled session, MUST call startScheduledLive FIRST to generate stream key
      if (initialResponse.data.type === 'SCHEDULED_LIVE') {
        try {
          console.log('Starting scheduled live session...');
          const startResponse = await startScheduledLive(user!.userName, session.liveSessionId, token);
          console.log('Start scheduled live response:', startResponse);
          
          // Now fetch the session again to get the generated streamKey
          const updatedResponse = await getLiveSessionById(user!.userName, session.liveSessionId, token);
          if (updatedResponse.success) {
            console.log('Updated session with streamKey:', updatedResponse.data);
            setSelectedSession(updatedResponse.data);
          } else {
            toast.error('Failed to get updated session details');
            setSelectedSession(initialResponse.data);
          }
        } catch (error) {
          console.error('StartScheduledLive error:', error);
          toast.error('Failed to start live session');
          setShowDetailsModal(false);
        }
      } else {
        // For DIRECT_LIVE, just use the initial response
        setSelectedSession(initialResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch session details:', error);
      toast.error('Failed to load session details');
      setShowDetailsModal(false);
    } finally {
      setLoadingDetails(false);
      setLoadingSessionId(null);
    }
  };

  const handleSessionCreated = async () => {
    // Silently refetch sessions in background without showing loading state
    try {
      const response = sessionSubTab === 'upcoming' 
        ? await getUpcomingLiveSessions(user!.userName, token)
        : await getAllLiveSessions(user!.userName, token);
      
      if (response.success) {
        setSessions(response.data || []);
      }
    } catch (error) {
      console.error('Failed to refetch sessions:', error);
    }
  };

  const handleJoinLive = () => {
    if (!selectedSession?.streamKey || selectedSession.streamKey.trim() === '') {
      toast.error('Stream key not available yet. Please try again in a moment.');
      return;
    }
    
    setStreamKey(selectedSession.streamKey);
    setStreamTitle(selectedSession.title);
    setCurrentSessionId(selectedSession.liveSessionId);
    setShowDetailsModal(false);
    setShowBroadcast(true);
  };

  if (showBroadcast && streamKey && currentSessionId) {
    return (
      <BroadcastView 
        streamKey={streamKey} 
        streamTitle={streamTitle}
        liveSessionId={currentSessionId}
        counselorId={user?.userName || ''}
        onClose={() => {
          setShowBroadcast(false);
          setStreamKey('');
          setStreamTitle('');
          setCurrentSessionId('');
          // Refetch sessions to update status
          fetchSessions();
        }} 
      />
    );
  }

  return (
    <div className="md:bg-white md:py-5 md:px-4 md:rounded-2xl md:border md:border-[#EFEFEF]">
      <div className="bg-white p-2 rounded-xl border border-[#EFEFEF] md:bg-transparent md:p-0 md:border-none md:mb-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSessionSubTab('all')}
              className={`flex-1 md:flex-none px-4 py-2 text-[12px] md:text-base font-medium rounded-full transition-colors duration-200 ${
                sessionSubTab === 'all' 
                ? 'bg-[#E8E7F2] text-[#13097D]' 
                : 'bg-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              All Sessions
            </button>
            <button
              onClick={() => setSessionSubTab('upcoming')}
              className={`flex-1 md:flex-none px-4 py-2 text-[12px] md:text-base font-medium rounded-full transition-colors duration-200 ${
                sessionSubTab === 'upcoming' 
                ? 'bg-[#E8E7F2] text-[#13097D]' 
                : 'bg-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Upcoming
            </button>
          </div>
          
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex bg-[#655E95] hover:bg-[#655E95]/90 rounded-2xl md:rounded-[0.75rem] cursor-pointer text-clip border text-xs py-2 lg:py-3 px-3 lg:px-6 text-white items-center justify-center lg:font-semibold"
          >
            Create Session
          </button>
        </div>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <Loader2 className="w-8 h-8 text-[#13097D] animate-spin" />
          <p className="text-gray-500 mt-3">Loading sessions...</p>
        </div>
      ) : sessions.length > 0 ? (
        <div className="grid gap-3 mt-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.liveSessionId}
              session={session}
              onJoin={handleViewSession}
              canJoin={true}
              isLoading={loadingSessionId === session.liveSessionId}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] text-center border border-gray-200 rounded-xl bg-gray-50/50 mt-2">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No sessions found</h3>
          <p className="text-gray-500 max-w-xs mt-1">
            Get started by creating your first live stream session for your students.
          </p>
        </div>
      )}

      {/* Schedule Live Modal */}
      <ScheduleLiveModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        counsellorId={user?.userName || ''}
        counselorName={`${user?.firstName || ''} ${user?.lastName || ''}`}
        token={token}
        onSessionCreated={handleSessionCreated}
      />

      {/* Session Details Modal */}
      <SessionDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedSession(null);
        }}
        session={selectedSession}
        onJoinLive={handleJoinLive}
        loading={loadingDetails}
        canJoin={canJoinSession(selectedSession).canJoin}
        joinMessage={canJoinSession(selectedSession).message}
      />
    </div>
  );
}
