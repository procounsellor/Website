import type { User } from '@/types/user';
import InfoCard from './InfoCard';
import WalletCard from './WalletCard';
import { GraduationCap, MapPin } from 'lucide-react';

interface MyInfoTabProps {
  user: User;
}

const MyInfoTab: React.FC<MyInfoTabProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <InfoCard icon={<GraduationCap />} title="Preferred Course" onEdit={() => {}}>
          <p className="text-[#8C8CA1] font-medium">{user.interestedCourse || 'Not specified'}</p>
        </InfoCard>
        
        <InfoCard icon={<MapPin />} title="Preferred States" onEdit={() => {}}>
          {user.userInterestedStateOfCounsellors && user.userInterestedStateOfCounsellors.length > 0 ? (
            <ul className="space-y-2">
              {user.userInterestedStateOfCounsellors.map((state) => (
                <li key={state} className="text-[#8C8CA1] font-medium">{state}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[#8C8CA1] font-medium">No preferred states selected.</p>
          )}
        </InfoCard>
      </div>

      <div className="lg:col-span-1">
          <WalletCard 
            balance={user.walletAmount} 
            transactions={user.transactions} 
          />
      </div>
    </div>
  );
};

export default MyInfoTab;