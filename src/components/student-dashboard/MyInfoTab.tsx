import type { User } from '@/types/user';
import InfoCard from './InfoCard';
import WalletCard from './WalletCard';
import { GraduationCap, MapPin } from 'lucide-react';

interface MyInfoTabProps {
  user: User;
  onEditCourse: () => void;
  onEditStates: () => void;
  onAddFunds: () => void;
}

const MyInfoTab: React.FC<MyInfoTabProps> = ({ user, onEditCourse, onEditStates, onAddFunds }) => {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
        <InfoCard icon={<GraduationCap />} title="Preferred Course" onEdit={onEditCourse}>
          <p className="text-sm md:text-base font-medium text-[#8C8CA1]">{user.interestedCourse || 'Not specified'}</p>
        </InfoCard>
        
        <InfoCard icon={<MapPin />} title="Preferred States" onEdit={onEditStates}>
          {user.userInterestedStateOfCounsellors && user.userInterestedStateOfCounsellors.length > 0 ? (
            <ul className="space-y-1 md:space-y-2">
              {user.userInterestedStateOfCounsellors.map((state) => (
                <li key={state} className="text-sm md:text-base font-medium text-[#8C8CA1]">{state}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm md:text-base font-medium text-[#8C8CA1]">No preferred states selected.</p>
          )}
        </InfoCard>
      </div>

      <div className="lg:col-span-1">
          <WalletCard 
            balance={user.walletAmount} 
            onAddFunds={onAddFunds}
          />
      </div>
    </div>
  );
};

export default MyInfoTab;