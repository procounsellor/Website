import { useState, useEffect } from 'react';
import { getEarnings } from '@/api/counselor-Dashboard';
import type { EarningsData } from '@/types/earnings';
import EarningsView from './EarningsView';
import EarningsSidebar from './EarningsSidebar';

type InnerTab = 'Earnings' | 'Transactions';

export default function MyEarningsTab() {
  const [activeTab, setActiveTab] = useState<InnerTab>('Earnings');
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const data = await getEarnings("9470988669"); 
        setEarningsData(data);
      } catch (error) {
        console.error("Failed to load earnings tab data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

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

      <div>
        {loading ? (
          <div className="text-center py-10">Loading earnings data...</div>
        ) : activeTab === 'Earnings' && earningsData ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <EarningsView data={earningsData} />
            </div>
            <div className="lg:col-span-2">
              <EarningsSidebar data={earningsData} />
            </div>
          </div>
        ) : activeTab === 'Transactions' ? (
          <div>
            <p>Transactions will be built here.</p>
          </div>
        ) : (
          <div className="text-center py-10">Could not load earnings data.</div>
        )}
      </div>
    </div>
  );
}