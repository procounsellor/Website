import { useEffect, useState, useRef } from 'react';
import { getCounselorProfileById, updateCounselorProfile, uploadCounselorPhoto } from '@/api/counselor-Dashboard';
import type { CounselorProfileData } from '@/types/counselorProfile';
import { X, Edit, CheckCircle2, Loader2, PenSquare } from 'lucide-react';
import type { User } from '@/types/user';
import EditableField from './EditableField';

interface CounselorProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  token: string;
}

// InfoField and SubscriptionPlan components remain the same...
const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="text-sm font-montserrat text-[#232323]">{label}</label>
    <div className="mt-2 w-full min-h-[40px] flex items-center px-4 py-2 rounded-md border border-gray-200 bg-white cursor-not-allowed">
      <p className="font-montserrat font-medium text-base text-[#718EBF]">{value}</p>
    </div>
  </div>
);
const SubscriptionPlan = ({ 
  name, price, seats, textColor, backgroundGradient, borderGradient }
  : { 
    name: string; 
    price: number; 
    seats: string; 
    textColor: string; 
    backgroundGradient: string; 
    borderGradient: string; }) => ( 
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
          <p className="text-[10px] font-normal text-[#FA660F] mt-1"> {seats} seats left </p> 
        </div> 
      </div>
    );

export default function CounselorProfile({ isOpen, onClose, user, token }: CounselorProfileProps) {
  const [counselor, setCounselor] = useState<CounselorProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editableData, setEditableData] = useState<Partial<CounselorProfileData>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  const fetchCounselorData = async () => {
      if (!user.userName) return;
      setIsLoading(true);
      const data = await getCounselorProfileById(user.userName, token);
      setCounselor(data);
      if (data) {
        setEditableData(data);
      }
      setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchCounselorData();
    }
  }, [isOpen, user, token]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const arrayFields = ['stateOfCounsellor', 'languagesKnow', 'expertise'];

    if (name === 'city') {
      const defaultAddress = { role: null, officeNameFloorBuildingAndArea: null, city: null, state: null, pinCode: null, latCoordinate: null, longCoordinate: null };
      setEditableData(prev => ({...prev, fullOfficeAddress: {...defaultAddress, ...prev.fullOfficeAddress, city: value,},}));
    } else {
      setEditableData(prev => ({...prev, [name]: arrayFields.includes(name) ? value.split(',').map(item => item.trim()) : value,}));
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
  };
  
  const handleUpdate = async () => {
    if (!user.userName) return;
    setIsUpdating(true);
    try {
      if (selectedFile) {
        await uploadCounselorPhoto(user.userName, selectedFile, token);
      }

      const payload: Partial<CounselorProfileData> = {
        organisationName: editableData.organisationName,
        stateOfCounsellor: editableData.stateOfCounsellor,
        languagesKnow: editableData.languagesKnow,
        description: editableData.description,
        experience: editableData.experience,
        fullOfficeAddress: editableData.fullOfficeAddress,
      };
      await updateCounselorProfile(user.userName, payload, token);

      await fetchCounselorData();
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getWorkingDays = () => {
      if (!counselor?.workingDays || counselor.workingDays.length === 0) return "Not specified";
      if (counselor.workingDays.length === 7) return "Mon - Sun";
      if (counselor.workingDays.length === 5 && ["Saturday", "Sunday"].every(d => !counselor.workingDays.includes(d))) return "Mon - Fri";
      return counselor.workingDays.map(d => d.slice(0, 3)).join(', ');
  }

  const planStyles = { plus: { textColor: 'text-[#1447E7]', backgroundGradient: 'linear-gradient(266.79deg, rgba(222, 237, 255, 0.4) 0.46%, rgba(126, 136, 211, 0.4) 130.49%)', borderGradient: 'linear-gradient(265.56deg, rgba(113, 142, 191, 0.4) -99.75%, rgba(192, 215, 253, 0.4) 91.52%)' }, pro: { textColor: 'text-[#1447E7]', backgroundGradient: 'linear-gradient(257.67deg, rgba(244, 232, 255, 0.4) 1.56%, rgba(250, 244, 255, 0.4) 100%)', borderGradient: 'linear-gradient(265.56deg, rgba(232, 212, 255, 0.4) -99.75%, rgba(192, 215, 253, 0.4) 91.52%)' }, elite: { textColor: 'text-[#B94C00]', backgroundGradient: 'linear-gradient(257.67deg, rgba(255, 245, 206, 0.4) 1.56%, rgba(255, 250, 230, 0.4) 100%)', borderGradient: 'linear-gradient(265.56deg, rgba(255, 251, 237, 0.4) -99.75%, rgba(234, 197, 145, 0.4) 91.52%)' } };


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
          {isLoading ? ( <div className="h-[574px] flex items-center justify-center">Loading...</div> ) : !counselor ? ( <div className="h-[574px] flex items-center justify-center">Failed to load profile.</div> ) : (
            <>
              <div className="relative flex items-start gap-8">
                <div className="relative w-[155px] h-[155px] flex-shrink-0">
                  <img
                    src={previewUrl || counselor.photoUrl || '/counselor.png'}
                    alt={`${counselor.firstName} ${counselor.lastName}`}
                    className="w-full h-full rounded-full border-2 border-white object-cover shadow-md"
                  />
                  {isEditing && (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        aria-label="Edit profile picture"
                      >
                        <PenSquare size={20} className="text-[#13097D]" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoSelect}
                        className="hidden"
                        accept="image/png, image/jpeg"
                      />
                    </>
                  )}
                </div>

                <div className="flex-1 mt-2">
                  <h3 className="text-2xl font-bold text-gray-800">{`${counselor.firstName} ${counselor.lastName}`}</h3>
                  <p className="text-base text-[#718EBF] mt-1">Career Counselor, {isEditing ? editableData.experience : counselor.experience}+ years of experience</p>
                  <p className="text-sm text-gray-600 mt-3 max-w-2xl">{isEditing ? editableData.description : counselor.description}</p>
                  <div className="flex items-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2"> <span className="text-[#232323]">Email:</span> <span className="text-[#718EBF]">{counselor.email}</span> {counselor.emailOtpVerified && <CheckCircle2 size={16} className="text-green-500" />} </div>
                    <div className="flex items-center gap-2"> <span className="text-[#232323]">Contact:</span> <span className="text-[#718EBF]">{counselor.phoneNumber}</span> {counselor.phoneOtpVerified && <CheckCircle2 size={16} className="text-green-500" />} </div>
                  </div>
                </div>
                 {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="absolute top-0 right-0 flex items-center gap-2 text-[#13097D] font-semibold text-base">
                        <Edit size={18} />
                        Edit
                    </button>
                 )}
              </div>

              <hr className="my-8 border-t border-[#E5E5E5]" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <EditableField label="Address" name="city" value={editableData.fullOfficeAddress?.city || ''} isEditing={isEditing} onChange={handleInputChange} />
                <EditableField label="Location" name="stateOfCounsellor" value={editableData.stateOfCounsellor || []} isEditing={isEditing} onChange={handleInputChange} />
                <EditableField label="Organisation" name="organisationName" value={editableData.organisationName || ''} isEditing={isEditing} onChange={handleInputChange} />
                <InfoField label="Working days & Time" value={`${getWorkingDays()}, ${counselor.officeStartTime} - ${counselor.officeEndTime}`} />
                <EditableField label="Languages" name="languagesKnow" value={editableData.languagesKnow || []} isEditing={isEditing} onChange={handleInputChange} />
                <div>
                  <label className="text-sm font-montserrat text-[#232323]">Subscription Plans</label>
                  <div className="mt-2 flex gap-4">
                      <SubscriptionPlan name="Plus" price={counselor.plusAmount} seats={counselor.plusSeats} {...planStyles.plus} />
                      <SubscriptionPlan name="Pro" price={counselor.proAmount} seats={counselor.proSeats} {...planStyles.pro} />
                      <SubscriptionPlan name="Elite" price={counselor.eliteAmount} seats={counselor.eliteSeats} {...planStyles.elite} />
                  </div>
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-8 flex justify-end gap-4">
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleUpdate}
                        disabled={isUpdating}
                        className="px-6 py-2 rounded-lg bg-[#13097D] text-white font-semibold flex items-center gap-2 disabled:bg-indigo-300"
                    >
                        {isUpdating ? <Loader2 className="animate-spin" /> : 'Update'}
                    </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}