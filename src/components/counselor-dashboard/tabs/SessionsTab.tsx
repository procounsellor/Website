import { useState } from 'react';
import { Video, Calendar, Loader2, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import BroadcastView from '@/components/live/BroadcastView';
import type { User } from '@/types/user';

interface SessionsTabProps {
  user: User | null;
  token: string;
}

export default function SessionsTab({ user, token }: SessionsTabProps) {
  const [sessionSubTab, setSessionSubTab] = useState<'all' | 'upcoming'>('all');
  const [showCreateStreamModal, setShowCreateStreamModal] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [isCreatingStream, setIsCreatingStream] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [streamKey, setStreamKey] = useState('');

  const handleCreateStream = async () => {
    if (!streamTitle.trim()) {
      toast.error('Please enter a stream title');
      return;
    }

    setIsCreatingStream(true);
    try {
      const response = await axios.post('http://localhost:4000/api/v1/create-stream', {
        name: streamTitle,
        counselorId: user?.id || user?._id // Send counselor ID from auth
      });

      if (response.data && response.data.livepeerStream && response.data.livepeerStream.streamKey) {
        setStreamKey(response.data.livepeerStream.streamKey);
        setShowCreateStreamModal(false);
        setShowBroadcast(true);
        toast.success('Stream created successfully!');
      } else {
        toast.error('Failed to get stream key');
      }
    } catch (error) {
      console.error('Error creating stream:', error);
      toast.error('Failed to create stream');
    } finally {
      setIsCreatingStream(false);
    }
  };

  if (showBroadcast) {
    return (
      <BroadcastView 
        streamKey={streamKey} 
        streamTitle={streamTitle}
        counselorId={user?.id || user?._id}
        onClose={() => setShowBroadcast(false)} 
      />
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setSessionSubTab('all')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              sessionSubTab === 'all' ? 'bg-white text-[#13097D] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Sessions
          </button>
          <button
            onClick={() => setSessionSubTab('upcoming')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              sessionSubTab === 'upcoming' ? 'bg-white text-[#13097D] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming
          </button>
        </div>
        
        <button
          onClick={() => setShowCreateStreamModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF660F] text-white rounded-lg hover:bg-[#FF660F]/90 transition-colors font-medium text-sm"
        >
          <Video size={18} />
          Create Stream
        </button>
      </div>

      {/* Empty State for Sessions */}
      <div className="flex flex-col items-center justify-center h-[400px] text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No sessions found</h3>
        <p className="text-gray-500 max-w-xs mt-1">
          Get started by creating your first live stream session for your students.
        </p>
      </div>

      {/* Create Stream Modal */}
      {showCreateStreamModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#343C6A]">Create New Stream</h3>
              <button 
                onClick={() => setShowCreateStreamModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stream Title</label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="e.g., Career Guidance Session 101"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#13097D] focus:border-transparent outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video ID</label>
                <input
                  type="text"
                  value={youtubeVideoId}
                  onChange={(e) => setYoutubeVideoId(e.target.value)}
                  placeholder="e.g., dQw4w9WgXcQ"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#13097D] focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">From YouTube URL: youtube.com/watch?v=<strong>VIDEO_ID</strong></p>
              </div>
              
              <button
                onClick={handleCreateStream}
                disabled={isCreatingStream}
                className="w-full py-3 bg-[#13097D] text-white rounded-lg font-semibold hover:bg-[#13097D]/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreatingStream ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Start Broadcasting'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
