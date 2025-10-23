import { useState, useMemo } from 'react';
import type { Transaction } from '@/types/user';
import TransactionCard from './TransactionCard';
import { Info } from 'lucide-react';

interface TransactionsTabProps {
  transactions: Transaction[];
}

type TransactionFilter = 'All' | 'Successful' | 'Failed';

const TransactionsTab: React.FC<TransactionsTabProps> = ({ transactions }) => {
  const [activeFilter, setActiveFilter] = useState<TransactionFilter>('All');

  const TABS: TransactionFilter[] = ['All', 'Successful', 'Failed'];

  const filteredTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    
    const sorted = [...transactions].sort((a, b) => b.timestamp - a.timestamp);

    switch (activeFilter) {
      case 'Failed':
        return sorted.filter(t => t.status?.toLowerCase() === 'failed');
      
      case 'Successful':
        return sorted.filter(t => t.status?.toLowerCase() !== 'failed');
        
      case 'All':
      default:
        return sorted;
    }
  }, [activeFilter, transactions]);

  const hasFailedTransactions = activeFilter === 'Failed' && filteredTransactions.length > 0;

  return (
    <div className="sm:bg-white sm:p-6 sm:rounded-2xl sm:border sm:border-[#EFEFEF]">
      <div className="bg-white p-1 rounded-2xl flex items-center gap-2 mb-6 sm:bg-transparent sm:p-0 sm:gap-4">
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
              <TransactionCard key={`${transaction.paymentId || 'no-id'}-${index}`} transaction={transaction} />
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

export default TransactionsTab;