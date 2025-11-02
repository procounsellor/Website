// src/components/counselor-dashboard/CounselorTransactionsTab.tsx

import { useState, useMemo } from 'react';
import type { Transaction } from '@/types/earnings'; // Changed from @/types/user
import CounselorTransactionCard from './CounselorTransactionCard'; // Changed from TransactionCard
import { Info } from 'lucide-react';

interface TransactionsTabProps {
  transactions: Transaction[];
  offlineTransactions: Transaction[];
}

type TransactionFilter = 'All' | 'Successful' | 'Failed' | 'Offline Payments';

const CounselorTransactionsTab: React.FC<TransactionsTabProps> = ({ transactions, offlineTransactions }) => {
  const [activeFilter, setActiveFilter] = useState<TransactionFilter>('All');

  const TABS: TransactionFilter[] = ['All', 'Successful', 'Failed', 'Offline Payments'];

  const filteredTransactions = useMemo(() => {
    const onlineTrans = Array.isArray(transactions) ? [...transactions] : [];
    const offlineTrans = Array.isArray(offlineTransactions) ? [...offlineTransactions] : [];
    switch (activeFilter) {
      case 'Failed':
        return onlineTrans.filter(t => t.status?.toLowerCase() === 'failed');
      
      case 'Successful':
        return onlineTrans.filter(t => t.status?.toLowerCase() !== 'failed');
        
      case 'Offline Payments':
        return offlineTrans;

      case 'All':
      default:
        return [...onlineTrans, ...offlineTrans];
    }
  }, [activeFilter, transactions, offlineTransactions]);

  const hasFailedTransactions = activeFilter === 'Failed' && filteredTransactions.length > 0;

  return (
    <div className="sm:bg-white sm:p-6 sm:rounded-2xl sm:border sm:border-[#EFEFEF]">
      <div className="bg-white p-1 rounded-2xl flex items-center flex-wrap gap-2 mb-6 sm:bg-transparent sm:p-0 sm:gap-4">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`flex-1 text-center px-3 py-1.5 sm:flex-none sm:w-auto sm:px-4 sm:py-2 text-sm sm:text-base font-medium rounded-full transition-colors duration-200 ${
              activeFilter === tab 
              ? 'bg-[#E8E7F2] text-[#13097D]' 
              : 'bg-transparent text-[#13097D]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {filteredTransactions.length > 0 ? (
          <div className="flex flex-col gap-3 sm:gap-0 sm:divide-y sm:divide-gray-200">
            {filteredTransactions.map((transaction, index) => (
              <CounselorTransactionCard key={`${transaction.paymentId || 'no-id'}-${index}`} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-gray-700">No Transactions Found</h3>
            <p className="text-gray-500 mt-2">There are no {activeFilter.toLowerCase()} transactions.</p>
          </div>
        )}
      </div>
      {hasFailedTransactions && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg flex items-center gap-3">
          <Info className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            If an amount was deducted for a failed transaction, it will be automatically refunded to the source account within 5-7 working days.
          </p>
        </div>
      )}
    </div>
  );
};

export default CounselorTransactionsTab;