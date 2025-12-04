import { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Heart, ThumbsUp, Share2, Users, Clock } from 'lucide-react'; // Minimize2, Maximize2 removed
import { cn } from '@/lib/utils';
import { useLiveStreamStore } from '@/store/LiveStreamStore';
import type { StreamPlatform } from '@/store/LiveStreamStore';

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
}

interface YTPlayerEvent {
  target: YTPlayer;
}

declare const YT: {
  Player: new (
    elementId: string,
    config: {
      height: string;
      width: string;
      videoId: string;
      playerVars: Record<string, number | string>;
      events: {
        onReady?: (event: YTPlayerEvent) => void;
        onStateChange?: (event: YTPlayerEvent) => void;
      };
    }
  ) => YTPlayer;
};

interface LiveStreamViewProps {
  platform: StreamPlatform;
  videoId: string;
  embedUrl?: string;          // kept, but no longer used for iframe
  streamTitle?: string;
  description?: string;
  isLive?: boolean;
  scheduledTime?: Date;
  onClose?: () => void;
  allowMinimize?: boolean;    // kept so existing callers don’t break
}

interface Reaction {
  id: string;
  emoji: string;
  x: number;
  timestamp: number;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  avatar?: string;
}

export default function LiveStreamView({
  platform,
  videoId,
  // embedUrl,
  streamTitle: _streamTitle = "Live Career Counseling Session",
  description: _description = "Join us for an interactive session on career guidance and college admissions",
  isLive = true,
  scheduledTime: _scheduledTime,
  onClose,
  // allowMinimize = true,      // unused now, safe to keep
}: LiveStreamViewProps) {
  const { closeStream } = useLiveStreamStore(); // minimizeStream removed
  // const { isMinimized } = useLiveStreamStore();

  const [showChat, setShowChat] = useState(true);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [viewerCount, setViewerCount] = useState(234);
  const [ytLoading, setYtLoading] = useState(platform === 'youtube');
  const [ytPlaying, setYtPlaying] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'Nishant Sagar', message: 'Great session! Very informative 🎓', timestamp: new Date(), avatar: 'NS' },
    { id: '2', user: 'Aswini Verma', message: 'Can you talk about engineering colleges?', timestamp: new Date(), avatar: 'AV' },
    { id: '3', user: 'Ashutosh Kumar', message: 'This is exactly what I needed!', timestamp: new Date(), avatar: 'AK' },
  ]);
  const [messageInput, setMessageInput] = useState('');
  const [streamDuration, setStreamDuration] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 10 - 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setStreamDuration(prev => prev + 1);
      }, 60000); 
      return () => clearInterval(interval);
    }
  }, [isLive]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const addReaction = (emoji: string) => {
    const newReaction: Reaction = {
      id: Math.random().toString(36),
      emoji,
      x: Math.random() * 80 + 10,
      timestamp: Date.now()
    };
    setReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 3000);
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: 'You',
        message: messageInput,
        timestamp: new Date(),
        avatar: 'YO'
      };
      setChatMessages(prev => [...prev, newMessage]);
      setMessageInput('');
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // YouTube only
  useEffect(() => {
    if (platform !== 'youtube') return;

    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, platform]);

  const initPlayer = () => {
    if (!window.YT || !window.YT.Player) return;

    const container = document.getElementById('yt-player');
    if (!container) return;

    playerRef.current = new window.YT.Player('yt-player', {
      height: '100%',
      width: '100%',
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        playsinline: 1,
        iv_load_policy: 3,
        disablekb: 1,
        fs:1,
        cc_load_policy: 0,
        mute: 0,
      },
      events: {
        onReady: (event: YTPlayerEvent) => {
          setYtLoading(false);
          setYtPlaying(true);
          event.target.playVideo();
          const iframe = container.querySelector('iframe');
          if (iframe) {
            iframe.style.position = 'absolute';
            iframe.style.top = '50%';
            iframe.style.left = '50%';
            iframe.style.transform = 'translate(-50%, -50%)';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.objectFit = 'contain';
          }
        },
        onStateChange: (event: any) => {
          if (event.data === 1) {
            setYtPlaying(true);
            setYtLoading(false);
          } else if (event.data === 2 || event.data === 3 || event.data === 0) {
            setYtPlaying(false);
          }
        },
      },
    });
  };
  
  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert('Live stream link copied to clipboard!');
    });
  };

  const handleClose = () => {
    closeStream();
    if (onClose) onClose();
  };


  return (
    <div className="fixed inset-0 z-100 bg-linear-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Background blur overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwxMDIsMTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg.white/20 text-white transition-all backdrop-blur-sm border border-white/10"
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Leave</span>
          </button>
          
          {/* Fullscreen button removed */}

          {isLive && (
            <div className="flex items.center gap-2 bg-red-600/90 backdrop-blur-sm px-3 py-1.5 rounded-md animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="font-bold text-white text-xs">LIVE</span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-2 text-white/80">
            <Users className="w-4 h-4" />
            <span className="font-semibold text-white">{viewerCount.toLocaleString()}</span>
            <span className="text-sm">watching</span>
          </div>

          {isLive && streamDuration > 0 && (
            <div className="hidden lg:flex items-center gap-2 text-white/60 text-sm">
              <Clock className="w-4 h-4" />
              <span>Started {formatDuration(streamDuration)} ago</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className={cn(
              "p-2 rounded-lg transition-all backdrop-blur-sm border",
              showChat 
                ? "bg-[#FF660F] text-white border-[#FF660F]" 
                : "bg-white/10 text-white border-white/10 hover:bg-white/20"
            )}
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          {/* Minimize button removed */}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative flex h-[calc(100vh-80px)]">
        {/* Video Player Section */}
        <div className={cn(
          "relative flex-1 flex flex-col transition-all duration-300 bg-black/40 backdrop-blur-xl border-r border-white/10"
        )}>
          {/* Player Container */}
          <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              {platform === 'youtube' ? (
                <>
                  <div 
                    id="yt-player" 
                    className="w-full h-full"
                    style={{
                      aspectRatio: '16/9',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                  ></div>
                  
                  <div 
                    className="absolute inset-0 z-20 cursor-default"
                    style={{ 
                      pointerEvents: 'auto',
                      background: 'transparent'
                    }}
                    title="Live Stream"
                  />
                  {(ytLoading || !ytPlaying) && (
                    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/90">
                      <svg className="animate-spin mb-4" width="48" height="48" viewBox="0 0 50 50">
                        <circle cx="25" cy="25" r="20" fill="none" stroke="#FA660F" strokeWidth="5" strokeLinecap="round" strokeDasharray="31.4 31.4"/>
                      </svg>
                    </div>
                  )}

                  <div 
                    className="absolute bottom-0 right-0 z-30 flex items-end justify-end"
                    style={{ 
                      width: '200px',
                      height: '60px',
                      pointerEvents: 'none',
                      background: 'transparent'
                    }}
                  >
                    <div style={{background: 'rgba(0,0,0,1)', borderTopLeftRadius: '12px', padding: '6px 10px 4px 12px', width:'200px', height:'40px' ,  display: "block"}}>
                      {/* branding */}
                      <h1>ProCounsel</h1>
                    </div>
                  </div>
                </>
              ) : platform === 'livepeer' ? (
                <iframe
                    // The videoId prop contains the playback ID
                    src={`https://lvpr.tv/?v=${videoId}`}
                    title={_streamTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/60 text-sm">
                  Live stream available on YouTube only.
                </div>
              )}
              
              {reactions.map((reaction) => (
                <div
                  key={reaction.id}
                  className="absolute bottom-20 text-4xl animate-[float_3s_ease-out_forwards] pointer-events-none z-10"
                  style={{
                    left: `${reaction.x}%`,
                    animationDelay: '0ms'
                  }}
                >
                  {reaction.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Stream Info & Reactions */}
          <div className="bg-black/60 backdrop-blur-sm border-t border-white/10 p-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => addReaction('❤️')}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-red-500/30 text-white transition-all text-xs shrink-0"
              >
                <Heart className="w-3 h-3" />
                <span>Love</span>
              </button>
              <button
                onClick={() => addReaction('👍')}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-blue-500/30 text-white transition-all text-xs shrink-0"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Like</span>
              </button>
              <button
                onClick={() => addReaction('🎓')}
                className="px-2 py-1 rounded-md bg.white/10 hover:bg-[#FF660F]/30 text-white transition-all shrink-0"
              >
                🎓
              </button>
              <button
                onClick={() => addReaction('👏')}
                className="px-2 py-1 rounded-md bg.white/10 hover:bg-yellow-500/30 text-white transition-all shrink-0"
              >
                👏
              </button>
              <button
                onClick={() => addReaction('🔥')}
                className="px-2 py-1 rounded-md bg.white/10 hover:bg-orange-500/30 text-white transition-all shrink-0"
              >
                🔥
              </button>
              
              <button 
                onClick={handleCopyLink}
                className="ml-auto flex items-center gap-1 px-2 py-1 rounded-md bg-[#FF660F] hover:bg-[#FF660F]/90 text-white transition-all text-xs shrink-0"
              >
                <Share2 className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="absolute lg:relative right-0 top-0 bottom-0 w-full sm:w-96 bg-black/40 backdrop-blur-xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h3 className="text-white font-bold">Live Chat</h3>
                <p className="text-white/60 text-sm">{viewerCount} participants</p>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
            >
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex gap-3 animate-in slide-in-from-bottom-2">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#FF660F] to-orange-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-white font-semibold text-sm">{msg.user}</span>
                      <span className="text-white/40 text-xs">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm wrap-break-word">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Send a message..."
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF660F] focus:border-transparent transition-all"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className="px-6 py-3 bg-[#FF660F] hover:bg-[#FF660F]/90 disabled:bg-white/10 disabled:text-white/40 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-100px) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-200px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
