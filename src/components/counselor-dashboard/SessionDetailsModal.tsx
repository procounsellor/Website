import { X, Calendar, Clock, Video } from 'lucide-react';
import type { LiveSessionDetail } from '@/api/liveSessionList';

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: LiveSessionDetail | null;
  onJoinLive: () => void;
  loading: boolean;
  canJoin: boolean;
  joinMessage?: string;
}

export default function SessionDetailsModal({ 
  isOpen, 
  onClose, 
  session, 
  onJoinLive,
  loading,
  canJoin,
  joinMessage 
}: SessionDetailsModalProps) {
  if (!isOpen || !session) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not scheduled';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (startTime: string | null, endTime: string | null) => {
    if (!startTime || !endTime) return 'Live session';
    return `${startTime} - ${endTime}`;
  };

  const isDisabled = loading || !canJoin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-[#E8E7F2] rounded-full flex items-center justify-center mb-4">
              <Video className="w-8 h-8 text-[#13097D]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{session.title}</h2>
            <p className="text-gray-600">{session.description}</p>
          </div>

          <div className="space-y-4 bg-gray-50 rounded-xl p-4 mb-6">
            {session.date && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#13097D]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(session.date)}</p>
                </div>
              </div>
            )}

            {(session.startTime || session.endTime) && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#13097D]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm font-medium text-gray-900">{formatTime(session.startTime, session.endTime)}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-[#13097D]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Session Type</p>
                <p className="text-sm font-medium text-gray-900">
                  {session.type === 'DIRECT_LIVE' ? 'Live Now' : 'Scheduled Live'}
                </p>
              </div>
            </div>

            {session.forWhom && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-lg">👥</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Audience</p>
                  <p className="text-sm font-medium text-gray-900">
                    {session.forWhom.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onJoinLive}
              disabled={isDisabled}
              className="w-full px-6 py-3 bg-[#13097D] hover:bg-[#13097D]/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-1"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : !canJoin ? (
                <span className="text-sm">{joinMessage || 'Join not available for this session'}</span>
              ) : (
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  <span>Join Live</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
