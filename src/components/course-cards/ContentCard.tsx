import { Lock, ChevronRight, X, Play, FileText, Download } from "lucide-react";
import { useAuthStore } from "@/store/AuthStore";
import type { CourseContent } from "@/api/course";
import { useState } from "react";

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
    case 'doc':
      return <img src="/pdf.svg" alt="" />;
    case 'image':
      return <img src="/pdf.svg" alt="" />;
    default:
      return <img src="/pdf.svg" alt="" />;
  }
};

export default function ContentCard({ 
  courseContents = [],
  currentPath = ['root'],
  setCurrentPath,
  isPurchased = false,
  userRole
}: ContentCardProps) {
  const { role } = useAuthStore();
  const shouldBlurContent = !isPurchased && (userRole === 'user' || userRole === 'student');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [modalPath, setModalPath] = useState<string[]>(['root']);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [selectedFile, setSelectedFile] = useState<CourseContent | null>(null);

  const getCurrentPathString = () => currentPath.join('/');
  const getModalPathString = () => modalPath.join('/');

  // Show items at current path
  const currentItems = courseContents.filter(item => item.parentPath === getCurrentPathString());
  const modalItems = courseContents.filter(item => item.parentPath === getModalPathString());

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getItemDescription = (item: CourseContent) => {
    if (item.type === 'folder') {
      const childItems = courseContents.filter(c => c.parentPath === item.path);
      const videos = childItems.filter(c => c.type === 'video').length;
      const docs = childItems.filter(c => c.type === 'doc' || c.type === 'image').length;
      
      const parts = [];
      if (videos > 0) parts.push(`${videos} video(s)`);
      if (docs > 0) parts.push(`${docs} file(s)`);
      
      return parts.length > 0 ? parts.join(', ') : '0 items';
    }
    return formatFileSize(item.fileSize);
  };

  const handleItemClick = (item: CourseContent) => {
    if (item.type === 'folder') {
      setModalPath(['root', item.name]);
      setShowFolderModal(true);
    } else if (item.type === 'video') {
      setSelectedFile(item);
      setShowFilePreview(true);
    } else if (item.documentUrl) {
      window.open(item.documentUrl, '_blank');
    }
  };

  const handleModalItemClick = (item: CourseContent) => {
    if (item.type === 'folder') {
      const newPath = [...modalPath, item.name];
      setModalPath(newPath);
    } else if (item.type === 'video') {
      setSelectedFile(item);
      setShowFilePreview(true);
    } else if (item.documentUrl) {
      window.open(item.documentUrl, '_blank');
    }
  };

  const handleModalBreadcrumbClick = (index: number) => {
    if (index < modalPath.length - 1) {
      setModalPath(modalPath.slice(0, index + 1));
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
                  className={`${
                    index === currentPath.length - 1
                      ? 'text-[#13097D] font-semibold'
                      : 'text-gray-500 hover:text-[#13097D]'
                  }`}
                >
                  {folder === 'root' ? 'Home' : folder}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {currentItems.length === 0 ? (
        <p className="text-[#8C8CA1] text-center py-8">No content available</p>
      ) : (
        <div className={`flex gap-4 flex-wrap ${shouldBlurContent ? "blur-md pointer-events-none" : ""}`}>
          {currentItems.map((item) => (
            <div 
              key={item.courseContentId} 
              className={`h-[56px] bg-[#F5F5F5] w-90 rounded-[12px] flex justify-between items-center p-4 cursor-pointer hover:bg-gray-200`}
              onClick={() => handleItemClick(item)}
            >
              <div className="flex gap-3">
                {getFileIcon(item.type)}
                <div className="flex flex-col">
                  <h1 className="text-[1rem] font-semibold text-[#242645]">
                    {item.name}
                  </h1>
                  <p className="text-[0.875rem] font-normal text-[#8C8CA1]">
                    {getItemDescription(item)}
                  </p>
                </div>
              </div>

              {item.type === 'folder' && <ChevronRight className="text-gray-400" />}
            </div>
          ))}
        </div>
      )}

      {shouldBlurContent && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-2xl">
          <Lock className="w-12 h-12 text-[#343C6A] mb-3" />
          <p className="text-[#343C6A] font-semibold text-lg">
            Purchase the course to access content
          </p>
        </div>
      )}

      {/* File Preview Modal */}
      {showFilePreview && selectedFile && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowFilePreview(false);
            setSelectedFile(null);
          }}
        >
          <div 
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => {
                setShowFilePreview(false);
                setSelectedFile(null);
              }}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {selectedFile.type === 'video' ? (
              <video 
                controls 
                autoPlay
                className="w-full max-h-[80vh] rounded-lg"
                src={selectedFile.documentUrl || ''}
              >
                Your browser does not support the video tag.
              </video>
            ) : selectedFile.type === 'image' ? (
              <img 
                src={selectedFile.documentUrl || ''} 
                alt={selectedFile.name}
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
            ) : null}

            <div className="mt-4 text-white text-center">
              <h2 className="text-xl font-semibold mb-2">{selectedFile.name}</h2>
              <p className="text-sm text-gray-300">{formatFileSize(selectedFile.fileSize)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Folder Modal */}
      {showFolderModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowFolderModal(false);
            setModalPath(['root']);
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm flex-1">
                {modalPath.map((folder, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                    <button
                      onClick={() => handleModalBreadcrumbClick(index)}
                      className={`${
                        index === modalPath.length - 1
                          ? 'text-[#13097D] font-semibold text-lg'
                          : 'text-gray-500 hover:text-[#13097D]'
                      }`}
                    >
                      {folder === 'root' ? 'Home' : folder}
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  setShowFolderModal(false);
                  setModalPath(['root']);
                }}
                className="text-gray-500 hover:text-gray-700 transition ml-4"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {modalItems.length === 0 ? (
                <p className="text-[#8C8CA1] text-center py-8">No content in this folder</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modalItems.map((item) => (
                    <div 
                      key={item.courseContentId} 
                      className="h-[56px] bg-[#F5F5F5] rounded-[12px] flex justify-between items-center p-4 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleModalItemClick(item)}
                    >
                      <div className="flex gap-3 flex-1 min-w-0">
                        {getFileIcon(item.type)}
                        <div className="flex flex-col min-w-0">
                          <h1 className="text-[1rem] font-semibold text-[#242645] truncate">
                            {item.name}
                          </h1>
                          <p className="text-[0.875rem] font-normal text-[#8C8CA1]">
                            {getItemDescription(item)}
                          </p>
                        </div>
                      </div>

                      {item.type === 'folder' && <ChevronRight className="text-gray-400 shrink-0" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
