import { Video, Users, Clock } from 'lucide-react';
import { useLiveStreamStore } from '@/store/LiveStreamStore';
import { useState } from 'react';
import type { StreamPlatform } from '@/store/LiveStreamStore';

interface LiveSessionCardProps {
  counselorName?: string;
}

export function LiveSessionCard({ counselorName = "Counselor" }: LiveSessionCardProps) {
  const { startStream } = useLiveStreamStore();
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<StreamPlatform | null>(null);
  const [videoLink, setVideoLink] = useState('');

  const handlePlatformSelect = (platform: StreamPlatform) => {
    setSelectedPlatform(platform);
  };

  const handleStartStream = () => {
    if (!selectedPlatform || !videoLink.trim()) return;
    
    // Extract video ID from link
    let videoId = videoLink.trim();
    
    if (selectedPlatform === 'youtube') {
      // Extract YouTube video ID from various URL formats
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/live\/)([^"&?\/\s]{11})/;
      const match = videoLink.match(youtubeRegex);
      if (match && match[1]) {
        videoId = match[1];
      }
    } else {
      // Extract Livepeer playback ID from URL or use directly if it's just the ID
      // Supports: https://lvpr.tv/?v=PLAYBACK_ID, playback ID directly, or broadcast URL
      const playbackIdRegex = /[?&]v=([a-z0-9]+)/;
      const broadcastRegex = /broadcast\/([a-z0-9-]+)/;
      
      const playbackMatch = videoLink.match(playbackIdRegex);
      const broadcastMatch = videoLink.match(broadcastRegex);
      
      if (playbackMatch && playbackMatch[1]) {
        videoId = playbackMatch[1];
      } else if (broadcastMatch && broadcastMatch[1]) {
        videoId = broadcastMatch[1];
      } else if (/^[a-z0-9]+$/.test(videoLink)) {
        // If it's just the playback ID without URL
        videoId = videoLink;
      }
    }
    
    startStream(
      selectedPlatform,
      videoId,
      `Live Session with ${counselorName}`,
      'Join our interactive career counseling session'
    );
    setShowPlatformModal(false);
    setSelectedPlatform(null);
    setVideoLink('');
  };

  const handleJoinLive = () => {
    setShowPlatformModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="relative bg-linear-to-r from-red-600 to-red-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span className="text-white font-bold text-sm">LIVE NOW</span>
          </div>
          <div className="flex items-center gap-1 text-white/90 text-xs">
            <Users className="w-3 h-3" />
            <span>234 watching</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#FF660F] to-orange-600 flex items-center justify-center shrink-0">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Live Career Counseling Session
            </h3>
            <p className="text-sm text-gray-600">
              with {counselorName}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-[#FF660F]" />
            <span>Started 45 minutes ago</span>
          </div>
          
          <p className="text-sm text-gray-700">
            Join our interactive live session covering career paths, college selection, and entrance exam preparation.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-orange-50 text-[#FF660F] text-xs font-medium rounded-full">
              Career Guidance
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
              Q&A Session
            </span>
            <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
              Interactive
            </span>
          </div>
        </div>

        <button
          onClick={handleJoinLive}
          className="w-full bg-linear-to-r from-[#FF660F] to-orange-600 hover:from-[#FF660F]/90 hover:to-orange-600/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Join Live Session</span>
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Free for subscribed members
        </p>
      </div>

      {/* Platform Selection Modal */}
      {showPlatformModal && (
        <div 
          className="fixed inset-0 bg-black/30 z-999 flex items-center justify-center p-4"
          onClick={() => {
            setShowPlatformModal(false);
            setSelectedPlatform(null);
            setVideoLink('');
          }}
        >
          <div 
            className="bg-white rounded shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Streaming Platform</h3>

            <p className="text-sm text-gray-700 mb-4">
              Select a platform and enter the stream link
            </p>

            <div className="space-y-3 mb-4">
              {/* YouTube Option */}
              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="platform"
                  value="youtube"
                  checked={selectedPlatform === 'youtube'}
                  onChange={() => handlePlatformSelect('youtube')}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">YouTube</div>
                  <div className="text-xs text-gray-600">Enter YouTube video link</div>
                </div>
              </label>

              {/* Livepeer Option */}
              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="platform"
                  value="livepeer"
                  checked={selectedPlatform === 'livepeer'}
                  onChange={() => handlePlatformSelect('livepeer')}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Livepeer</div>
                  <div className="text-xs text-gray-600">Enter Livepeer Playback ID</div>
                </div>
              </label>
            </div>

            {selectedPlatform && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {selectedPlatform === 'youtube' ? 'YouTube Video Link' : 'Livepeer Playback ID'}
                </label>
                <input
                  type="text"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder={selectedPlatform === 'youtube' 
                    ? 'https://youtube.com/watch?v=...' 
                    : '9d41sjbxr2g23onl'}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {selectedPlatform === 'livepeer' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Note: The stream must be actively broadcasting to play
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPlatformModal(false);
                  setSelectedPlatform(null);
                  setVideoLink('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStartStream}
                disabled={!selectedPlatform || !videoLink.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Start Stream
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
