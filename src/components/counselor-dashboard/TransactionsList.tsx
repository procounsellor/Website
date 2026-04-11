import { ArrowUp, ArrowDown } from 'lucide-react';

const transactions = [
  { type: 'received', from: 'From My Account', id: '12345678', amount: 2345, date: '12 Jul 25' },
  { type: 'sent', to: 'To My Account', id: '87654321', amount: 1500, date: '11 Jul 25' },
  { type: 'received', from: 'From My Account', id: '13579246', amount: 1800, date: '10 Jul 25' },
];

export default function TransactionsList() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Transactions</h3>
      <div className="space-y-6">
        {transactions.map((tx, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-4 ${tx.type === 'received' ? 'bg-green-100' : 'bg-red-100'}`}>
              {tx.type === 'received' ? (
                <ArrowDown className="w-5 h-5 text-green-600" />
              ) : (
                <ArrowUp className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-gray-700">{tx.type === 'received' ? 'Received' : 'Sent'}</p>
              <p className="text-sm text-gray-500">{tx.type === 'received' ? tx.from : tx.to}</p>
              <p className="text-xs text-gray-400 mt-1">Transaction ID: {tx.id}</p>
            </div>
            <div className="text-right">
              <p className={`font-bold ${tx.type === 'received' ? 'text-green-600' : 'text-red-500'}`}>
                {tx.type === 'received' ? '+' : '-'}{`₹${tx.amount.toLocaleString('en-IN')}`}
              </p>
              <p className="text-sm text-gray-400">{tx.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}