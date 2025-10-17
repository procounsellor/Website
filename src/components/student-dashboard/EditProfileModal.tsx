import { useState, useEffect, useRef } from 'react';
import type { User } from '@/types/user';
import { X, SquarePen, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadUserPhoto } from '@/api/user';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedData: { firstName: string; lastName: string; email: string }) => Promise<void>;
  onUploadComplete: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, isOpen, onClose, onUpdate }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('jwt');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhotoPreview(null);
      setSelectedFile(null);
    }
  }, [user, isOpen]);

  const handlePhotoEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) {
    toast.error('Please fill in all required fields.');
    return;
  }
    setIsSubmitting(true);
    
    try {
      if (selectedFile && user.userName && token) {
        await uploadUserPhoto(user.userName, selectedFile, token);
      }
      await onUpdate({ firstName, lastName, email });
      
      toast.success('Profile saved successfully!');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const displayPhoto = photoPreview || user.photo || `https://ui-avatars.com/api/?name=${firstName}+${lastName}`;

  const ProfilePicture = ({ isMobile = false }) => (
    <div className={`relative ${isMobile ? 'w-[122px] h-[122px]' : 'w-40 h-40'} mx-auto mb-8`}>
      <img
        src={displayPhoto}
        alt="Profile"
        className={`w-full h-full object-cover rounded-full border-2 border-white shadow-md`}
      />
      <button 
        type="button" 
        onClick={handlePhotoEditClick}
        className={`absolute bottom-1 right-1 bg-white rounded-md flex items-center justify-center border shadow-sm hover:bg-gray-100 ${isMobile ? 'w-5 h-5 p-0.5' : 'w-8 h-8'}`}
      >
        <SquarePen size={isMobile ? 14 : 16} className="text-[#343C6A]" />
      </button>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-opacity-50 backdrop-blur-sm"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg"
        style={{ display: 'none' }}
      />
      <div className="md:hidden h-full w-full bg-[#F5F5F7] flex flex-col">
        <header className="flex-shrink-0 flex items-center p-4 bg-white border-b border-gray-200">
          <button onClick={onClose} className="p-2 mr-2">
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-[#343C6A]">Edit Profile</h2>
        </header>

        <div className="flex-grow overflow-y-auto p-8">
          <ProfilePicture isMobile />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-[#2F303280] mb-1">First Name</label>
              <input 
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-11 px-4 bg-white border border-[#EFEFEF] rounded-xl text-base text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#2F303280] mb-1">Last Name</label>
              <input 
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-11 px-4 bg-white border border-[#EFEFEF] rounded-xl text-base text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
             <div>
              <label className="block text-[10px] font-semibold text-[#2F303280] mb-1">Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 bg-white border border-[#EFEFEF] rounded-xl text-base text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="pt-6">
               <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#FA660F] text-white font-semibold text-base rounded-xl hover:bg-orange-600 transition-colors disabled:bg-orange-300"
                >
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
               </button>
            </div>
          </form>
        </div>
      </div>

      {/*desktop-view*/}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="hidden md:block relative w-[747px] h-auto bg-[#F5F7FA] rounded-2xl shadow-lg border border-[#EFEFEF] py-6 px-[42px]"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-[#343C6A] mb-8">Edit Profile</h2>
        <div className="bg-gradient-to-b from-[#8586a76c] to-white/50 rounded-2xl p-7">
          <ProfilePicture />
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-[#2F303280] mb-2">First Name</label>
                <input 
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-12 px-3 bg-white border border-[#EFEFEF] rounded-xl text-base text-[#718EBF] placeholder-[#718EBF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2F303280] mb-2">Last Name</label>
                <input 
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-12 px-3 bg-white border border-[#EFEFEF] rounded-xl text-base text-[#718EBF] placeholder-[#718EBF]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#2F303280] mb-2">Email</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="shubham@gmail.com"
                  className="w-full h-12 px-3 bg-white border border-[#EFEFEF] rounded-xl text-base text-[#718EBF] placeholder-[#718EBF]"
                />
              </div>
            </div>
            <div className="pt-4 text-center">
               <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[50%] h-12 bg-[#FA660F] text-white font-semibold text-base rounded-xl hover:bg-orange-600 transition-colors"
                >
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;