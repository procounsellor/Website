import { Calendar, Clock, MoreVertical, Loader2, Edit, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { LiveSessionItem } from '@/api/liveSessionList';

interface SessionCardProps {
  session: LiveSessionItem;
  onJoin: (session: LiveSessionItem) => void;
  canJoin: boolean;
  isLoading?: boolean;
  onEdit?: (session: LiveSessionItem) => void;
  onDelete?: (session: LiveSessionItem) => void;
}

export default function SessionCard({ session, onJoin, canJoin, isLoading, onEdit, onDelete }: SessionCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not scheduled';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (startTime: string | null, endTime: string | null) => {
    if (!startTime || !endTime) return '';
    return `${startTime} - ${endTime}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{session.title}</h3>
          <p className="text-xs text-gray-600 line-clamp-1 mb-3">{session.description}</p>
          
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            {session.date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(session.date)}</span>
              </div>
            )}
            {session.startTime && session.endTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(session.startTime, session.endTime)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {canJoin && (
            <button
              onClick={() => onJoin(session)}
              disabled={isLoading}
              className="px-4 py-1.5 bg-[#13097D] hover:bg-[#13097D]/90 text-white text-xs font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                'View'
              )}
            </button>
          )}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(session);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete(session);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
