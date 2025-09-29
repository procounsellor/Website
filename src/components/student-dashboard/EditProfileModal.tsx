import { useState } from 'react';
import type { User } from '@/types/user';
import { X, SquarePen } from 'lucide-react';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, isOpen, onClose }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = { firstName, lastName, email };
    console.log("Submitting updated profile data:", updatedData);
    
    // --- TODO: API Call ---
    // API endpoint to update the user's profile.
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-[747px] h-auto bg-[#F5F7FA] rounded-2xl shadow-lg border border-[#EFEFEF] py-6 px-[42px]"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-[#343C6A] mb-8">Edit Profile</h2>

        <div className="bg-gradient-to-b from-[#8586a76c] to-white/50 rounded-2xl p-7">
        
        <div className="relative w-40 h-40 mx-auto mb-8">
            <img
                src={user.photo || `https://ui-avatars.com/api/?name=${firstName}+${lastName}`}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-white shadow-md"
            />
            <button className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-md flex items-center justify-center border shadow-sm hover:bg-gray-100">
                <SquarePen size={16} className="text-[#343C6A]" />
            </button>
        </div>

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
                className="w-[50%] h-12 bg-[#FA660F] text-white font-semibold text-base rounded-xl hover:bg-orange-600 transition-colors"
              >
                Update Profile
             </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default EditProfileModal;