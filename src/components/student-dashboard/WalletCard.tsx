import { useMemo } from 'react';
import { MoveDownLeft, MoveUpRight, Plus, Wallet } from 'lucide-react';
import type { Transaction } from '@/types/user';

interface WalletCardProps {
  balance: number;
  transactions: Transaction[];
  onAddFunds: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const WalletCard: React.FC<WalletCardProps> = ({ balance, transactions, onAddFunds }) => {
  
  const { totalCredit, totalDebit } = useMemo(() => {
    if (!Array.isArray(transactions)) {
      return { totalCredit: 0, totalDebit: 0 };
    }

    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'credit') {
          acc.totalCredit += transaction.amount;
        } else if (transaction.type === 'debit') {
          acc.totalDebit += transaction.amount;
        }
        return acc;
      },
      { totalCredit: 0, totalDebit: 0 }
    );
  }, [transactions]);

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-[#EFEFEF] flex flex-col shadow-sm">
        <div className="flex items-center gap-3 mb-4">
        <Wallet size={20} className="text-[#242645]" />
        <h3 className="text-base md:text-lg font-semibold text-[#242645]">
          Wallet
        </h3>
      </div>
      <p className="text-2xl md:text-4xl font-medium text-[#28A745] mb-4">
        {formatCurrency(balance)}
      </p>
      
      <div className="flex items-center gap-4 md:text-lg text-sm font-medium mb-4">
        <div className="flex items-center gap-2 text-[#E30004] md:text-[#E30004]">
            <div className="bg-red-100 rounded-md p-1 md:bg-red-100"> 
                <MoveDownLeft size={16} className="text-[#E30004]"/>
            </div>
            <span>{formatCurrency(totalDebit)}</span>
        </div>
        <div className="flex items-center gap-2 text-[#28A745] md:text-[#28A745]">
            <div className="bg-green-100 rounded-md p-1 md:bg-green-100">
                <MoveUpRight size={16} className="text-[#28A745]"/>
            </div>
            <span>{formatCurrency(totalCredit)}</span>
        </div>
      </div>

      <button 
        onClick={onAddFunds}
        className="w-full py-2.5 px-4 bg-white border border-[#13097D] rounded-lg text-[#242645] text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
        <Plus size={18} />
        Add funds
      </button>

    </div>
  );
};

export default WalletCard;