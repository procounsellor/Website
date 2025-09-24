import { useMemo } from 'react';
import { MoveDownLeft, MoveUpRight, Plus, Wallet } from 'lucide-react';
import type { Transaction } from '@/types/user';

interface WalletCardProps {
  balance: number;
  transactions: Transaction[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

const WalletCard: React.FC<WalletCardProps> = ({ balance, transactions }) => {
  
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
    <div className="bg-white p-6 rounded-xl border border-[#EFEFEF] flex flex-col">
        <div className="flex items-center gap-3 mb-6">
        <Wallet size={22} className="text-[#242645]" />
        <h3 className="text-lg font-bold text-[#242645]">
          Wallet Balance
        </h3>
      </div>
      <p className="text-4xl font-medium text-[#28A745] mb-6">
        {formatCurrency(balance)}
      </p>
      
      <div className="flex items-center gap-4 text-lg font-medium mb-6">
        <div className="flex items-center gap-2 text-[#E30004]">
            <MoveDownLeft size={22} className="bg-[#E30004] text-white rounded-sm p-1"/>
            <span>-{formatCurrency(totalDebit)}</span>
        </div>
        <div className="flex items-center gap-2 text-[#28A745]">
            <MoveUpRight size={22} className="bg-[#28A745] text-white rounded-sm p-1"/>
            <span>+{formatCurrency(totalCredit)}</span>
        </div>
      </div>

      <button className="w-full py-2.5 px-4 bg-white border border-[#13097D] rounded-lg text-[#242645] font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
        <Plus size={22} />
        Add funds
      </button>

    </div>
  );
};

export default WalletCard;