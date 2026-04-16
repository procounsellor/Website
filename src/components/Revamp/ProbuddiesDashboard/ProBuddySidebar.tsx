import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GraduationCap, MapPin, Instagram, Linkedin } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import { probuddiesApi } from '@/api/pro-buddies';

type AnyRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is AnyRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const toText = (value: unknown, fallback = 'NA'): string => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const getLinkByType = (source: unknown, linkType: string): AnyRecord | null => {
  if (!isRecord(source) || !Array.isArray(source.links)) return null;

  const found = source.links.find((entry) => {
    if (!isRecord(entry)) return false;
    return String(entry.type ?? '').toUpperCase() === linkType;
  });

  return isRecord(found) ? found : null;
};

const getLinkLabel = (link: AnyRecord | null): string => {
  if (!link) return 'NA';

  const title = toText(link.title, '');
  return title !== 'NA' ? title : 'NA';
};

const ProBuddySidebar: React.FC = () => {
  const [previewImage, setPreviewImage] = useState<string>('/counselor.png');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const proBuddyId = useMemo(() => localStorage.getItem('phone') || '', []);

  const profileQuery = useQuery({
    queryKey: ['probuddy-sidebar-profile', proBuddyId],
    queryFn: () => probuddiesApi.profileForProBuddy(proBuddyId),
    enabled: Boolean(proBuddyId),
  });

  const profileData = useMemo(() => {
    const payload = profileQuery.data;
    if (isRecord(payload) && isRecord(payload.data)) return payload.data;
    if (isRecord(payload)) return payload;
    return null;
  }, [profileQuery.data]);

  const displayName = useMemo(() => {
    const firstName = toText(profileData?.firstName, 'NA');
    const lastName = toText(profileData?.lastName, 'NA');

    if (firstName === 'NA' && lastName === 'NA') {
      return 'NA';
    }

    if (firstName === 'NA') {
      return lastName;
    }

    if (lastName === 'NA') {
      return firstName;
    }

    return `${firstName} ${lastName}`;
  }, [profileData]);

  const college = toText(profileData?.collegeName ?? profileData?.college, 'NA');

  const location = useMemo(() => {
    const city = toText(profileData?.city, 'NA');
    const state = toText(profileData?.state, 'NA');

    if (city === 'NA' && state === 'NA') {
      return 'NA';
    }

    if (city === 'NA') {
      return state;
    }

    if (state === 'NA') {
      return city;
    }

    return `${city}, ${state}`;
  }, [profileData]);

  const photoUrl = toText(profileData?.photoUrl, previewImage);

  const instagramLink = getLinkByType(profileData, 'INSTAGRAM');
  const linkedinLink = getLinkByType(profileData, 'LINKEDIN');

  const instagramUrl = toText(instagramLink?.url, '#');
  const linkedinUrl = toText(linkedinLink?.url, '#');

  const instagramLabel = getLinkLabel(instagramLink);
  const linkedinLabel = getLinkLabel(linkedinLink);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  return (
    <>
      <div className="w-full max-w-[320px] xl:w-62 min-h-0 sm:min-h-148.5 bg-white rounded-2xl shadow-sm flex flex-col items-center pt-6 sm:pt-8 pb-4 sm:pb-6 px-4 sm:px-6 font-poppins relative z-20 mx-auto xl:mx-0">

        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute w-7 h-7 sm:w-8 sm:h-8 top-2.5 right-2.5 sm:top-3 sm:right-3 rounded-lg p-1 sm:p-1 flex items-center justify-center transition-colors brightness-95 cursor-pointer"
          style={{
            background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(198, 221, 240, 0.25), rgba(198, 221, 240, 0.25))'
          }}
        >
          <img
            src='/edit2.svg'
            alt='edit profile'
            className='w-5 h-5 sm:w-6 sm:h-6 text-[#2F43F2]'
          />
        </button>

        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3">
          <img
            src={photoUrl}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border border-gray-100"
          />
        </div>

        <h2 className="w-full sm:w-35.25 text-[18px] sm:text-[20px] font-semibold text-[#0E1629] leading-none text-center mb-3 truncate">
          {displayName}
        </h2>

        <hr className="w-full border-[#E5E5E5] mb-2.5" />

        <div className="w-full flex flex-col gap-2 sm:gap-3 mb-2.5">
          <h3 className="text-[16px] font-medium text-[#0E1629] leading-none">
            College
          </h3>
          <div className="flex items-center gap-2 text-[#6B7280]">
            <GraduationCap className="w-5 h-5" />
            <span className="text-[15px] sm:text-[16px] font-medium leading-none truncate">{college}</span>
          </div>
        </div>

        <hr className="w-full border-[#E5E5E5] mb-2.5" />

        <div className="w-full flex flex-col gap-2 sm:gap-3 mb-2.5">
          <h3 className="text-[16px] font-medium text-[#0E1629] leading-none">
            Location
          </h3>
          <div className="flex items-center gap-2 text-[#6B7280]">
            <MapPin className="w-5 h-5" />
            <span className="text-[15px] sm:text-[16px] font-medium leading-none truncate">{location}</span>
          </div>
        </div>

        <hr className="w-full border-[#E5E5E5] mb-2.5" />

        <div className="w-full flex flex-col gap-2 sm:gap-3">
          <h3 className="text-[16px] font-medium text-[#0E1629] leading-none">
            Social Media Links
          </h3>
          <div className="flex flex-col gap-2 sm:gap-3">
            <a href={instagramUrl || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#6B7280] hover:text-[#0E1629] transition-colors min-w-0 w-full">
              <Instagram className="w-5 h-5 text-pink-600" />
              <span className="text-[14px] sm:text-[16px] font-medium leading-none truncate min-w-0 flex-1">{instagramLabel}</span>
            </a>
            <a href={linkedinUrl || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#6B7280] hover:text-[#0E1629] transition-colors min-w-0 w-full">
              <Linkedin className="w-5 h-5 text-blue-600" />
              <span className="text-[14px] sm:text-[16px] font-medium leading-none truncate min-w-0 flex-1">{linkedinLabel}</span>
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
