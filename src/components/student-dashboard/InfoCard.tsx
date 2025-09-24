import { SquarePen } from 'lucide-react';
import React from 'react';

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  onEdit?: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, children, onEdit }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#EFEFEF] h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="text-[#242645]">{icon}</span>
          <h3 className="font-bold text-lg text-[#242645]">{title}</h3>
        </div>
        {onEdit && (
          <button onClick={onEdit} className="p-1 text-[#343C6A] hover:text-blue-800">
            <SquarePen size={18} />
          </button>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default InfoCard;