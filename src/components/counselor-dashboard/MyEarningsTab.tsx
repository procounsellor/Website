import EarningsChart from './EarningsChart';
import TransactionsList from './TransactionsList';

export default function MyEarningsTab() {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EarningsChart />
        </div>
        <div>
          <TransactionsList />
        </div>
      </div>
    </div>
  );
}