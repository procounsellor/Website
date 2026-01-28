import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CollegeMapCardProps {
  address?: string;
}

const CollegeMapCard: React.FC<CollegeMapCardProps> = ({ 
  address = "Mumbai, Maharashtra" 
}) => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  // corrected URL format for embedding
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <>
      <div className="hidden md:flex bg-white rounded-2xl border border-[#EFEFEF] shadow-[0px_0px_4px_0px_#23232326] p-5 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3 
            className="text-[#343C6A] font-semibold"
            style={{ fontFamily: 'Poppins', fontSize: '18px', lineHeight: '125%' }}
          >
            Location
          </h3>
          <p 
            className="text-[#8C8CA1] font-medium text-sm line-clamp-2"
            style={{ fontFamily: 'Poppins' }}
          >
            {address}
          </p>
        </div>

        <div className="w-full h-[200px] rounded-xl overflow-hidden bg-gray-100 border border-[#EFEFEF] relative group">
          <iframe
            title="College Location"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={mapUrl}
            className="w-full h-full pointer-events-none"
          />
          <div 
            className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors cursor-pointer"
            onClick={() => setIsMapOpen(true)}
          />
        </div>
      </div>

      {/* Map Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsMapOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-[#EFEFEF]">
              <div>
                <h3 className="text-[#343C6A] font-semibold text-lg font-['Poppins']">College Location</h3>
                <p className="text-[#8C8CA1] text-xs font-['Poppins']">{address}</p>
              </div>
              <button 
                onClick={() => setIsMapOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="text-[#343C6A]" size={24} />
              </button>
            </div>
            <div className="flex-1 w-full bg-gray-50">
               <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={mapUrl}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CollegeMapCard;