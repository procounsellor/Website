import type { EarningsData } from '@/types/earnings';
import { Info } from 'lucide-react';
import EarningsTrendChart from './EarningsTrendChart';
import { useState } from 'react';

interface EarningsViewProps {
  data: EarningsData;
}

const InfoCard = ({ title, amount, variant }: { title: string; amount: number; variant: 'earnings' | 'payout' }) => {
  const styles = {
    earnings: {
      bg: 'bg-[#F1FDF6]',
      border: 'border-[#C9F7DD]',
      amountColor: 'text-[#14A249]',
    },
    payout: {
      bg: 'bg-[#FFF6F0]',
      border: 'border-[#FFE3D1]',
      amountColor: 'text-[#F97116]',
    },
  };
  const selectedStyle = styles[variant];

  return (
    <div className={`flex-1 p-4 rounded-2xl border ${selectedStyle.bg} ${selectedStyle.border}`}>
      <p className="font-montserrat text-sm text-[#232323]">{title}</p>
      <p className={`font-montserrat text-xl font-semibold mt-1 ${selectedStyle.amountColor}`}>
        ₹{amount.toLocaleString('en-IN')}
      </p>
    </div>
  );
};


export default function EarningsView({ data }: EarningsViewProps) {
    const [timeframe, setTimeframe] = useState<'yearly' | 'monthly'>('yearly');
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#343C6A] mb-4">Current Cycle Earnings</h2>
        <div className="flex gap-6">
          <InfoCard title="Earnings" amount={data.totalEarnings} variant="earnings" />
          <InfoCard title="Payout" amount={data.totalPayout} variant="payout" />
        </div>
      </div>

      <hr className="border-[#E4E4E4] my-6" />
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#343C6A] mb-4">Earnings Trend</h2>
        <div className="border border-[#EFEFEF] rounded-2xl">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium text-gray-700">Current Slab</h3>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{data.slabOfCounsellor}</span>
                <Info size={16} className="text-gray-400" />
              </div>
            </div>

            <div className="flex items-center bg-[#F9FAFB] border border-[#EFEFEF] p-1 rounded-xl mt-4 h-[52px]">
              <button 
                onClick={() => setTimeframe('monthly')}
                className={`flex-1 text-center py-2 px-4 text-sm font-medium rounded-lg h-[38px] transition-colors ${
                  timeframe === 'monthly' ? 'bg-[#343C6A] text-white font-semibold' : 'text-[#232323]'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setTimeframe('yearly')}
                className={`flex-1 text-center py-2 px-4 text-sm font-medium rounded-lg h-[38px] transition-colors ${
                  timeframe === 'yearly' ? 'bg-[#343C6A] text-white font-semibold' : 'text-[#232323]'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
          
          <EarningsTrendChart 
            transactions={data.transactionData} 
            timeframe={timeframe}
          />
        </div>
      </div>
      
      <hr className="border-[#E4E4E4] my-6" />

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#343C6A] mb-4">This Year Earnings</h2>
        <div className="flex gap-6">
          <InfoCard title="Earnings" amount={data.totalYearEarnings} variant="earnings" />
          <InfoCard title="Payout" amount={data.totalYearPayout} variant="payout" />
        </div>
      </div>

      <hr className="border-[#E4E4E4] my-6" />

      <div>
        <h2 className="text-xl font-semibold text-[#343C6A] mb-4">Lifetime Earnings</h2>
        <div className="flex gap-6">
          <InfoCard title="Earnings" amount={data.totalLifetimeEarnings} variant="earnings" />
          <InfoCard title="Payout" amount={data.totalLifetimePayout} variant="payout" />
        </div>
      </div>
    </div>
  );
}