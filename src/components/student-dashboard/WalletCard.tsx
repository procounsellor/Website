import { Plus, Wallet } from 'lucide-react';

interface WalletCardProps {
  balance: number;
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

const WalletCard: React.FC<WalletCardProps> = ({ balance, onAddFunds }) => {

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