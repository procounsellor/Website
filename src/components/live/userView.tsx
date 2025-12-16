import { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLiveStreamStore } from '@/store/LiveStreamStore';
import { useAuthStore } from '@/store/AuthStore';
import { listenToChatMessages, listenToCounselorLiveStatus, trackUserJoined, trackUserLeft } from '@/lib/firebase';
import { sendMessageInLiveSession } from '@/api/liveSessions';
import LiveEndedPopup from './LiveEndedPopup';

// YouTube IFrame API types
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

interface ChatMessage {
  messageId: string;
  userId: string;
  userName?: string;
  fullName?: string;
  message: string;
  timestamp: number;
}

// Helper function to extract YouTube video ID from URL or return as-is if already an ID
const extractYouTubeVideoId = (urlOrId: string): string => {
  if (!urlOrId) return '';
  
  // If it's already just an ID (11 characters, alphanumeric), return it
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId;
  }
  
  // Try to extract from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([a-zA-Z0-9_-]{11})/
  ];
  
  for (const pattern of patterns) {
    const match = urlOrId.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // If no pattern matches, return the original (might already be an ID)
  return urlOrId;
};

export default function LiveStreamView() {
  const { closeStream, videoId: rawVideoId, streamTitle, description, counsellorId } = useLiveStreamStore();
  const { userId } = useAuthStore();
  
  // Extract clean video ID
  const videoId = extractYouTubeVideoId(rawVideoId);
  
  const [showChat, setShowChat] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [ytLoading, setYtLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState<{ title: string; startedAt: any } | null>(null);
  const [showLiveEndedPopup, setShowLiveEndedPopup] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  // Track user joining the live session
  useEffect(() => {
    if (!counsellorId || !userId) return;

    // Track user joined
    trackUserJoined(counsellorId, userId);
    console.log('📍 User joined live session:', { counsellorId, userId });

    // Cleanup: track user left when component unmounts
    return () => {
      trackUserLeft(counsellorId, userId);
      console.log('👋 User left live session:', { counsellorId, userId });
    };
  }, [counsellorId, userId]);

  // Viewer count listener commented out - hidden from user view
  // useEffect(() => {
  //   if (!counsellorId) return;
  //
  //   console.log('🔍 UserView listening to viewer count for counsellorId:', counsellorId);
  //
  //   const unsubscribe = listenToViewerCount(
  //     counsellorId,
  //     (count) => {
  //       console.log('👥 UserView viewer count update:', count);
  //       setViewerCount(count);
  //     }
  //   );
  //
  //   return () => unsubscribe();
  // }, [counsellorId]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else {
      initializePlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId]);

  const initializePlayer = () => {
    if (!videoId) return;

    try {
      playerRef.current = new YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0, // Disable all controls
          disablekb: 1, // Disable keyboard controls
          modestbranding: 1,
          rel: 0,
          fs: 0, // Disable fullscreen button
          playsinline: 1, // Play inline on mobile
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            setYtLoading(false);
          },
        },
      });
    } catch (error) {
      console.error('Error initializing YouTube player:', error);
      setYtLoading(false);
    }
  };

  // Listen to Firebase chat messages
  useEffect(() => {
    if (!counsellorId) return;

    let previousMessageCount = 0;

    const unsubscribe = listenToChatMessages(
      counsellorId, // Use counsellorId instead of liveSessionId
      (messages: ChatMessage[]) => {
        console.log('🔥 Firebase messages received:', messages.length, messages);
        
        // Check if we have new messages
        if (messages.length > previousMessageCount) {
          // Add only the new messages
          const newMessages = messages.slice(previousMessageCount);
          console.log('➕ Adding new messages:', newMessages);
          
          setChatMessages(prev => {
            // Remove temp messages that match the new real messages
            const filteredPrev = prev.filter(msg => 
              !msg.messageId.startsWith('temp-') || 
              !newMessages.some(newMsg => 
                newMsg.userId === msg.userId && 
                newMsg.message === msg.message &&
                Math.abs(newMsg.timestamp - msg.timestamp) < 5000 // Within 5 seconds
              )
            );
            return [...filteredPrev, ...newMessages];
          });
          
          previousMessageCount = messages.length;
        } else if (messages.length < previousMessageCount) {
          // Session restarted or messages cleared
          setChatMessages(messages);
          previousMessageCount = messages.length;
        } else if (previousMessageCount === 0) {
          // Initial load
          setChatMessages(messages);
          previousMessageCount = messages.length;
        }
      },
      (info) => {
        setSessionInfo(info);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [counsellorId]);

  // Listen to counselor's live status and auto-close if session ends
  useEffect(() => {
    if (!counsellorId) return;

    const unsubscribe = listenToCounselorLiveStatus(
      counsellorId,
      (isLive, lastUpdated) => {
        console.log('🎥 Live status update:', { counsellorId, isLive, lastUpdated, type: typeof lastUpdated });
        
        if (!isLive) {
          if (!lastUpdated) {
            console.log('🛑 Stream ended (no data) - closing immediately');
            // No data means session was deleted, close immediately
            if (playerRef.current) {
              playerRef.current.destroy();
              playerRef.current = null;
            }
            closeStream();
            setShowLiveEndedPopup(true);
          } else {
            const now = Date.now();
            const lastUpdatedMs = typeof lastUpdated === 'number' ? lastUpdated : lastUpdated;
            const secondsSinceUpdate = (now - lastUpdatedMs) / 1000;
            
            console.log('⏰ Stream ended - now:', now, 'lastUpdated:', lastUpdatedMs, 'seconds:', secondsSinceUpdate);
            
            // If stream ended more than 15 seconds ago
            if (secondsSinceUpdate > 15) {
              console.log('🛑 Closing stream and showing popup');
              // Close stream immediately and show popup
              if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
              }
              closeStream();
              setShowLiveEndedPopup(true);
            } else {
              console.log('⏳ Waiting... only', secondsSinceUpdate.toFixed(1), 'seconds since update');
            }
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [counsellorId, closeStream]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isSendingMessage || !userId) return;

    const messageText = messageInput.trim();
    const tempMessageId = `temp-${Date.now()}`;
    const currentUser = useAuthStore.getState().user;
    
    // Immediately show sender's own message
    const tempMessage: ChatMessage = {
      messageId: tempMessageId,
      userId: userId,
      fullName: (currentUser?.fullName as string) || 'You',
      message: messageText,
      timestamp: Date.now()
    };
    
    setChatMessages(prev => [...prev, tempMessage]);
    setMessageInput('');
    setIsSendingMessage(true);

    try {
      await sendMessageInLiveSession(counsellorId, userId, messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove temp message on error
      setChatMessages(prev => prev.filter(m => m.messageId !== tempMessageId));
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    closeStream();
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getInitials = (fullName: string | undefined, userName: string | undefined) => {
    const name = fullName || userName;
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Top Bar */}
      <div className="relative z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Exit</span>
            </button>
            
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center gap-2 bg-[#FA660F] px-3 py-1 rounded-md shadow-md">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-white text-xs font-bold uppercase">Live</span>
              </div>
              
              {/* Viewer count hidden from user view */}
              {/* <div className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md">
                <Eye className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-xs font-semibold text-gray-700">{viewerCount}</span>
              </div> */}
            </div>
          </div>

          {/* Right Section */}
          <button
            onClick={() => setShowChat(!showChat)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium cursor-pointer",
              showChat 
                ? "bg-[#FA660F] hover:bg-[#FA660F]/90 text-white shadow-md" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            )}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        {/* Video and Info Section */}
        <div className="flex-none sm:flex-1 flex flex-col overflow-hidden">
          {/* Video Player */}
          <div className="relative bg-black flex-1 flex items-center justify-center overflow-hidden">
            {ytLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
                <div className="w-16 h-16 border-4 border-gray-300 border-t-[#FA660F] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 text-sm">Loading live stream...</p>
              </div>
            )}
            
            {/* Video Player - 16:9 aspect ratio with 90deg counter-clockwise rotation, full area */}
            <div className="relative w-full h-full overflow-hidden">
              <div 
                id="youtube-player" 
                className="absolute" 
                style={{ 
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'center center',
                  width: '177.78%',
                  height: '177.78%',
                  left: '-38.89%',
                  top: '-38.89%'
                }} 
              />
              {/* Overlay to prevent clicks and interactions */}
              <div className="absolute inset-0 z-10 cursor-default" style={{ pointerEvents: 'auto' }} />
            </div>
          </div>

          {/* Video Info Section */}
          <div className="bg-white shrink-0 sm:border-t sm:border-gray-200 border-b sm:border-b-0 border-gray-200">
            <div className="px-3 sm:px-6 py-1.5 sm:py-3">
              <h1 className="text-gray-900 text-sm sm:text-lg font-bold truncate">
                {sessionInfo?.title || streamTitle}
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-1 sm:line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="flex flex-col flex-1 sm:flex-none sm:w-[340px] lg:w-[400px] sm:border-l border-gray-200 min-h-0">
            {/* Chat Messages */}
            <style>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-2 pt-0 pb-2 bg-white hide-scrollbar flex flex-col min-h-0"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {chatMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
                  <MessageCircle className="w-8 sm:w-12 h-8 sm:h-12 text-gray-300 mb-2" />
                  <p className="text-gray-600 text-xs sm:text-sm">Welcome to live chat!</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {chatMessages.map((msg) => (
                    <div key={msg.messageId} className="px-2 py-1 hover:bg-gray-50 rounded">
                      <div className="flex gap-2 sm:gap-3">
                        <div className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-linear-to-br from-[#FA660F] to-[#13097D] flex items-center justify-center text-white text-[10px] sm:text-xs font-bold mt-1">
                          {getInitials(msg.fullName, msg.userName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                            <span className="text-[11px] sm:text-xs font-semibold text-gray-900">
                              {msg.fullName || msg.userName || 'Anonymous'}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-500">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-800 wrap-break-word mt-0.5">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input Area - aligned with title section height */}
            <div className="border-t border-gray-200 bg-white shrink-0">
              <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center">
                {userId ? (
                  <div className="flex gap-2 items-center flex-1">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Say something..."
                      disabled={isSendingMessage}
                      className="flex-1 bg-gray-50 text-gray-900 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm placeholder:text-gray-500 focus:outline-none focus:bg-gray-100 disabled:opacity-50 border border-gray-200"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || isSendingMessage}
                      className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 bg-[#FA660F] hover:bg-[#FA660F]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors flex items-center justify-center"
                    >
                      <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2 flex-1">
                    <p className="text-gray-500 text-xs sm:text-sm">Sign in to chat</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Floating Chat Button (Mobile) */}
        {!showChat && (
          <button
            onClick={() => setShowChat(true)}
            className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#FA660F] hover:bg-[#FA660F]/90 text-white rounded-full shadow-2xl flex items-center justify-center z-30 transition-transform active:scale-95"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Live Ended Popup */}
      {showLiveEndedPopup && (
        <LiveEndedPopup
          onClose={() => {
            setShowLiveEndedPopup(false);
          }}
        />
      )}
    </div>
  );
}
