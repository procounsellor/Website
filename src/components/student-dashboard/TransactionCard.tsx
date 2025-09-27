import type { Transaction } from '@/types/user';
import { ArrowDownCircle, ArrowUpCircle, XCircle } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
}

const formatDate = (timestamp: number) => {
  if (!timestamp) return 'Invalid Date';
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    weekday: 'long',
  }).format(date);
};

const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number') return '₹--';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const truncateText = (text: string | null | undefined, maxLength: number) => {
  if (!text) return 'N/A';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const isFailed = transaction.status?.toLowerCase() === 'failed';

  const getTransactionDetails = () => {
    if (isFailed) {
      return {
        icon: <XCircle className="w-12 h-12 text-[#EE1C1F] bg-[#EE1C1F26] rounded-full p-2 flex-shrink-0" />,
        title: 'Payment Failed',
        description: transaction.description?.startsWith('Payment was unsuccessful') 
            ? 'Wallet Recharge'
            : transaction.description,
        amountColor: 'text-[#EE1C1F]',
      };
    }
    if (transaction.type === 'credit') {
      return {
        icon: <ArrowDownCircle className="w-12 h-12 text-[#28A745] bg-[#28A74526] rounded-full p-2 flex-shrink-0" />,
        title: 'Funds Added',
        description: transaction.description,
        amountColor: 'text-[#28A745]',
      };
    }
    return {
      icon: <ArrowUpCircle className="w-12 h-12 text-blue-500 bg-blue-50 rounded-full p-2 flex-shrink-0" />,
      title: 'Paid To',
      description: transaction.description,
      amountColor: 'text-gray-800',
    };
  };

  const { icon, title, description, amountColor } = getTransactionDetails();

  return (
    <div className="py-6">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center gap-4 w-[40%] flex-shrink-0">
          {icon}
          <div className="flex-grow overflow-hidden">
            <h4 className="font-semibold text-lg text-[#242645]">{title}</h4>
            <p className="text-base font-medium text-[#8C8CA1] truncate" title={description || ''}>
                {description || 'No description'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8 w-[40%]">
          <div className="w-1/2">
            <p className="text-sm font-semibold text-[#8C8CA1] mb-1">Transaction ID</p>
            <p className="font-medium text-base text-[#242645] truncate" title={transaction.paymentId || ''}>
                {truncateText(transaction.paymentId, 12)}
            </p>
          </div>
          <div className="w-1/2">
            <p className="text-sm font-semibold text-[#8C8CA1] mb-1">Date</p>
            <p className="font-medium text-base text-[#242645] whitespace-nowrap">{formatDate(transaction.timestamp)}</p>
          </div>
        </div>

        <div className="flex justify-end w-[20%]">
             <div>
                <p className="text-sm font-semibold text-[#8C8CA1] mb-1 text-right">Amount</p>
                <p className={`font-semibold text-lg ${amountColor}`}>
                    {transaction.type === 'debit' && !isFailed ? '-' : ''}
                    {formatCurrency(transaction.amount)}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;