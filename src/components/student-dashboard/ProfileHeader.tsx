import type { User } from '@/types/user';
import { SquarePen } from 'lucide-react';

interface ProfileHeaderProps {
  user: User;
  onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditClick }) => {
  const studentType = user.interestedCourse ? `${user.interestedCourse} Student` : 'Student';

  return (
    <div className="md:mb-4 mb-1">
      <div className="h-32 md:h-56 bg-gray-200 rounded-t-xl">
        <img
          src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto.format&fit=crop"
          alt="University Banner"
          className="w-full h-full object-cover rounded-t-xl"
        />
      </div>

      <div className="px-4 md:px-10 pb-6">
        <div className="relative flex flex-col items-center md:flex-row md:justify-between md:items-start">
          
          <div className="flex flex-col md:flex-row items-center md:items-start w-full">
            <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-full border-[4px] border-white bg-gray-300 overflow-hidden shadow-lg -mt-16 md:-mt-24">
              <img
                src={user.photo || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=EBF4FF&color=0D47A1`}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=EBF4FF&color=0D47A1`; }}
              />
            </div>
            
            <div className="mt-4 md:mt-0 md:ml-6 md:pt-6 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-semibold text-[#343C6A] leading-tight">{user.firstName} {user.lastName}</h1>
                <button onClick={onEditClick} className="p-1 text-[#343C6A] md:hidden">
                  <SquarePen size={16} />
                </button>
              </div>
              <p className="text-sm md:text-lg text-[#718EBF] font-medium">{studentType}</p>
            </div>
          </div>

          <div className="hidden md:block md:pt-6">
            <button 
            onClick={onEditClick}
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-[#343C6A] rounded-xl text-[#343C6A] font-medium text-base hover:bg-gray-100 transition-colors shadow-sm whitespace-nowrap">
              <SquarePen size={20} />
              <span>Edit Profile</span>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;