import * as Broadcast from '@livepeer/react/broadcast';
import { getIngest } from '@livepeer/react/external';
import { X, Mic, MicOff, Video as VideoIcon, VideoOff, Monitor, MonitorOff, Radio, MessageCircle, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { setSessionLive, endSessionLive } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface BroadcastViewProps {
  streamKey: string;
  counselorId: string;
  streamTitle: string;
  liveSessionId: string;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: number;
  isHost: boolean;
  avatar: string;
}

// Inner component to access broadcast context
function BroadcastContent({ streamKey, counselorId, streamTitle, liveSessionId, onClose }: BroadcastViewProps) {
  const [showChat, setShowChat] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [broadcastStarted, setBroadcastStarted] = useState(false);
  const streamStartTime = useRef<number>(Date.now());
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      user: 'System',
      message: 'Click "Go Live" to start broadcasting and enable chat',
      timestamp: Date.now(),
      isHost: false,
      avatar: 'SA'
    },
    {
      id: '3',
      user: 'Student B',
      message: 'Can you explain the topic slowly?',
      timestamp: Date.now() + 2000,
      isHost: false,
      avatar: 'SB'
    }
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Store active media streams for cleanup
  const activeStreamsRef = useRef<MediaStream[]>([]);
  const screenShareStreamRef = useRef<MediaStream | null>(null);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const lastVideoStateRef = useRef<'on' | 'off'>('on');
  const lastAudioStateRef = useRef<'on' | 'off'>('on');
  const lastScreenShareStateRef = useRef<'on' | 'off'>('off');

  // Set up Firebase
  useEffect(() => {
    // Check if mic permissions are available
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(stream => {
        stream.getTracks().forEach(track => track.stop());
      })
      .catch();

    // Handle browser close/tab close/refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers ignore custom messages, but still show a generic warning
      return (e.returnValue = 'Are you sure you want to leave? Your stream will end.');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [streamKey, liveSessionId]);

  // Monitor broadcast controls and AGGRESSIVELY stop ALL tracks when disabled
  useEffect(() => {
    const stopAllCameraTracks = () => {
      let stoppedCount = 0;
      
      // CRITICAL: Get ALL video elements globally
      const allVideoElements = Array.from(document.querySelectorAll('video'));
      
      allVideoElements.forEach((video: HTMLVideoElement) => {
        if (video.srcObject instanceof MediaStream) {
          const stream = video.srcObject;
          const videoTracks = stream.getVideoTracks();
          
          videoTracks.forEach(track => {
            const label = track.label.toLowerCase();
            const isScreenTrack = label.includes('screen') || label.includes('monitor') || 
                                  label.includes('display') || label.includes('window') || label.includes('tab');
            
            if (!isScreenTrack && track.readyState === 'live') {
              track.stop();
              stoppedCount++;
            }
          });
          
          // FORCE cleanup: remove ALL tracks from stream and null the source
          const remainingLive = stream.getTracks().filter(t => t.readyState === 'live');
          if (remainingLive.length === 0) {
            video.srcObject = null;
          }
        }
      });
      
    };

    const stopAllAudioTracks = () => {
      let stoppedCount = 0;
      
      // Check ALL media elements (video and audio)
      const allMediaElements = Array.from(document.querySelectorAll('video, audio'));
      
      allMediaElements.forEach((el) => {
        const mediaEl = el as HTMLVideoElement | HTMLAudioElement;
        if (mediaEl.srcObject instanceof MediaStream) {
          const stream = mediaEl.srcObject;
          const audioTracks = stream.getAudioTracks();
          
          audioTracks.forEach((track: MediaStreamTrack) => {
            if (track.readyState === 'live') {
              track.stop();
              stoppedCount++;
            }
          });
          
          // FORCE cleanup
          const remainingLive = stream.getTracks().filter(t => t.readyState === 'live');
          if (remainingLive.length === 0) {
            mediaEl.srcObject = null;
          }
        }
      });
      
    };

    const stopAllScreenTracks = () => {
    //   let stoppedCount = 0;
      
    //   const allVideoElements = Array.from(document.querySelectorAll('video'));
      
    //   allVideoElements.forEach((video: HTMLVideoElement, index) => {
    //     if (video.srcObject instanceof MediaStream) {
    //       const stream = video.srcObject;
    //       const videoTracks = stream.getVideoTracks();
          
    //       videoTracks.forEach(track => {
    //         const label = track.label.toLowerCase();
    //         const isScreenTrack = label.includes('screen') || label.includes('monitor') || 
    //                               label.includes('display') || label.includes('window') || label.includes('tab');
            
    //         if (isScreenTrack && track.readyState === 'live') {
    //           track.stop();
    //           stoppedCount++;
    //         }
    //       });
          
    //       // FORCE cleanup
    //       const remainingLive = stream.getTracks().filter(t => t.readyState === 'live');
    //       if (remainingLive.length === 0) {
    //         video.srcObject = null;
    //       }
    //     }
    //   });
      
    // };

    const interval = setInterval(() => {
      if (isCleaningUp) return;

      // Check video button state
      const videoButton = document.querySelector('[data-livepeer-video-enabled-trigger]') as HTMLButtonElement;
      if (videoButton) {
        const currentState = videoButton.getAttribute('data-state') as 'on' | 'off';
        if (currentState === 'off' && lastVideoStateRef.current === 'on') {
          stopAllCameraTracks();
        }
        lastVideoStateRef.current = currentState;
      }

      // Check audio button state
      const audioButton = document.querySelector('[data-livepeer-audio-enabled-trigger]') as HTMLButtonElement;
      if (audioButton) {
        const currentState = audioButton.getAttribute('data-state') as 'on' | 'off';
        if (currentState === 'off' && lastAudioStateRef.current === 'on') {
          stopAllAudioTracks();
        }
        lastAudioStateRef.current = currentState;
      }

      // Check screen share button state
      const screenButton = document.querySelector('[data-livepeer-screenshare-trigger]') as HTMLButtonElement;
      if (screenButton) {
        const currentState = screenButton.getAttribute('data-state') as 'on' | 'off';
        if (currentState === 'off' && lastScreenShareStateRef.current === 'on') {
          stopAllScreenTracks();
        }
        lastScreenShareStateRef.current = currentState;
      }
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [isCleaningUp]);

  // Cleanup all media tracks on unmount only
  useEffect(() => {
    // Cleanup function that runs when component unmounts
    return () => {
      
      // Stop all active streams from ref
      activeStreamsRef.current.forEach(stream => {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      });

      // Stop screen share if exists
      if (screenShareStreamRef.current) {
        screenShareStreamRef.current.getTracks().forEach(track => {
          track.stop();
        });
      }
      
      // Force stop all active media tracks globally
      document.querySelectorAll('video').forEach((video: HTMLVideoElement) => {
        if (video.srcObject instanceof MediaStream) {
          video.srcObject.getTracks().forEach(track => {
            track.stop();
          });
          video.srcObject = null;
        }
      });

      document.querySelectorAll('audio').forEach((audio: HTMLAudioElement) => {
        if (audio.srcObject instanceof MediaStream) {
          audio.srcObject.getTracks().forEach(track => {
            track.stop();
          });
          audio.srcObject = null;
        }
      });
    };
  }, [isCleaningUp]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Simulate viewer count updates
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: 'Host',
        message: messageInput,
        timestamp: Date.now(),
        isHost: true,
        avatar: 'H'
      };
      setChatMessages(prev => [...prev, newMessage]);
      setMessageInput('');
    }
  };

  const stopAllMediaTracks = () => {
    setIsCleaningUp(true);
    
    // Stop all media tracks
    document.querySelectorAll('video').forEach((video: HTMLVideoElement) => {
      if (video.srcObject instanceof MediaStream) {
        video.srcObject.getTracks().forEach(track => {
          track.stop();
        });
        video.srcObject = null;
      }
    });

    document.querySelectorAll('audio').forEach((audio: HTMLAudioElement) => {
      if (audio.srcObject instanceof MediaStream) {
        audio.srcObject.getTracks().forEach(track => {
          track.stop();
        });
        audio.srcObject = null;
      }
    });

    // Clear refs
    activeStreamsRef.current = [];
    screenShareStreamRef.current = null;
  };

  const handleEndStream = async () => {
    // Stop the Livepeer broadcast
    const enableButton = document.querySelector('[data-livepeer-enabled-trigger]') as HTMLButtonElement;
    if (enableButton && enableButton.getAttribute('data-state') === 'on') {
      enableButton.click(); // Toggle off to stop broadcast
    }
    
    // Stop all media
    stopAllMediaTracks();
    
    // End session in Firebase
    await endSessionLive(liveSessionId);
    
    // Close and go back to sessions tab
    onClose();
  };

  const handleGoLive = async () => {
    const enableButton = document.querySelector('[data-livepeer-enabled-trigger]') as HTMLButtonElement;
    if (!enableButton) {
      toast.error('Failed to start broadcast');
      return;
    }
    
    // Click to start WebRTC broadcast
    enableButton.click();
    setBroadcastStarted(true);
    streamStartTime.current = Date.now();
    
    // Update Firebase session status
    await setSessionLive(liveSessionId);
    
    // Clear initial system message and allow chat
    setChatMessages([]);
  };

  // Suppress unused param warnings
  void counselorId;
  void streamTitle;

  return (
    <>
        <Broadcast.Container className="w-full h-full relative flex flex-col">
          
          {/* Header */}
          <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-black/60 backdrop-blur-lg border-b border-white/5">
            {/* Left Side - Main Controls */}
            <div className="flex items-center gap-3">
              {!broadcastStarted ? (
                <button
                  onClick={handleGoLive}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white transition-all shadow-lg shadow-red-600/30 font-semibold"
                >
                  <Radio className="w-5 h-5" />
                  <span className="hidden sm:inline">Go Live</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowEndConfirmation(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-linear-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white transition-all shadow-lg font-semibold border border-white/10"
                >
                  <X className="w-5 h-5" />
                  <span className="hidden sm:inline">End Broadcast</span>
                </button>
              )}

              <div className="hidden md:flex items-center gap-2 text-white/70 px-3 py-1.5 rounded-lg bg-white/5">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium text-white">{viewerCount.toLocaleString()}</span>
                <span className="text-xs">watching</span>
              </div>

              {streamDuration > 0 && (
                <div className="hidden lg:flex items-center gap-2 text-white/60 text-sm px-3 py-1.5 rounded-lg bg-white/5">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(streamDuration)}</span>
                </div>
              )}
            </div>

            {/* Right Side - Status & Chat */}
            <div className="flex items-center gap-3">
               {/* Hidden enabled trigger - auto-started by handleGoLive */}
               <Broadcast.EnabledTrigger 
                 data-livepeer-enabled-trigger
                 className="hidden"
               />
              
              <Broadcast.StatusIndicator matcher="live" className="flex items-center gap-2 bg-red-600 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse shadow-lg shadow-red-600/50">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <span className="font-bold text-white text-sm">LIVE</span>
              </Broadcast.StatusIndicator>
              
              <Broadcast.StatusIndicator matcher="pending" className="flex items-center gap-2 bg-yellow-600 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                 <span className="font-bold text-white text-sm">CONNECTING...</span>
              </Broadcast.StatusIndicator>

               <button
                onClick={() => setShowChat(!showChat)}
                className={cn(
                  "p-2.5 rounded-lg transition-all border shadow-md",
                  showChat
                    ? "bg-[#13097D] text-white border-[#13097D] shadow-[#13097D]/50" 
                    : "bg-white/10 text-white border-white/10 hover:bg-white/20"
                )}
                title="Toggle chat"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="relative flex h-[calc(100vh-80px)]">
             {/* Video Area */}
             <div className={cn(
                "relative flex-1 flex flex-col transition-all duration-300 bg-black/30 border-r border-white/5"
              )}>
                <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                    <Broadcast.Video 
                        title="Live Stream" 
                        className="w-full h-full object-cover"
                    />
                    
                    <Broadcast.LoadingIndicator className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </Broadcast.LoadingIndicator>
                    
                    <Broadcast.ErrorIndicator matcher="all" className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-4 text-center">
                        <div>
                        <p className="font-bold text-red-500 mb-2">Error</p>
                        <p>Failed to access media devices or connect to server.</p>
                        </div>
                    </Broadcast.ErrorIndicator>

                    {/* Controls Overlay - Shows on hover like Zoom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/90 via-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-20 group">
                      <div className="flex items-center justify-center gap-4">
                        <Broadcast.AudioEnabledTrigger data-livepeer-audio-enabled-trigger className="p-4 rounded-full transition-all bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm data-[state=off]:bg-red-500 data-[state=off]:hover:bg-red-600">
                            <Broadcast.AudioEnabledIndicator matcher={true}>
                                <Mic className="w-5 h-5" />
                            </Broadcast.AudioEnabledIndicator>
                            <Broadcast.AudioEnabledIndicator matcher={false}>
                                <MicOff className="w-5 h-5" />
                            </Broadcast.AudioEnabledIndicator>
                        </Broadcast.AudioEnabledTrigger>

                        <Broadcast.VideoEnabledTrigger data-livepeer-video-enabled-trigger className="p-4 rounded-full transition-all bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm data-[state=off]:bg-red-500 data-[state=off]:hover:bg-red-600">
                            <Broadcast.VideoEnabledIndicator matcher={true}>
                                <VideoIcon className="w-5 h-5" />
                            </Broadcast.VideoEnabledIndicator>
                            <Broadcast.VideoEnabledIndicator matcher={false}>
                                <VideoOff className="w-5 h-5" />
                            </Broadcast.VideoEnabledIndicator>
                        </Broadcast.VideoEnabledTrigger>

                        <Broadcast.ScreenshareTrigger data-livepeer-screenshare-trigger className="p-4 rounded-full transition-all bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm data-[state=on]:bg-[#13097D] data-[state=on]:hover:bg-[#13097D]/90">
                            <Broadcast.ScreenshareIndicator matcher={false}>
                                <MonitorOff className="w-5 h-5" />
                            </Broadcast.ScreenshareIndicator>
                            <Broadcast.ScreenshareIndicator matcher={true}>
                                <Monitor className="w-5 h-5" />
                            </Broadcast.ScreenshareIndicator>
                        </Broadcast.ScreenshareTrigger>
                      </div>
                    </div>
                </div>

                {/* View Bar (Bottom) */}
                <div className="bg-black/50 backdrop-blur-md border-t border-white/5 p-4 h-[76px] flex items-center">
                    <div className="flex items-center gap-2 w-full">
                        <div className="flex-1"></div>
                    </div>
                </div>
             </div>

             {/* Chat Sidebar */}
             {showChat && (
                <div className="absolute lg:relative right-0 top-0 bottom-0 w-full sm:w-96 bg-black/50 backdrop-blur-xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-white/5">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/20">
                    <div>
                        <h3 className="text-white font-bold">Live Chat</h3>
                        <p className="text-white/60 text-sm">{viewerCount} participants</p>
                    </div>
                    <button
                        onClick={() => setShowChat(false)}
                        className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all"
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
                            msg.isHost ? "bg-[#13097D]" : "bg-gray-600"
                        )}>
                            {msg.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                            <span className={cn("font-semibold text-sm", msg.isHost ? "text-[#13097D]" : "text-white")}>
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
                    <div className="p-4 border-t border-white/5 bg-black/20">
                    <div className="flex gap-2">
                        <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Send a message as Host..."
                        className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#13097D] focus:border-[#13097D] transition-all"
                        />
                        <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="px-5 py-2.5 bg-[#13097D] hover:bg-[#13097D]/90 disabled:bg-white/5 disabled:text-white/30 text-white font-medium rounded-lg transition-all disabled:cursor-not-allowed"
                        >
                        Send
                        </button>
                    </div>
                    </div>
                </div>
             )}  
          </div>

        </Broadcast.Container>
      
      {/* End Stream Confirmation Modal */}
      {showEndConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#2d2d2d] rounded-xl shadow-2xl max-w-md w-full p-6 border border-white/10">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">End live stream?</h3>
              <p className="text-white/60 text-sm">
                This will end the stream for all viewers.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirmation(false)}
                className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEndStream}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all"
              >
                End Stream
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Wrapper component that provides Broadcast.Root context
export default function BroadcastView(props: BroadcastViewProps) {
  const ingestUrl = getIngest(props.streamKey);
  
  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f0f] overflow-hidden flex flex-col">
      <Broadcast.Root 
        ingestUrl={ingestUrl}
        video={{
          width: 1280,
          height: 720,
          frameRate: 30
        }}
        audio={{
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }}
      >
        <BroadcastContent {...props} />
      </Broadcast.Root>
    </div>
  );
}
