import { Lock, ChevronRight } from "lucide-react";
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
        initializePlayer(playerId);
      };
    } else {
      initializePlayer(playerId);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [selectedFile]);

  const initializePlayer = (playerId: string) => {
    if (!selectedFile) return;

    const videoId = selectedFile.type === 'link' 
      ? extractYouTubeVideoId(selectedFile.documentUrl || '')
      : '';

    if (!videoId && selectedFile.type === 'link') return;

    try {
      playerRef.current = new YT.Player(playerId, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 1, // Enable play/pause and skip controls
          disablekb: 1, // Disable keyboard shortcuts (prevents YouTube shortcuts)
          modestbranding: 1, // Minimal YouTube branding
          rel: 0, // Don't show related videos
          fs: 0, // Disable fullscreen button (prevents going to YouTube)
          playsinline: 1, // Play inline on mobile
          iv_load_policy: 3, // Disable video annotations
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            console.log('YouTube player ready');
          },
        },
      });
    } catch (error) {
      console.error('Error initializing YouTube player:', error);
    }
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
    <div className="bg-white rounded-2xl border p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-[#343C6A] font-semibold text-[1.25rem]">
          Content
        </h1>
        {currentPath.length > 1 && (
          <div className="flex items-center gap-2 text-sm">
            {currentPath.map((folder, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                <button
                  onClick={() => handleBreadcrumbClick(index)}
                  className={`cursor-pointer ${
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
          <div className={`flex gap-4 flex-wrap ${shouldBlurContent ? "blur-md pointer-events-none" : ""}`}>
            <div 
              className="relative group h-14 bg-[#F5F5F5] w-90 rounded-[12px] flex justify-between items-center p-4 cursor-pointer hover:bg-gray-200"
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
          <div className={`flex gap-4 flex-wrap ${shouldBlurContent ? "blur-md pointer-events-none" : ""}`}>
            {currentItems.map((item) => (
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
              <>
                {/* Video Player with rotation */}
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
                  {/* Overlay to prevent direct YouTube interactions */}
                  <div className="absolute inset-0 z-10 cursor-default" style={{ pointerEvents: 'auto' }} />
                </div>
                
                {/* Custom Controls Below Video - Large and Visible */}
                <div className="bg-white border-t-4 border-[#FA660F] p-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => playerRef.current?.playVideo()}
                    className="w-full sm:w-auto px-8 py-4 bg-[#FA660F] hover:bg-[#e55e0e] text-white rounded-xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <span className="text-2xl">▶</span>
                    <span>Play Video</span>
                  </button>
                  <button
                    onClick={() => playerRef.current?.pauseVideo()}
                    className="w-full sm:w-auto px-8 py-4 bg-[#13097D] hover:bg-[#0f0660] text-white rounded-xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <span className="text-2xl">⏸</span>
                    <span>Pause Video</span>
                  </button>
                </div>
              </>
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
    </div>
  );
}
