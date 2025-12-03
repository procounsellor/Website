import { getIngest } from '@livepeer/react/external';
import * as Broadcast from '@livepeer/react/broadcast';
import { X, Mic, MicOff, Video as VideoIcon, VideoOff, Monitor, MonitorOff, Radio, MessageCircle, Users, Clock, Share2, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { useWebSocketChat } from '@/hooks/useWebSocketChat';
import { useAuthStore } from '@/store/AuthStore';
import toast from 'react-hot-toast';

interface BroadcastViewProps {
  streamKey: string;
  counselorId: string;
  streamTitle: string;
  onClose: () => void;
}

export default function BroadcastView({ streamKey, counselorId, streamTitle, onClose }: BroadcastViewProps) {
  const ingestUrl = getIngest(streamKey);
  const { user } = useAuthStore();
  const [showChat, setShowChat] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);
  const [messageInput, setMessageInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Use WebSocket chat hook with counselorId
  const { messages: chatMessages, sendMessage, isConnected, error } = useWebSocketChat({
    counselorId,
    userName: user?.name || 'Host',
    role: 'counselor'
  });

  // Notify WebSocket server about stream creation
  useEffect(() => {
    // Chat is automatically handled by useWebSocketChat hook
    // No need to manually create WebSocket connection here
  }, [counselorId, streamTitle, user]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Simulate viewer count updates (in production, get this from WebSocket)
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => Math.max(0, prev + Math.floor(Math.random() * 5 - 2)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Track stream duration
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamDuration(prev => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Show error toast if WebSocket fails
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleCopyLink = () => {
    // Copy the current page URL (user can share this to viewers)
    const viewerUrl = window.location.origin;
    navigator.clipboard.writeText(viewerUrl).then(() => {
      toast.success('Link copied!');
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-linear-to-br from-gray-900 via-black to-gray-900 overflow-hidden flex flex-col">
       {/* Background blur overlay */}
       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwxMDIsMTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20 pointer-events-none" />

      <Broadcast.Root ingestUrl={ingestUrl}>
        <Broadcast.Container className="w-full h-full relative flex flex-col">
          
          {/* Header */}
          <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm border border-white/10"
              >
                <X className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Exit Studio</span>
              </button>
              
              <Broadcast.StatusIndicator matcher="live" className="flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-3 py-1.5 rounded-md animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="font-bold text-white text-xs">LIVE</span>
              </Broadcast.StatusIndicator>
              
              <Broadcast.StatusIndicator matcher="pending" className="flex items-center gap-2 bg-yellow-600/90 backdrop-blur-sm px-3 py-1.5 rounded-md">
                 <span className="font-bold text-white text-xs">CONNECTING...</span>
              </Broadcast.StatusIndicator>

              <div className="hidden md:flex items-center gap-2 text-white/80">
                <Users className="w-4 h-4" />
                <span className="font-semibold text-white">{viewerCount.toLocaleString()}</span>
                <span className="text-sm">watching</span>
              </div>

              {streamDuration > 0 && (
                <div className="hidden lg:flex items-center gap-2 text-white/60 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Started {formatDuration(streamDuration)} ago</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
               <Broadcast.EnabledTrigger className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all bg-[#FF660F] hover:bg-[#FF660F]/90 text-white data-[state=on]:bg-red-600 data-[state=on]:hover:bg-red-700">
                  <Broadcast.EnabledIndicator matcher={false} className="flex items-center gap-2">
                    <Radio className="w-5 h-5" />
                    Go Live
                  </Broadcast.EnabledIndicator>
                  <Broadcast.EnabledIndicator matcher={true} className="flex items-center gap-2">
                    <Radio className="w-5 h-5" />
                    End Broadcast
                  </Broadcast.EnabledIndicator>
               </Broadcast.EnabledTrigger>

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
            </div>
          </header>

          {/* Main Content Area */}
          <div className="relative flex h-[calc(100vh-80px)]">
             {/* Video Area */}
             <div className={cn(
                "relative flex-1 flex flex-col transition-all duration-300 bg-black/40 backdrop-blur-xl border-r border-white/10"
              )}>
                <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                    <Broadcast.Video 
                        title="Live Stream" 
                        className="w-full h-full object-contain"
                    />
                    
                    {/* Loading/Error States */}
                    <Broadcast.LoadingIndicator className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </Broadcast.LoadingIndicator>
                    
                    <Broadcast.ErrorIndicator matcher="all" className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-4 text-center">
                        <div>
                        <p className="font-bold text-red-500 mb-2">Error</p>
                        <p>Failed to access media devices or connect to server.</p>
                        </div>
                    </Broadcast.ErrorIndicator>

                    {/* Controls Overlay */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-4 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 z-20">
                        <Broadcast.AudioEnabledTrigger className="p-4 rounded-full transition-all bg-white/10 text-white hover:bg-white/20 data-[state=off]:bg-red-500/20 data-[state=off]:text-red-500">
                            <Broadcast.AudioEnabledIndicator matcher={true}>
                                <Mic className="w-6 h-6" />
                            </Broadcast.AudioEnabledIndicator>
                            <Broadcast.AudioEnabledIndicator matcher={false}>
                                <MicOff className="w-6 h-6" />
                            </Broadcast.AudioEnabledIndicator>
                        </Broadcast.AudioEnabledTrigger>

                        <Broadcast.VideoEnabledTrigger className="p-4 rounded-full transition-all bg-white/10 text-white hover:bg-white/20 data-[state=off]:bg-red-500/20 data-[state=off]:text-red-500">
                            <Broadcast.VideoEnabledIndicator matcher={true}>
                                <VideoIcon className="w-6 h-6" />
                            </Broadcast.VideoEnabledIndicator>
                            <Broadcast.VideoEnabledIndicator matcher={false}>
                                <VideoOff className="w-6 h-6" />
                            </Broadcast.VideoEnabledIndicator>
                        </Broadcast.VideoEnabledTrigger>

                        <Broadcast.ScreenshareTrigger className="p-4 rounded-full transition-all bg-white/10 text-white hover:bg-white/20 data-[state=on]:bg-[#FF660F] data-[state=on]:text-white">
                            <Broadcast.ScreenshareIndicator matcher={false}>
                                <MonitorOff className="w-6 h-6" />
                            </Broadcast.ScreenshareIndicator>
                            <Broadcast.ScreenshareIndicator matcher={true}>
                                <Monitor className="w-6 h-6" />
                            </Broadcast.ScreenshareIndicator>
                        </Broadcast.ScreenshareTrigger>
                    </div>
                </div>

                {/* View Bar (Bottom) - Similar to userView but for broadcaster */}
                <div className="bg-black/60 backdrop-blur-sm border-t border-white/10 p-2">
                    <div className="flex items-center gap-2">
                        {/* Reactions are removed as per request, but keeping the structure for consistency */}
                        <div className="flex-1"></div>
                        
                        <button 
                            onClick={handleCopyLink}
                            className="ml-auto flex items-center gap-1 px-2 py-1 rounded-md bg-[#FF660F] hover:bg-[#FF660F]/90 text-white transition-all text-xs shrink-0"
                        >
                            <Share2 className="w-3 h-3" />
                            <span>Copy Link</span>
                        </button>
                    </div>
                </div>
             </div>

             {/* Chat Sidebar */}
             {showChat && (
                <div className="absolute lg:relative right-0 top-0 bottom-0 w-full sm:w-96 bg-black/40 backdrop-blur-xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-white/10">
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
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0",
                            msg.isHost ? "bg-red-600" : "bg-linear-to-br from-[#FF660F] to-orange-600"
                        )}>
                            {msg.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                            <span className={cn("font-semibold text-sm", msg.isHost ? "text-red-500" : "text-white")}>
                                {msg.user} {msg.isHost && "(You)"}
                            </span>
                            <span className="text-white/40 text-xs">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Send a message as Host..."
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF660F] focus:border-transparent transition-all"
                        />
                        <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || !isConnected}
                        className="px-6 py-3 bg-[#FF660F] hover:bg-[#FF660F]/90 disabled:bg-white/10 disabled:text-white/40 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
                        >
                        Send
                        </button>
                    </div>
                    </div>
                </div>
             )}
          </div>

        </Broadcast.Container>
      </Broadcast.Root>
    </div>
  );
}
