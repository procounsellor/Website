import type { User } from '@/types/user';
import InfoCard from './InfoCard';
import WalletCard from './WalletCard';
import { GraduationCap, MapPin } from 'lucide-react';
import { useMemo } from 'react';

interface MyInfoTabProps {
  user: User;
  onEditCourse: () => void;
  onEditStates: () => void;
  onAddFunds: () => void;
}

const MyInfoTab: React.FC<MyInfoTabProps> = ({ user, onEditCourse, onEditStates, onAddFunds }) => {
  const calculatedBalance = useMemo(() => {
    if (!user.transactions || !Array.isArray(user.transactions)) {
      return 0;
    }

    return user.transactions.reduce((acc, transaction) => {
      if (transaction.type === 'credit') {
        return acc + transaction.amount;
      } else if (transaction.type === 'debit') {
        return acc - transaction.amount;
      }
      return acc;
    }, 0);
  }, [user.transactions]);

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
            balance={calculatedBalance} 
            transactions={user.transactions}
            onAddFunds={onAddFunds}
          />
      </div>
    </div>
  );
};

export default MyInfoTab;