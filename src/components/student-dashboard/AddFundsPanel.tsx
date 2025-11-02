import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AddFundsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onAddMoney: (amount: number) => void;
  isProcessing?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const AddFundsPanel: React.FC<AddFundsPanelProps> = ({ isOpen, onClose, balance, onAddMoney, isProcessing }) => {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  const handleAddClick = () => {
    if (!amount || Number(amount) <= 0 || isProcessing) return;
    onAddMoney(Number(amount));
  };

  const presetAmounts = [1000, 3000, 5000];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[99] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
  className={`
    fixed z-[100] bg-white shadow-2xl transition-all duration-300 ease-in-out
    
    /* === Mobile styles (default) === */
    /* This makes it a centered modal */
    top-1/2 left-1/2 w-[90vw] max-w-[460px] rounded-2xl
    
    /* === Desktop styles (md: and up) === */
    /* This overrides mobile styles and makes it a side-panel */
    md:top-0 md:right-0 md:left-auto md:h-full md:w-[460px] md:rounded-none
    
    /* === Animation Logic === */
    ${
      isOpen
        ? 'opacity-100 translate-x-[-50%] translate-y-[-50%] scale-100 md:translate-x-0'
        : 'opacity-0 pointer-events-none translate-x-[-50%] translate-y-[-45%] scale-95 md:translate-x-full md:translate-y-0'
    }
  `}
>
        <div className="flex items-center justify-between h-[68px] px-6 border-b border-[#EFEFEF]">
          <h2 className="text-lg font-semibold text-[#343C6A]">Wallet Balance</h2>
          <button onClick={onClose} className="p-2 rounded-md transition-colors hover:bg-gray-100">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-[#343C6A] mb-3">
              Available Wallet Balance
            </h3>
            <div className="flex items-center justify-center px-4 h-[49px] bg-white border border-[#EFEFEF] rounded-2xl">
              <span className="font-semibold text-lg text-green-600">{balance} Pro Coins</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#343C6A] mb-3">
              Add Money to Your Wallet
            </h3>
            <div className="p-4 border border-[#EFEFEF] rounded-2xl h-[194px]">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="₹ Enter Amount"
                className="w-full h-[40px] bg-[#F5F5F5] border border-[#EFEFEF] rounded-[10px] text-center text-lg font-semibold placeholder:text-[#23232380] focus:outline-none focus:ring-2 focus:ring-[#13097D]"
              />
              <div className="flex justify-between my-4 gap-2">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(String(preset))}
                    className="flex-1 h-[36px] border border-[#13097D] rounded-[10px] text-[#13097D] font-semibold text-xs text-center hover:bg-[#13097D] hover:text-white transition-colors md:h-[40px] md:text-sm md:flex-none md:w-[117px]"
                  >
                    + {formatCurrency(preset)}
                  </button>
                ))}
              </div>
              <button
                onClick={handleAddClick}
                disabled={!amount || Number(amount) <= 0 || isProcessing}
                className="w-full h-[42px] bg-[#FA660F] rounded-[12px] text-white font-semibold text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Add Money'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFundsPanel;