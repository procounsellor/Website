import { EllipsisVertical, X, ChevronRight, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import toast from 'react-hot-toast';

type FileItem = {
  id: string;
  name: string;
  type: 'folder' | 'video' | 'doc' | 'image';
  size?: string;
  itemCount?: number;
  path: string;
};

type UploadItem = {
  id: string;
  name: string;
  type: 'video' | 'doc' | 'image';
  size: string;
  progress: number;
};

type Step3CardProps = {
  courseId: string;
};

export default function Step3Card({ courseId }: Step3CardProps) {
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [items, setItems] = useState<FileItem[]>([]);
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAddDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentPathString = () => currentPath.join('/');

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    const toastId = toast.loading('Creating folder...');
    
    try {
      const { addFolder } = await import('@/api/course');
      const { useAuthStore } = await import('@/store/AuthStore');
      const userId = useAuthStore.getState().userId;

      await addFolder({
        counsellorId: userId as string,
        courseId: courseId,
        name: newFolderName,
        parentPath: getCurrentPathString()
      });

      const newFolder: FileItem = {
        id: Date.now().toString(),
        name: newFolderName,
        type: 'folder',
        itemCount: 0,
        path: getCurrentPathString() + '/' + newFolderName
      };
      setItems([...items, newFolder]);
      setNewFolderName('');
      setShowFolderInput(false);
      setShowAddDropdown(false);
      toast.success('Folder created successfully!', { id: toastId });
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to create folder',
        { id: toastId }
      );
    }
  };

  const handleFileUpload = () => {
    setShowAddDropdown(false);
    fileInputRef.current?.click();
  };

  const simulateUpload = async (file: File, type: 'video' | 'doc' | 'image') => {
    const uploadId = Date.now().toString();
    const uploadItem: UploadItem = {
      id: uploadId,
      name: file.name,
      type,
      size: `${(file.size / 1024).toFixed(0)} kb`,
      progress: 0
    };
    
    setUploadQueue(prev => [...prev, uploadItem]);

    try {
      const { addFile } = await import('@/api/course');
      const { useAuthStore } = await import('@/store/AuthStore');
      const userId = useAuthStore.getState().userId;

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadQueue(prev => {
          const updated = prev.map(item => {
            if (item.id === uploadId && item.progress < 90) {
              return { ...item, progress: item.progress + 10 };
            }
            return item;
          });
          return updated;
        });
      }, 300);

      // Upload file
      await addFile(
        userId as string,
        courseId,
        getCurrentPathString(),
        file
      );

      clearInterval(progressInterval);

      // Complete progress
      setUploadQueue(prev =>
        prev.map(item =>
          item.id === uploadId ? { ...item, progress: 100 } : item
        )
      );

      setTimeout(() => {
        setUploadQueue(prev => prev.filter(item => item.id !== uploadId));
        const newItem: FileItem = {
          id: uploadId,
          name: file.name,
          type,
          size: `${(file.size / 1024).toFixed(0)} kb`,
          path: getCurrentPathString() + '/' + file.name
        };
        setItems(prev => [...prev, newItem]);
        toast.success('File uploaded successfully!');
      }, 500);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadQueue(prev => prev.filter(item => item.id !== uploadId));
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload file'
      );
    }
  };

  const handleNavigateTo = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleOpenFolder = (folder: FileItem) => {
    if (folder.type === 'folder') {
      setCurrentPath([...currentPath, folder.name]);
    }
  };

  const getFilteredItems = () => {
    const pathString = getCurrentPathString();
    return items.filter(item => {
      const itemPathParts = item.path.split('/');
      itemPathParts.pop();
      return itemPathParts.join('/') === pathString;
    });
  };

  return (
    <>
    <div className="flex flex-col gap-5 bg-white w-234 min-h-[29.688rem] p-6 rounded-2xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleNavigateTo(0)}
            className="text-[1.25rem] font-medium text-[#9499B2] hover:text-[#13097D] transition-colors"
          >
            Content
          </button>
          {currentPath.length > 1 && (
            <>
              <ChevronRight className="w-5 h-5 text-[#13097D]" />
              {currentPath.slice(1).map((path, index) => (
                <div key={index} className="flex items-center gap-1">
                  <button
                    onClick={() => handleNavigateTo(index + 1)}
                    className="text-[1.25rem] font-medium text-[#13097D] hover:underline transition-colors"
                  >
                    {path}
                  </button>
                  {index < currentPath.length - 2 && (
                    <ChevronRight className="w-5 h-5 text-[#13097D]" />
                  )}
                </div>
              ))}
            </>
          )}
        </div>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowAddDropdown(!showAddDropdown)}
            className="flex items-center gap-2 py-2 px-6 border border-[#13097D] text-[#13097D] rounded-[0.75rem] font-semibold text-[1rem] hover:bg-[#13097D] hover:text-white transition-all duration-200"
          >
            Add
          </button>
          
          {showAddDropdown && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
              <button
                onClick={() => {
                  setShowFolderInput(true);
                  setShowAddDropdown(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#f5f5f7] transition-colors text-left"
              >
                <img src="/folder.svg" alt="folder-icon"/>
                <span className="font-medium text-[#242645]">Folder</span>
              </button>
              <button
                onClick={handleFileUpload}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#f5f5f7] transition-colors text-left"
              >
                <img src="/video.svg" alt="video-icon" />
                <span className="font-medium text-[#242645]">Video</span>
              </button>
              <button
                onClick={handleFileUpload}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#f5f5f7] transition-colors text-left"
              >
                <img src="/pdf.svg" alt="pdf-icon" />
                <span className="font-medium text-[#242645]">Document</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Folder Creation Input */}
      {showFolderInput && (
        <div className="flex gap-2 items-center p-3 bg-[#f5f5f7] rounded-lg">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="flex-1 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#13097D]"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
          />
          <button
            onClick={handleCreateFolder}
            className="px-4 py-2 bg-[#13097D] text-white rounded-lg font-medium hover:bg-[#0f0760] transition-colors"
          >
            Create
          </button>
          <button
            onClick={() => {
              setShowFolderInput(false);
              setNewFolderName('');
            }}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* File/Folder Items */}
      <div className="flex flex-col gap-3">
        {getFilteredItems().map(item => (
          <FileItemComponent
            key={item.id}
            item={item}
            onOpen={handleOpenFolder}
          />
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const fileType = file.type;
            let type: 'video' | 'doc' | 'image' = 'doc';
            if (fileType.startsWith('video/')) type = 'video';
            else if (fileType.startsWith('image/')) type = 'image';
            simulateUpload(file, type);
          }
        }}
      />
    </div>

    {/* Upload Progress */}
    {uploadQueue.length > 0 && (
      <div className="flex flex-col gap-3 mt-4">
        {uploadQueue.map(upload => (
          <UploadProgressComponent
            key={upload.id}
            upload={upload}
            onCancel={(id) => setUploadQueue(prev => prev.filter(item => item.id !== id))}
          />
        ))}
      </div>
    )}
    </>
  );
}

function FileItemComponent({ item, onOpen }: { item: FileItem; onOpen: (item: FileItem) => void }) {
  const getIcon = () => {
    switch (item.type) {
      case 'folder':
        return <img src="/folder.svg" alt="folder" className="w-6 h-6" />;
      case 'video':
        return <img src="/video.svg" alt="video" className="w-6 h-6" />;
      case 'doc':
        return <img src="/pdf.svg" alt="document" className="w-6 h-6" />;
      case 'image':
        return <img src="/pdf.svg" alt="image" className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6 text-[#13097D]" />;
    }
  };

  const getSubtext = () => {
    if (item.type === 'folder') {
      return `${item.itemCount || 0} items`;
    }
    return item.size || '';
  };

  return (
    <div 
      className={`flex py-3 px-4 bg-[#f5f5f7] justify-between h-14 rounded-2xl items-center ${
        item.type === 'folder' ? 'cursor-pointer hover:bg-[#ebebed]' : ''
      } transition-colors`}
      onClick={() => item.type === 'folder' && onOpen(item)}
    >
      <div className="flex gap-2 items-center">
        {getIcon()}
        <p className="flex flex-col text-[1rem] font-semibold text-[#242645]">
          {item.name}
          <span className="text-[0.875rem] text-[#8C8CA1] font-normal">
            {getSubtext()}
          </span>
        </p>
      </div>
      <EllipsisVertical className="w-5 h-5 text-[#8C8CA1] cursor-pointer hover:text-[#13097D]" />
    </div>
  );
}

function UploadProgressComponent({ upload, onCancel }: { upload: UploadItem; onCancel: (id: string) => void }) {
  const getIcon = () => {
    switch (upload.type) {
      case 'video':
        return <img src="/video.svg" alt="video" className="w-6 h-6" />;
      case 'doc':
        return <img src="/pdf.svg" alt="document" className="w-6 h-6" />;
      case 'image':
        return <img src="/pdf.svg" alt="image" className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6 text-[#13097D]" />;
    }
  };

  return (
    <div className="w-222 bg-white rounded-2xl shadow-sm border border-[#f5f5f7] p-3">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          {getIcon()}
          <p className="flex flex-col text-[1rem] font-semibold text-[#242645]">
            {upload.name}
            <span className="text-[0.875rem] text-[#8C8CA1] font-normal">
              {upload.size} | {upload.progress}%
            </span>
          </p>
        </div>
        <button
          onClick={() => onCancel(upload.id)}
          className="group hover:bg-gray-900 h-5 w-5 flex items-center justify-center hover:text-white rounded-full transition-colors duration-200"
          aria-label="Cancel upload"
        >
          <X className="w-4 h-4 text-gray-600 group-hover:text-white" />
        </button>
      </div>

      <div className="h-1.5 bg-[#D9D9D9] rounded-2xl mt-3 overflow-hidden">
        <div 
          className="h-full bg-[#3AAF3C] transition-all duration-300 rounded-2xl"
          style={{ width: `${upload.progress}%` }}
        />
      </div>
    </div>
  );
}
