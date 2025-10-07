import { MoreVertical, X, Check } from 'lucide-react';
import type { Client } from '@/types/client';

interface ClientCardProps {
  client: Client;
  variant: 'client' | 'pending';
  onAccept?: () => void;
  onReject?: () => void;
}

export default function ClientCard({ client, variant, onAccept, onReject }: ClientCardProps) {
  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-5 flex items-center gap-4">
          <img src={client.imageUrl} alt={client.name} className="w-20 h-20 rounded-lg object-cover" />
          <div>
            <h4 className="font-semibold text-xl text-[#242645]">{client.name}</h4>
            <p className="font-medium text-base text-[#8C8CA1]">{client.course}</p>
          </div>
        </div>

        <div className="md:col-span-5 -ml-4">
          <h5 className="font-semibold text-xl text-[#242645]">Preferred States</h5>
          <p className="font-medium text-base text-[#8C8CA1] truncate">{client.preferredStates.join(', ')}</p>
        </div>
        
        <div className={`md:col-span-2 flex items-center justify-end ${variant === 'pending' ? 'gap-[60px]' : 'gap-2'}`}>
          {variant === 'pending' && onAccept && onReject && (
            <div className="flex items-center gap-2">
              <button
                onClick={onReject}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                aria-label="Reject"
              >
                <X size={20} />
              </button>
              <button
                onClick={onAccept}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#13097D] text-[#13097D] hover:bg-green-50 hover:text-green-600 transition-colors"
                aria-label="Accept"
              >
                <Check size={20} />
              </button>
            </div>
          )}
          <button className="p-2 text-[#13097D] hover:bg-gray-100 rounded-full">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}