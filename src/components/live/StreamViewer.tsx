import { X, MessageCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { useWebSocketChat } from '@/hooks/useWebSocketChat';
import { useAuthStore } from '@/store/AuthStore';
import toast from 'react-hot-toast';

interface StreamViewerProps {
  youtubeVideoId: string;
  streamTitle: string;
  counselorName: string;
  onClose: () => void;
}

export default function StreamViewer({ youtubeVideoId, streamTitle, counselorName, onClose }: StreamViewerProps) {
  const { user } = useAuthStore();
  const [showChat, setShowChat] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Generate unique stream ID from YouTube video ID
  const streamId = `stream-${youtubeVideoId}`;

  // Use WebSocket chat hook
  const { messages: chatMessages, sendMessage, isConnected, error } = useWebSocketChat({
    streamId,
    userName: user?.name || 'Guest',
    role: 'user'
  });

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Show error toast if WebSocket fails
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden flex flex-col">
       {/* Background pattern */}
       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwxMDIsMTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm border border-white/10"
          >
            <X className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Close</span>
          </button>
          
          {/* Live Badge */}
          <div className="flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-3 py-1.5 rounded-md animate-pulse">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="font-bold text-white text-xs">LIVE</span>
          </div>

          <div className="hidden md:block">
            <h3 className="text-white font-semibold">{streamTitle}</h3>
            <p className="text-white/60 text-sm">with {counselorName}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
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

      {/* Main Content */}
      <div className="relative flex h-[calc(100vh-80px)]">
        {/* Video Area */}
        <div className={cn(
          "relative flex-1 flex flex-col transition-all duration-300",
          showChat ? "lg:w-[calc(100%-384px)]" : "w-full"
        )}>
          <div className="relative flex-1 bg-black flex items-center justify-center">
            {/* YouTube Embed */}
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
              title={streamTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="absolute lg:relative right-0 top-0 bottom-0 w-full sm:w-96 bg-black/40 backdrop-blur-xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-white/10">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h3 className="text-white font-bold">Live Chat</h3>
                <p className="text-white/60 text-sm">{isConnected ? 'Connected' : 'Connecting...'}</p>
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
                    msg.isHost ? "bg-red-600" : "bg-gradient-to-br from-[#FF660F] to-orange-600"
                  )}>
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={cn("font-semibold text-sm", msg.isHost ? "text-red-500" : "text-white")}>
                        {msg.user} {msg.isHost && "(Host)"}
                      </span>
                      <span className="text-white/40 text-xs">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm break-words">{msg.message}</p>
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
                  placeholder="Send a message..."
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
    </div>
  );
}
