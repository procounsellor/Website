import { MoreVertical, X, Check, Loader2, MapPin } from 'lucide-react';
import type { Client } from '@/types/client';

interface ClientCardProps {
  client: Client;
  variant: 'client' | 'pending';
  onAccept?: () => void;
  onReject?: () => void;
  isResponding?: boolean;
}

export default function ClientCard({ client, variant, onAccept, onReject, isResponding }: ClientCardProps) {
  return (
    <>
      {/*mobile view*/}
      <div className="block md:hidden bg-white border border-[#EFEFEF] rounded-2xl p-3 space-y-3 shadow-sm font-montserrat">
        <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
                <img 
                    src={client.imageUrl} 
                    alt={client.name} 
                    className="w-11 h-11 rounded-md object-cover" 
                />
                <div>
                    <h4 className="font-medium text-sm text-[#242645]">{client.name}</h4>
                    <p className="font-normal text-xs text-[#8C8CA1]">{client.course}</p>
                </div>
            </div>
            {variant === 'pending' && onAccept && onReject ? (
                <div className="flex items-center gap-2">
                    <button
                        onClick={onReject}
                        disabled={isResponding}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="Reject"
                    >
                        <X size={16} />
                    </button>
                    <button
                        onClick={onAccept}
                        disabled={isResponding}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-[#13097D] text-[#13097D] hover:bg-green-50 hover:text-green-600 transition-colors disabled:opacity-50"
                        aria-label="Accept"
                    >
                        {isResponding ? <Loader2 className="animate-spin" size={14} /> : <Check size={16} />}
                    </button>
                </div>
            ) : (
                <button disabled={isResponding} className="p-1 text-[#13097D] hover:bg-gray-100 rounded-full disabled:opacity-50">
                    <MoreVertical size={20} />
                </button>
            )}
        </div>
        
        <div className="pt-2">
            <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#8C8CA1]" />
                <h5 className="font-medium text-xs text-[#242645]">Preferred States</h5>
            </div>
            <p className="font-medium text-xs text-[#8C8CA1] mt-1 pl-1 truncate">
                {client.preferredStates.join(', ')}
            </p>
        </div>
      </div>
      {/*desktop*/}
      <div className="hidden md:block py-6">
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
                  disabled={isResponding}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  aria-label="Reject"
                >
                  <X size={20} />
                </button>
                <button
                  onClick={onAccept}
                  disabled={isResponding}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-[#13097D] text-[#13097D] hover:bg-green-50 hover:text-green-600 transition-colors disabled:opacity-50"
                  aria-label="Accept"
                >
                  {isResponding ? <Loader2 className="animate-spin" size={16} /> : <Check size={20} />}
                </button>
              </div>
            )}
            <button disabled={isResponding} className="p-2 text-[#13097D] hover:bg-gray-100 rounded-full disabled:opacity-50">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}