import { Video, Users, Clock } from 'lucide-react';
import { useLiveStreamStore } from '@/store/LiveStreamStore';

interface LiveSessionCardProps {
  counselorName?: string;
}

const FIXED_PLAYBACK_ID = '2b82klu2uvtq84b3';
const STREAM_PLATFORM = 'livepeer';

export function LiveSessionCard({ counselorName = "Counselor" }: LiveSessionCardProps) {
  const { startStream } = useLiveStreamStore();
  
  const handleJoinLive = () => {
    startStream(
      STREAM_PLATFORM,
      FIXED_PLAYBACK_ID,
      `Live Session with ${counselorName}`,
      'Join our interactive career counseling session'
    );
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
          disabled={true}
          className="w-full cursor-not-allowed bg-linear-to-r from-[#FF660F] to-orange-600 hover:from-[#FF660F]/90 hover:to-orange-600/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Join Live Session</span>
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Free for subscribed members
        </p>
      </div>      
    </div>
  );
}