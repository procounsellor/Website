import { useEffect, useState } from 'react';
import { getCounselorProfileById } from '@/api/counselor-Dashboard';
import type { CounselorProfileData } from '@/types/counselorProfile';
import { X, Edit, CheckCircle2 } from 'lucide-react';

interface CounselorProfileProps {
  isOpen: boolean;
  onClose: () => void;
  counsellorId: string;
}

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="text-sm font-montserrat text-[#232323]">{label}</label>
    <div className="mt-2 w-full min-h-[40px] flex items-center px-4 py-2 rounded-md border border-gray-200 bg-white cursor-not-allowed">
      <p className="font-montserrat font-medium text-base text-[#718EBF]">{value}</p>
    </div>
  </div>
);

const SubscriptionPlan = ({ name, price, seats, textColor, backgroundGradient, borderGradient }: {
  name: string;
  price: number;
  seats: string;
  textColor: string;
  backgroundGradient: string;
  borderGradient: string;
}) => (
  <div
    className="w-[116px] h-[48px] rounded-lg p-[1px]"
    style={{ background: borderGradient }}
  >
    <div
      className="w-full h-full rounded-[7px] p-1 flex flex-col justify-center text-center"
      style={{ background: backgroundGradient }}
    >
      <p className={`text-xs ${textColor}`}>
        <span className="font-normal">{name} </span>
        <span className="font-medium">₹{price.toLocaleString('en-IN')}</span>
      </p>
      <p className="text-[10px] font-normal text-[#FA660F] mt-1">
        {seats} seats left
      </p>
    </div>
  </div>
);

export default function CounselorProfile({ isOpen, onClose, counsellorId }: CounselorProfileProps) {
  const [counselor, setCounselor] = useState<CounselorProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  useEffect(() => {
    if (isOpen) {
      const fetchCounselorData = async () => {
        setIsLoading(true);
        const data = await getCounselorProfileById(counsellorId);
        setCounselor(data);
        setIsLoading(false);
      };
      fetchCounselorData();
    }
  }, [isOpen, counsellorId]);

  if (!isOpen) return null;
  
  const getWorkingDays = () => {
      if (!counselor?.workingDays || counselor.workingDays.length === 0) return "Not specified";
      if (counselor.workingDays.length === 7) return "Mon - Sun";
      if (counselor.workingDays.length === 5 && ["Saturday", "Sunday"].every(d => !counselor.workingDays.includes(d))) return "Mon - Fri";
      return counselor.workingDays.map(d => d.slice(0, 3)).join(', ');
  }

  const planStyles = {
    plus: {
      textColor: 'text-[#1447E7]',
      backgroundGradient: 'linear-gradient(266.79deg, rgba(222, 237, 255, 0.4) 0.46%, rgba(126, 136, 211, 0.4) 130.49%)',
      borderGradient: 'linear-gradient(265.56deg, rgba(113, 142, 191, 0.4) -99.75%, rgba(192, 215, 253, 0.4) 91.52%)',
    },
    pro: {
      textColor: 'text-[#1447E7]',
      backgroundGradient: 'linear-gradient(257.67deg, rgba(244, 232, 255, 0.4) 1.56%, rgba(250, 244, 255, 0.4) 100%)',
      borderGradient: 'linear-gradient(265.56deg, rgba(232, 212, 255, 0.4) -99.75%, rgba(192, 215, 253, 0.4) 91.52%)',
    },
    elite: {
      textColor: 'text-[#B94C00]',
      backgroundGradient: 'linear-gradient(257.67deg, rgba(255, 245, 206, 0.4) 1.56%, rgba(255, 250, 230, 0.4) 100%)',
      borderGradient: 'linear-gradient(265.56deg, rgba(255, 251, 237, 0.4) -99.75%, rgba(234, 197, 145, 0.4) 91.52%)',
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-[1000px] max-h-[95vh] overflow-y-auto bg-white rounded-2xl shadow-lg p-10">
        <h2 className="font-semibold text-2xl text-[#343C6A]">Counselor Profile</h2>
        <button
          onClick={onClose}
          className="absolute top-7 right-7 w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-800 hover:bg-black hover:text-white transition-colors duration-200"
        >
          <X size={24} />
        </button>

        <div className="mt-8 p-6 rounded-2xl border border-[#EFEFEF]" style={{ background: 'linear-gradient(180deg, #F7F7FF 0%, #FFFFFF 100%)' }}>
          {isLoading ? (
            <div className="h-[574px] flex items-center justify-center">Loading...</div>
          ) : !counselor ? (
            <div className="h-[574px] flex items-center justify-center">Failed to load profile.</div>
          ) : (
            <>
              <div className="relative flex items-start gap-8">
                <img
                  src={counselor.photoUrl || '/counselor.png'}
                  alt={`${counselor.firstName} ${counselor.lastName}`}
                  className="w-[155px] h-[155px] rounded-full border-2 border-white object-cover shadow-md"
                />
                <div className="flex-1 mt-2">
                  <h3 className="text-2xl font-bold text-gray-800">{`${counselor.firstName} ${counselor.lastName}`}</h3>
                  <p className="text-base text-[#718EBF] mt-1">Career Counselor, {counselor.experience}+ years of experience</p>
                  <p className="text-sm text-gray-600 mt-3 max-w-2xl">{counselor.description}</p>
                  <div className="flex items-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-[#232323]">Email:</span>
                      <span className="text-[#718EBF]">{counselor.email}</span>
                      {counselor.emailOtpVerified && <CheckCircle2 size={16} className="text-green-500" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#232323]">Contact:</span>
                      <span className="text-[#718EBF]">{counselor.phoneNumber}</span>
                      {counselor.phoneOtpVerified && <CheckCircle2 size={16} className="text-green-500" />}
                    </div>
                  </div>
                </div>
                 <button className="absolute top-0 right-0 flex items-center gap-2 text-[#13097D] font-semibold text-base">
                    <Edit size={18} />
                    Edit
                </button>
              </div>

              <hr className="my-8 border-t border-[#E5E5E5]" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <InfoField label="Address" value={counselor.fullOfficeAddress.city || 'Not Provided'} />
                <InfoField label="Location" value={counselor.stateOfCounsellor.join(', ')} />
                <InfoField label="Organisation" value={counselor.organisationName} />
                <InfoField label="Working days & Time" value={`${getWorkingDays()}, ${counselor.officeStartTime} - ${counselor.officeEndTime}`} />
                <InfoField label="Languages" value={counselor.languagesKnow.join(', ')} />
                <div>
                  <label className="text-sm font-montserrat text-[#232323]">Subscription Plans</label>
                  <div className="mt-2 flex gap-4">
                      <SubscriptionPlan name="Plus" price={counselor.plusAmount} seats={counselor.plusSeats} {...planStyles.plus} />
                      <SubscriptionPlan name="Pro" price={counselor.proAmount} seats={counselor.proSeats} {...planStyles.pro} />
                      <SubscriptionPlan name="Elite" price={counselor.eliteAmount} seats={counselor.eliteSeats} {...planStyles.elite} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}