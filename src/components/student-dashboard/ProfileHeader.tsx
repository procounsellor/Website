import type { User } from '@/types/user';
import { SquarePen } from 'lucide-react';

interface ProfileHeaderProps {
  user: User;
  onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user,onEditClick }) => {
  const studentType = user.interestedCourse ? `${user.interestedCourse} Student` : 'Student';

  return (
    <div className="mb-6">
      <div className="h-48 md:h-56 bg-gray-200 rounded-t-xl">
        <img
          src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format=fit=crop"
          alt="University Banner"
          className="w-full h-full object-cover rounded-t-xl"
        />
      </div>

      <div className="px-6 md:px-10 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start">
          
          <div className="flex items-start w-full md:w-auto">
            <div className="flex-shrink-0 w-36 h-36 md:w-48 md:h-48 rounded-full border-[4px] border-white bg-gray-300 overflow-hidden shadow-lg -mt-16 md:-mt-24">
              <img
                src={user.photo || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=EBF4FF&color=0D47A1`}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=EBF4FF&color=0D47A1`; }}
              />
            </div>
            
            <div className="ml-4 pt-6">
              <h1 className="text-2xl font-semibold text-[#343C6A] leading-tight">{user.firstName} {user.lastName}</h1>
              <p className="text-lg text-[#718EBF] font-medium">{studentType}</p>
            </div>
          </div>

          <div className="w-full md:w-auto mt-4 md:mt-0 pt-9 self-end md:self-auto">
            <button 
            onClick={onEditClick}
            className="w-full md:w-auto flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-[#343C6A] rounded-xl text-[#343C6A] font-medium text-base hover:bg-gray-100 transition-colors shadow-sm">
              <SquarePen size={18} />
              <span>Edit Profile</span>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;