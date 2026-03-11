import React, { useState } from 'react';
import { GraduationCap, MapPin, Instagram, Linkedin } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

const ProBuddySidebar: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<string>('/counselor.png');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  return (
    <>
      <div className="w-[248px] h-[594px] bg-white rounded-[16px] shadow-sm flex flex-col items-center pt-8 px-6 font-poppins relative z-20">
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute w-[32px] h-[32px] top-[12px] left-[205px] rounded-[4px] p-[4px] flex items-center justify-center transition-colors brightness-95 cursor-pointer"
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

        <div className="relative w-28 h-28 mb-3">
          <img
            src={previewImage}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border border-gray-100"
          />
        </div>

        <h2 className="w-[141px] text-[20px] font-semibold text-[#0E1629] leading-none text-center mb-3">
          Aditya Kumar
        </h2>

        <hr className="w-[200px] border-[#E5E5E5] mb-[15px]" />

        <div className="w-full flex flex-col gap-3 mb-[15px]">
          <h3 className="text-[16px] font-medium text-[#0E1629] leading-none">
            College
          </h3>
          <div className="flex items-center gap-2 text-[#6B7280]">
            <GraduationCap className="w-5 h-5" />
            <span className="text-[16px] font-medium leading-none">IIT Delhi</span>
          </div>
        </div>

        <hr className="w-[200px] border-[#E5E5E5] mb-[15px]" />

        <div className="w-full flex flex-col gap-3 mb-[15px]">
          <h3 className="text-[16px] font-medium text-[#0E1629] leading-none">
            Location
          </h3>
          <div className="flex items-center gap-2 text-[#6B7280]">
            <MapPin className="w-5 h-5" />
            <span className="text-[16px] font-medium leading-none">Delhi, India</span>
          </div>
        </div>

        <hr className="w-[200px] border-[#E5E5E5] mb-[15px]" />

        <div className="w-full flex flex-col gap-3">
          <h3 className="text-[16px] font-medium text-[#0E1629] leading-none">
            Social Media Links
          </h3>
          <div className="flex flex-col gap-3">
            <a href="#" className="flex items-center gap-2 text-[#6B7280] hover:text-[#0E1629] transition-colors">
              <Instagram className="w-5 h-5 text-pink-600" />
              <span className="text-[16px] font-medium leading-none">instagramid</span>
            </a>
            <a href="#" className="flex items-center gap-2 text-[#6B7280] hover:text-[#0E1629] transition-colors">
              <Linkedin className="w-5 h-5 text-blue-600" />
              <span className="text-[16px] font-medium leading-none">instagramid</span>
            </a>
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        previewImage={previewImage}
        onImageChange={handleImageChange}
      />
    </>
  );
};

export default ProBuddySidebar;