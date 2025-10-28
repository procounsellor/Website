import { useState } from 'react';
import { getEarnings, getCounselorProfileById } from '@/api/counselor-Dashboard';
import type { User } from '@/types/user';
import EarningsView from './EarningsView';
import EarningsSidebar from './EarningsSidebar';
import CounselorTransactionsTab from './CounselorTransactionsTab';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

type InnerTab = 'Earnings' | 'Transactions';

interface Props {
  user: User;
  token: string;
}

export default function MyEarningsTab({ user, token }: Props) {
  const [activeTab, setActiveTab] = useState<InnerTab>('Earnings');
  
  const { data: earningsData, isLoading: isLoadingEarnings } = useQuery({
    queryKey: ['counselorEarnings', user.userName],
    queryFn: () => getEarnings(user.userName, token),
    enabled: !!user.userName && !!token,
  });

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['counselorProfile', user.userName],
    queryFn: () => getCounselorProfileById(user.userName, token),
    enabled: !!user.userName && !!token,
  });

  const loading = isLoadingEarnings || isLoadingProfile;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-10 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#13097D]" />
        </div>
      );
    }
    
    const combinedData = earningsData ? {
      ...earningsData,
      offlineTransactions: profileData?.offlineTransactions || []
    } : null;
    
    if (!combinedData) {
      return <div className="text-center py-10">Could not load earnings data.</div>;
    }

    if (activeTab === 'Earnings') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <EarningsView data={combinedData} />
          </div>
          <div className="lg:col-span-2">
            <EarningsSidebar data={combinedData} />
          </div>
        </div>
      );
    }
    
    if (activeTab === 'Transactions') {
      return <CounselorTransactionsTab 
                transactions={combinedData.transactionData || []} 
                offlineTransactions={combinedData.offlineTransactions || []}
              />;
    }
  };

  return (
    <div className="w-full bg-white rounded-xl p-6">
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8 -mb-px" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('Earnings')}
            className={`${
              activeTab === 'Earnings'
                ? 'border-[#13097D] text-[#13097D]'
                : 'border-transparent text-[#8C8CA1] hover:text-gray-700'
            } whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-base transition-colors`}
          >
            Earnings
          </button>
          <button
            onClick={() => setActiveTab('Transactions')}
            className={`${
              activeTab === 'Transactions'
                ? 'border-[#13097D] text-[#13097D]'
                : 'border-transparent text-[#8C8CA1] hover:text-gray-700'
            } whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-base transition-colors`}
          >
            Transaction
          </button>
        </nav>
      </div>
      <div>{renderContent()}</div>
    </div>
  );
}