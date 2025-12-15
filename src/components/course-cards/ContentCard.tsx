import { Lock, ChevronRight, Play, Pause, SkipBack, SkipForward, Maximize, Minimize } from "lucide-react";
// import { useAuthStore } from "@/store/AuthStore";
import type { CourseContent } from "@/api/course";
import { useState, useEffect, useRef } from "react";

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

type ContentCardProps = {
  courseContents?: CourseContent[];
  currentPath?: string[];
  setCurrentPath?: (path: string[]) => void;
  isPurchased?: boolean;
  userRole?: string;
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'folder':
      return <img src="/folder.svg" alt="" />;
    case 'video':
      return <img src="/video.svg" alt="" />;
    case 'link':
      return <img src="/video.svg" alt="" />; // YouTube/video link
    case 'doc':
      return <img src="/pdf.svg" alt="" />;
    case 'image':
      return <img src="/pdf.svg" alt="" />;
    default:
      return <img src="/pdf.svg" alt="" />;
  }
};

// Helper to extract YouTube video ID
const extractYouTubeVideoId = (urlOrId: string): string => {
  if (!urlOrId) return '';
  
  // If it's already just an ID (11 characters), return it
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return urlOrId;
  }
  
  // Extract from various YouTube URL formats
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
  
  return urlOrId;
};

export default function ContentCard({ 
  courseContents = [],
  currentPath = ['root'],
  setCurrentPath,
  isPurchased = false,
  userRole
}: ContentCardProps) {
  // const { role } = useAuthStore();
  const shouldBlurContent = !isPurchased && (userRole === 'user' || userRole === 'student');
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState<CourseContent | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullscreenPlayerRef = useRef<YTPlayer | null>(null);

  // Initialize YouTube player when a link/video is selected
  useEffect(() => {
    if (!selectedFile || (selectedFile.type !== 'link' && selectedFile.type !== 'video')) {
      return;
    }

    const playerId = `player-${selectedFile.courseContentId}`;
    
    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer(playerId, playerRef);
      };
    } else {
      initializePlayer(playerId, playerRef);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [selectedFile]);

  // Initialize fullscreen player when entering fullscreen
  useEffect(() => {
    if (isFullscreen && selectedFile && window.YT) {
      const playerId = `player-fs-${selectedFile.courseContentId}`;
      
      // Get current state from normal player BEFORE switching
      const wasPlaying = isPlaying;
      const currentPos = currentTime;
      
      // Pause normal player to prevent audio overlap
      if (playerRef.current) {
        const normalPlayer = playerRef.current as any;
        if (normalPlayer.pauseVideo) {
          normalPlayer.pauseVideo();
        }
      }
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        initializePlayer(playerId, fullscreenPlayerRef);
        
        // After fullscreen player initializes, seek to position and play if needed
        setTimeout(() => {
          if (fullscreenPlayerRef.current) {
            const fsPlayer = fullscreenPlayerRef.current as any;
            if (fsPlayer.seekTo) {
              fsPlayer.seekTo(currentPos, true);
              if (wasPlaying && fsPlayer.playVideo) {
                fsPlayer.playVideo();
              }
            }
          }
        }, 500);
      }, 100);
    } else if (!isFullscreen && fullscreenPlayerRef.current) {
      // Exiting fullscreen - get state from fullscreen player
      const fsPlayer = fullscreenPlayerRef.current as any;
      const wasPlaying = isPlaying;
      const currentPos = fsPlayer.getCurrentTime ? fsPlayer.getCurrentTime() : currentTime;
      
      // Destroy fullscreen player
      fullscreenPlayerRef.current.destroy();
      fullscreenPlayerRef.current = null;
      
      // Resume normal player at same position
      setTimeout(() => {
        if (playerRef.current) {
          const normalPlayer = playerRef.current as any;
          if (normalPlayer.seekTo) {
            normalPlayer.seekTo(currentPos, true);
            if (wasPlaying && normalPlayer.playVideo) {
              normalPlayer.playVideo();
            }
          }
        }
      }, 100);
    }

    return () => {
      if (fullscreenPlayerRef.current && !isFullscreen) {
        fullscreenPlayerRef.current.destroy();
        fullscreenPlayerRef.current = null;
      }
    };
  }, [isFullscreen, selectedFile]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if video is selected
      if (!selectedFile || (selectedFile.type !== 'link' && selectedFile.type !== 'video')) return;
      
      switch(e.key.toLowerCase()) {
        case ' ':
        case 'spacebar':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'arrowleft':
          e.preventDefault();
          handleSkip(-10);
          break;
        case 'arrowright':
          e.preventDefault();
          handleSkip(10);
          break;
        case 'f':
          e.preventDefault();
          setIsFullscreen(!isFullscreen);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFile, isFullscreen, isPlaying, currentTime, duration]);

  // Track video progress
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        // Get current time from active player
        const activePlayer = isFullscreen ? fullscreenPlayerRef.current : playerRef.current;
        const player = activePlayer as any;
        if (player && player.getCurrentTime) {
          const newTime = player.getCurrentTime();
          setCurrentTime(newTime);
        }
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, isFullscreen]);

  const initializePlayer = (playerId: string, targetPlayerRef: React.MutableRefObject<YTPlayer | null>) => {
    if (!selectedFile) return;

    const videoId = selectedFile.type === 'link' 
      ? extractYouTubeVideoId(selectedFile.documentUrl || '')
      : '';

    if (!videoId && selectedFile.type === 'link') return;

    try {
      targetPlayerRef.current = new YT.Player(playerId, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0, // Disable YouTube controls - we have custom ones
          disablekb: 1, // Disable keyboard shortcuts (prevents YouTube shortcuts)
          modestbranding: 1, // Minimal YouTube branding
          rel: 0, // Don't show related videos
          fs: 0, // Disable fullscreen button (prevents going to YouTube)
          playsinline: 1, // Play inline on mobile
          iv_load_policy: 3, // Disable video annotations
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            console.log('YouTube player ready');
            setDuration(event.target.getDuration());
            // Sync fullscreen player with main player
            if (targetPlayerRef === fullscreenPlayerRef && playerRef.current) {
              const mainPlayer = playerRef.current as any;
              if (mainPlayer.getCurrentTime) {
                const currentPos = mainPlayer.getCurrentTime();
                event.target.seekTo(currentPos, true);
                if (isPlaying) {
                  event.target.playVideo();
                }
              }
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState: UNSTARTED=-1, ENDED=0, PLAYING=1, PAUSED=2, BUFFERING=3, CUED=5
            setIsPlaying(event.data === 1);
          },
        },
      });
    } catch (error) {
      console.error('Error initializing YouTube player:', error);
    }
  };

  const handlePlayPause = () => {
    const activePlayer = isFullscreen ? fullscreenPlayerRef.current : playerRef.current;
    if (activePlayer) {
      if (isPlaying) {
        activePlayer.pauseVideo();
      } else {
        activePlayer.playVideo();
      }
    }
  };

  const handleSeek = (newTime: number) => {
    const activePlayer = isFullscreen ? fullscreenPlayerRef.current : playerRef.current;
    if (activePlayer) {
      const player = activePlayer as any;
      if (player.seekTo) {
        player.seekTo(newTime, true);
        setCurrentTime(newTime);
      }
    }
  };

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    handleSeek(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentPathString = () => {
    // Remove 'Contents' from path for data filtering since it's UI-only
    // E.g., ['root', 'Contents', 'Live Sessions'] -> 'root/Live Sessions'
    const pathWithoutContents = currentPath.filter(p => p !== 'Contents');
    return pathWithoutContents.join('/');
  };

  // Show items at current path
  const currentItems = courseContents.filter(item => item.parentPath === getCurrentPathString());

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getItemDescription = (item: CourseContent) => {
    if (item.type === 'folder') {
      const childItems = courseContents.filter(c => c.parentPath === item.path);
      const videos = childItems.filter(c => c.type === 'video' || c.type === 'link').length;
      const docs = childItems.filter(c => c.type === 'doc' || c.type === 'image').length;
      
      const parts = [];
      if (videos > 0) parts.push(`${videos} video(s)`);
      if (docs > 0) parts.push(`${docs} file(s)`);
      
      return parts.length > 0 ? parts.join(', ') : '0 items';
    }
    // Show descriptive text for links instead of file size
    if (item.type === 'link') {
      return 'Video link';
    }
    return formatFileSize(item.fileSize);
  };


  const handleItemClick = (item: CourseContent) => {
    if (item.type === 'folder') {
      // Navigate into folder by using its actual path
      // Convert item.path to array format, e.g., "root/Live Sessions" -> ['root', 'Contents', 'Live Sessions']
      const pathParts = item.path.split('/');
      // Insert 'Contents' after 'root' for UI consistency
      const newPath = ['root', 'Contents', ...pathParts.slice(1)];
      if (setCurrentPath) {
        setCurrentPath(newPath);
      }
    } else if (item.type === 'video' || item.type === 'link' || item.type === 'image') {
      // Open file preview
      setSelectedFile(item);
      setShowFilePreview(true);
    } else if (item.type === 'doc' && item.documentUrl) {
      // Open PDF in new tab for better viewing
      window.open(item.documentUrl, '_blank');
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (setCurrentPath && index < currentPath.length - 1) {
      setCurrentPath(currentPath.slice(0, index + 1));
    }
  };

  return (
    <div className="bg-white rounded-2xl border p-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3 gap-3">
        <h1 className="text-[#343C6A] font-semibold text-lg md:text-[1.25rem] shrink-0">
          Content
        </h1>
        {currentPath.length > 1 && (
          <div className="flex items-center gap-1.5 text-xs md:text-sm overflow-x-auto max-w-[200px] md:max-w-none scrollbar-hide">
            {currentPath.map((folder, index) => (
              <div key={index} className="flex items-center gap-1.5 shrink-0">
                {index > 0 && <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />}
                <button
                  onClick={() => handleBreadcrumbClick(index)}
                  className={`cursor-pointer whitespace-nowrap ${
                    index === currentPath.length - 1
                      ? 'text-[#13097D] font-semibold'
                      : 'text-gray-500 hover:text-[#13097D]'
                  }`}
                >
                  {folder === 'root' ? 'Home' : folder === 'Contents' ? 'Contents' : folder}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Show single "Contents" folder if we're at root */}
      {currentPath.length === 1 && currentPath[0] === 'root' ? (
        courseContents.filter(item => item.parentPath === 'root').length === 0 ? (
          <p className="text-[#8C8CA1] text-center py-8">No content available</p>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${shouldBlurContent ? "blur-md pointer-events-none" : ""}`}>
            <div 
              className="relative group h-14 bg-[#F5F5F5] rounded-[12px] flex justify-between items-center p-4 cursor-pointer hover:bg-gray-200 w-full"
              onClick={() => setCurrentPath && setCurrentPath(['root', 'Contents'])}
            >
              <div className="flex gap-3 flex-1 min-w-0">
                <img src="/folder.svg" alt="" className="w-6 h-6" />
                <div className="flex flex-col min-w-0">
                  <h1 className="text-[1rem] font-semibold text-[#242645] truncate">
                    Contents
                  </h1>
                  <p className="text-[0.875rem] font-normal text-[#8C8CA1] truncate">
                    {courseContents.filter(item => item.parentPath === 'root').length} item(s)
                  </p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
        )
      ) : currentPath.length === 2 && currentPath[1] === 'Contents' ? (
        /* Show only root-level content when inside "Contents" folder */
        courseContents.filter(item => item.parentPath === 'root').length === 0 ? (
          <p className="text-[#8C8CA1] text-center py-8">No content available</p>
        ) : (
          <div className={`flex gap-4 flex-wrap ${shouldBlurContent ? "blur-md pointer-events-none" : ""}`}>
            {courseContents.filter(item => item.parentPath === 'root').map((item) => (
              <div 
                key={item.courseContentId} 
                className={`relative group h-14 bg-[#F5F5F5] w-90 rounded-[12px] flex justify-between items-center p-4 cursor-pointer hover:bg-gray-200`}
                onClick={() => handleItemClick(item)}
              >
                <div className="flex gap-3 flex-1 min-w-0">
                  {getFileIcon(item.type)}
                  <div className="flex flex-col min-w-0">
                    <h1 className="text-[1rem] font-semibold text-[#242645] truncate" title={item.name}>
                      {item.name}
                    </h1>
                    <p className="text-[0.875rem] font-normal text-[#8C8CA1] truncate" title={getItemDescription(item)}>
                      {getItemDescription(item)}
                    </p>
                  </div>
                </div>
                {item.type === 'folder' && <ChevronRight className="text-gray-400" />}
              </div>
            ))}
          </div>
        )
      ) : (
        /* Show items at current path for deeper navigation */
        currentItems.length === 0 ? (
          <p className="text-[#8C8CA1] text-center py-8">No content in this folder</p>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${shouldBlurContent ? "blur-md pointer-events-none" : ""}`}>
            {currentItems.map((item) => (
              <div 
                key={item.courseContentId} 
                className={`relative group h-14 bg-[#F5F5F5] rounded-[12px] flex justify-between items-center p-4 cursor-pointer hover:bg-gray-200 w-full`}
                onClick={() => handleItemClick(item)}
              >
                <div className="flex gap-3 flex-1 min-w-0">
                  {getFileIcon(item.type)}
                  <div className="flex flex-col min-w-0">
                    <h1 className="text-[1rem] font-semibold text-[#242645] truncate" title={item.name}>
                      {item.name}
                    </h1>
                    <p className="text-[0.875rem] font-normal text-[#8C8CA1] truncate" title={getItemDescription(item)}>
                      {getItemDescription(item)}
                    </p>
                  </div>
                </div>
                {item.type === 'folder' && <ChevronRight className="text-gray-400" />}
              </div>
            ))}
          </div>
        )
      )}

      {shouldBlurContent && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-2xl">
          <Lock className="w-12 h-12 text-[#343C6A] mb-3" />
          <h3 className="text-lg font-semibold text-[#343C6A] mb-1">
            Content Locked
          </h3>
          <p className="text-sm text-[#8C8CA1] mb-4">
            Purchase this course to access all content
          </p>
        </div>
      )}

      {/* Inline Video/Image Player - Shows instead of file list when selected */}
      {showFilePreview && selectedFile && (
        <div className="mt-4">
          {/* Back Button */}
          <button
            onClick={() => {
              setShowFilePreview(false);
              setSelectedFile(null);
            }}
            className="flex items-center gap-2 mb-4 px-4 py-2 text-[#13097D] hover:bg-[#13097D]/10 rounded-lg transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            <span className="font-semibold">Back to files</span>
          </button>

          {/* Content Title */}
          <h2 className="text-xl font-bold text-[#343C6A] mb-4">{selectedFile.name}</h2>

          {/* Content Player/Viewer */}
          <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg">
            {selectedFile.type === 'link' || selectedFile.type === 'video' ? (
              <div 
                className="relative"
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
              >
                {/* Video Player with rotation for mobile recordings */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <div 
                    id={`player-${selectedFile.courseContentId}`}
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
                  
                  {/* Custom Controls Overlay */}
                  <div 
                    className={`absolute inset-0 z-20 transition-opacity duration-300 ${
                      showControls ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)' }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 space-y-2 md:space-y-3">
                      {/* Progress Bar */}
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        className="w-full h-1 md:h-1.5 rounded-lg cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #FA660F 0%, #FA660F ${(currentTime / duration) * 100}%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)`
                        }}
                      />
                      
                      {/* Control Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3">
                          {/* Play/Pause */}
                          <button
                            onClick={handlePlayPause}
                            className="w-10 h-10 md:w-12 md:h-12 bg-[#FA660F] hover:bg-[#e55e0e] rounded-full flex items-center justify-center transition cursor-pointer shadow-lg"
                          >
                            {isPlaying ? (
                              <Pause className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" />
                            ) : (
                              <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-white ml-0.5" />
                            )}
                          </button>
                          
                          {/* Skip Back 10s */}
                          <button
                            onClick={() => handleSkip(-10)}
                            className="hidden sm:flex px-2 md:px-3 py-1.5 md:py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs md:text-sm font-semibold transition cursor-pointer items-center gap-1"
                          >
                            <SkipBack className="w-3 h-3 md:w-4 md:h-4" />
                            <span>10s</span>
                          </button>
                          
                          {/* Skip Forward 10s */}
                          <button
                            onClick={() => handleSkip(10)}
                            className="hidden sm:flex px-2 md:px-3 py-1.5 md:py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-xs md:text-sm font-semibold transition cursor-pointer items-center gap-1"
                          >
                            <span>10s</span>
                            <SkipForward className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                          
                          {/* Time Display */}
                          <span className="text-white text-xs md:text-sm font-medium hidden md:inline">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>
                        
                        {/* Fullscreen Button */}
                        <button
                          onClick={() => setIsFullscreen(!isFullscreen)}
                          className="w-8 h-8 md:w-10 md:h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition cursor-pointer"
                        >
                          {isFullscreen ? (
                            <Minimize className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          ) : (
                            <Maximize className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Block YouTube clicks */}
                  <div 
                    className="absolute inset-0 z-10 cursor-default" 
                    style={{ pointerEvents: showControls ? 'none' : 'auto' }} 
                    onClick={handlePlayPause}
                  />
                </div>
              </div>
            ) : selectedFile.type === 'image' ? (
              /* Image Viewer */
              <img 
                src={selectedFile.documentUrl || ''} 
                alt={selectedFile.name}
                className="w-full h-auto"
              />
            ) : null}
          </div>

          {/* Info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {selectedFile.type === 'link' || selectedFile.type === 'video' 
                ? 'Video is optimized for learning. Use the controls below the video to play/pause.'
                : 'View or download this file for your studies.'}
            </p>
          </div>
        </div>
      )}

      {/* Custom Fullscreen Modal */}
      {isFullscreen && selectedFile && (selectedFile.type === 'link' || selectedFile.type === 'video') && (
        <div 
          className="fixed inset-0 z-[100] bg-black"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          onTouchStart={() => setShowControls(true)}
          onTouchEnd={() => setTimeout(() => setShowControls(false), 3000)}
        >
          {/* Full Screen Video - FILLS ENTIRE SCREEN WITH ROTATION */}
          <div className="absolute inset-0 bg-black overflow-hidden">
            {/* Video player */}
            <div 
              id={`player-fs-${selectedFile.courseContentId}`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: window.innerWidth < 768 ? '100vw' : '100vh',
                height: window.innerWidth < 768 ? '100vh' : '100vw',
                transform: window.innerWidth < 768 
                  ? 'translate(-50%, -50%)' 
                  : 'translate(-50%, -50%) rotate(-90deg)',
              }}
            />
            
            {/* Transparent overlay to block YouTube UI */}
            <div 
              className="absolute inset-0 z-[5]"
              style={{ 
                pointerEvents: showControls ? 'none' : 'auto',
                background: 'transparent',
              }}
              onClick={handlePlayPause}
              onTouchEnd={(e) => { e.preventDefault(); handlePlayPause(); }}
            />
          </div>
          
          {/* Controls Overlay - NOT rotated, always horizontal */}
          <div 
            className={`absolute inset-0 z-20 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)' }}
          >
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 space-y-3 md:space-y-4">
              {/* Progress Bar */}
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-1.5 md:h-2 rounded-lg cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #FA660F 0%, #FA660F ${(currentTime / duration) * 100}%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)`
                }}
              />
              
              {/* Control Buttons */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 md:gap-4">
                  {/* Play/Pause */}
                  <button 
                    onClick={handlePlayPause} 
                    className="w-12 h-12 md:w-14 md:h-14 bg-[#FA660F] hover:bg-[#e55e0e] rounded-full flex items-center justify-center transition cursor-pointer shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 md:w-7 md:h-7 text-white fill-white" />
                    ) : (
                      <Play className="w-6 h-6 md:w-7 md:h-7 text-white fill-white ml-0.5" />
                    )}
                  </button>
                  
                  {/* Skip Back */}
                  <button 
                    onClick={() => handleSkip(-10)} 
                    className="hidden sm:flex px-3 md:px-4 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm md:text-base font-semibold transition cursor-pointer items-center gap-2"
                  >
                    <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
                    <span>10s</span>
                  </button>
                  
                  {/* Skip Forward */}
                  <button 
                    onClick={() => handleSkip(10)} 
                    className="hidden sm:flex px-3 md:px-4 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm md:text-base font-semibold transition cursor-pointer items-center gap-2"
                  >
                    <span>10s</span>
                    <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  
                  {/* Time */}
                  <span className="text-white text-sm md:text-lg font-medium hidden md:inline">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                
                {/* Exit Fullscreen */}
                <button 
                  onClick={() => setIsFullscreen(false)} 
                  className="px-3 md:px-4 py-2 md:py-3 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 transition cursor-pointer"
                >
                  <Minimize className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  <span className="text-white text-xs md:text-base font-semibold">Exit</span>
                </button>
              </div>
              
              {/* Keyboard Hints */}
              <div className="hidden md:flex items-center gap-4 text-white/60 text-xs">
                <span>Space: Play/Pause</span>
                <span>← →: Skip 10s</span>
                <span>F: Fullscreen</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
