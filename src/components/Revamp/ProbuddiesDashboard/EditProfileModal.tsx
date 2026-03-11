import React, { useRef } from 'react';
import { X } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewImage: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  previewImage,
  onImageChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 font-poppins">
      <div className="w-[747px] h-[650px] bg-white rounded-[16px] border border-[#EFEFEF] shadow-[0px_0px_4px_0px_rgba(35,35,35,0.15)] relative overflow-hidden">
        <div className="w-[747px] h-[76px] bg-[#F9FAFB] flex items-center px-[32px] justify-between border-b border-[#EFEFEF]">
          <h2 className="text-[18px] font-semibold text-[#0E1629] leading-none">
            Edit Profile
          </h2>
          
          <button 
            onClick={onClose}
            className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <div className="w-[28.4px] h-[28.4px] bg-[#262626] rounded-full flex items-center justify-center">
              <X className="w-[17px] h-[17px] text-white" />
            </div>
          </button>
        </div>

        <div 
          className="absolute w-[159px] h-[159px] top-[96px] left-[294px] rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(198, 221, 240, 0.25), rgba(198, 221, 240, 0.25))'
          }}
        >
          <img
            src={previewImage}
            alt="Profile Preview"
            className="w-[155px] h-[155px] rounded-full object-cover border-[2px] border-white"
          />
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute w-[32px] h-[32px] top-[217px] left-[397px] rounded-[4px] p-[4px] shadow flex items-center justify-center cursor-pointer transition-colors hover:brightness-95"
          style={{
            background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(198, 221, 240, 0.25), rgba(198, 221, 240, 0.25))'
          }}
        >
          <img
            src='/edit2.svg'
            alt='edit profile'
            className='w-[24px] h-[24px] text-[#2F43F2]'
          />
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={onImageChange}
          accept="image/*"
          className="hidden"
        />

        <div className="absolute top-[280px] w-full px-[52px]">
          <div className="grid grid-cols-2 gap-x-[32px] gap-y-[20px]">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#0E1629]">First Name*</label>
              <input type="text" placeholder='Aditya' className="h-[44px] rounded-[8px] border border-[#E5E5E5] px-4 text-[#6B7280] focus:outline-none focus:border-[#2F43F2]" />
              
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#0E1629]">Last Name*</label>
              <input type="text" placeholder='Kumar' className="h-[44px] rounded-[8px] border border-[#E5E5E5] px-4 text-[#6B7280] focus:outline-none focus:border-[#2F43F2]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#0E1629]">College*</label>
              <input type="text" placeholder="IIT Delhi" className="h-[44px] rounded-[8px] border border-[#E5E5E5] px-4 text-[#6B7280] focus:outline-none focus:border-[#2F43F2]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#0E1629]">Location*</label>
              <input type="text" placeholder="Delhi, India" className="h-[44px] rounded-[8px] border border-[#E5E5E5] px-4 text-[#6B7280] focus:outline-none focus:border-[#2F43F2]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#0E1629]">Linkedin*</label>
              <input type="text" placeholder="instagramid" className="h-[44px] rounded-[8px] border border-[#E5E5E5] px-4 text-[#6B7280] focus:outline-none focus:border-[#2F43F2]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-semibold text-[#0E1629]">Instagram*</label>
              <input type="text" placeholder="instagramid" className="h-[44px] rounded-[8px] border border-[#E5E5E5] px-4 text-[#6B7280] focus:outline-none focus:border-[#2F43F2]" />
            </div>
          </div>

          <button className="w-full h-[48px] bg-[#0E1629] text-white font-semibold text-[16px] rounded-[8px] mt-[40px] hover:bg-[#1a2541] transition-colors cursor-pointer">
            Update profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProfileModal;