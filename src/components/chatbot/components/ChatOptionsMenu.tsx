import { useEffect, useRef } from 'react';
import { Pencil, Bookmark, Trash2 } from 'lucide-react';

type Props = {
  onClose: () => void;
  onRename: () => void;
  onBookmark: () => void;
  onDelete: () => void;
};

const MenuItem = ({ icon, text, onClick, isDestructive = false }: { icon: React.ReactNode, text: string, onClick: () => void, isDestructive?: boolean }) => (
  <li>
    <button
      onClick={onClick}
      // RESPONSIVE CHANGES:
      // 1. Added 'cursor-pointer' for desktop mouse interaction.
      // 2. Changed 'py-2' to 'py-3 md:py-2' -> Taller buttons on mobile for easier tapping.
      // 3. Changed 'text-sm' to 'text-base md:text-sm' -> Slightly larger text on mobile for readability.
      className={`w-full flex items-center gap-3 px-4 py-3 md:py-2 text-base md:text-sm rounded-md transition-colors cursor-pointer ${
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

export default function ChatOptionsMenu({ onClose, onRename, onBookmark, onDelete }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handler for both mouse and touch events
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // RESPONSIVE CHANGE:
    // Added 'touchstart' listener. 'mousedown' sometimes doesn't fire correctly 
    // on all mobile browsers when tapping non-clickable backgrounds.
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
      // RESPONSIVE CHANGE:
      // increased z-index to 50 to ensure it sits on top of other mobile UI elements
      className="absolute top-full right-0 mt-2 w-48 z-50 bg-[#2D2D2D] border border-white/10 rounded-xl shadow-xl p-2"
    >
      <ul className="space-y-1">
        <MenuItem icon={<Pencil size={18} className="md:w-4 md:h-4" />} text="Rename" onClick={onRename} />
        <MenuItem icon={<Bookmark size={18} className="md:w-4 md:h-4" />} text="Bookmark" onClick={onBookmark} />
        <MenuItem icon={<Trash2 size={18} className="md:w-4 md:h-4" />} text="Delete" onClick={onDelete} isDestructive />
      </ul>
    </div>
  );
}