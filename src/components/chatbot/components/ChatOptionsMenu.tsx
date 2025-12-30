import { useEffect, useRef } from 'react';
import { Pencil, Bookmark, Trash2 } from 'lucide-react';

type Props = {
  onClose: () => void;
  onRename: () => void;
  onBookmark: () => void;
  onDelete: () => void;
  isBookmarked: boolean; 
};

const MenuItem = ({ icon, text, onClick, isDestructive = false }: { icon: React.ReactNode, text: string, onClick: () => void, isDestructive?: boolean }) => (
  <li>
    <button
      onClick={onClick}
      // CHANGES MADE:
      // 1. Removed 'text-base': Used 'text-sm' everywhere for a cleaner look.
      // 2. Added 'whitespace-nowrap': Forces text to stay on one line.
      className={`w-full flex items-center gap-3 px-4 py-3 md:py-2 text-sm rounded-md transition-colors cursor-pointer whitespace-nowrap ${
        isDestructive
          ? 'text-red-500 hover:bg-red-500/10'
          : 'text-white/80 hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
      <span>{text}</span>
    </button>
  </li>
);

export default function ChatOptionsMenu({ onClose, onRename, onBookmark, onDelete, isBookmarked }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      // CHANGE MADE: Increased width from 'w-48' to 'w-56' so "Remove Bookmark" fits.
      className="absolute top-full right-0 mt-2 w-56 z-50 bg-[#2D2D2D] border border-white/10 rounded-xl shadow-xl p-2"
    >
      <ul className="space-y-1">
        <MenuItem icon={<Pencil size={18} className="md:w-4 md:h-4" />} text="Rename" onClick={onRename} />
        
        <MenuItem 
          icon={
            <Bookmark 
              size={18} 
              className={`md:w-4 md:h-4 ${isBookmarked ? "fill-white" : ""}`} 
            />
          } 
          text={isBookmarked ? "Remove Bookmark" : "Bookmark"} 
          onClick={onBookmark} 
        />
        
        <MenuItem icon={<Trash2 size={18} className="md:w-4 md:h-4" />} text="Delete" onClick={onDelete} isDestructive />
      </ul>
    </div>
  );
}