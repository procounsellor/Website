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
      className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors ${
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
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute top-full right-0 mt-2 w-48 z-10 bg-[#2D2D2D] border border-white/10 rounded-xl shadow-lg p-2"
    >
      <ul className="space-y-1">
        <MenuItem icon={<Pencil size={16} />} text="Rename" onClick={onRename} />
        <MenuItem icon={<Bookmark size={16} />} text="Bookmark" onClick={onBookmark} />
        <MenuItem icon={<Trash2 size={16} />} text="Delete" onClick={onDelete} isDestructive />
      </ul>
    </div>
  );
}