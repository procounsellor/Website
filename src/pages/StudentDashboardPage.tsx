import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/AuthStore';
import type { User } from '@/types/user';
import ProfileHeader from '@/components/student-dashboard/ProfileHeader';
import MyInfoTab from '@/components/student-dashboard/MyInfoTab';
import AppointmentsTab from '@/components/student-dashboard/AppointmentsTab';
import { Loader2 } from 'lucide-react';
import CounsellorsTab from '@/components/student-dashboard/CounsellorsTab';
import TransactionsTab from '@/components/student-dashboard/TransactionsTab';
import ReviewsTab from '@/components/student-dashboard/ReviewsTab';
import EditProfileModal from '@/components/student-dashboard/EditProfileModal';
import EditPreferencesModal from '@/components/student-dashboard/EditPreferencesModal';
import AddFundsPanel from '@/components/student-dashboard/AddFundsPanel';
import startRecharge from '@/api/wallet';
import { updateUserProfile } from '@/api/user';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: unknown;
  }
}
type RazorpayConstructor = new (opts: unknown) => { open: () => void };


const TABS = ['My Info', 'Appointments', 'Counsellors', 'Transactions', 'Reviews'];

const StudentDashboardPage: React.FC = () => {
  const { userId } = useAuthStore();
  const refreshUser = useAuthStore(state => state.refreshUser);
  const token = localStorage.getItem('jwt');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('My Info');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [prefsEditMode, setPrefsEditMode] = useState<'course' | 'states' | null>(null);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

  const handleOpenPrefsModal = (mode: 'course' | 'states') => {
    setPrefsEditMode(mode);
  };

  const fetchUserProfile = useCallback(async () => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }
    try {
      const userData = await refreshUser(true);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      if (loading) setLoading(false);
    }
  }, [userId, token, loading, refreshUser]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (user && !loading) {
      if (!user.firstName || !user.email) {
        setIsEditModalOpen(true);
      }
    }
  }, [user, loading]);

  const handleUpdateProfile = async (updatedData: { firstName: string; lastName: string; email: string }) => {
    if (!userId || !token) {
      throw new Error("User ID is missing. Please log in again.");
    }
    await updateUserProfile(userId, updatedData, token);
    await fetchUserProfile(); 
  };

  const handleClosePrefsModal = () => {
    setPrefsEditMode(null);
    fetchUserProfile();
  };

  const calculatedBalance = useMemo(() => {
    if (!user?.transactions || !Array.isArray(user.transactions)) {
      return 0;
    }
    return user.transactions.reduce((acc, transaction) => {
      if (transaction.type === 'credit') return acc + transaction.amount;
      if (transaction.type === 'debit') return acc - transaction.amount;
      return acc;
    }, 0);
  }, [user?.transactions]);

  const handleAddFunds = async (amount: number) => {
    if (!amount || amount <= 0) {
      console.error('A valid amount is required.');
      return;
    }
    setIsAddFundsOpen(false);
    try {
      const order = await startRecharge(user?.userName ?? '', amount);
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "ProCounsel Wallet",
        description: "Wallet Recharge",
        notes: { userId: user?.userName },
        handler: async function () {
          toast.success("Payment successful. Your balance will be updated shortly.");
          try {
            await fetchUserProfile();
          } catch (err) {
            console.error('Failed to refresh user balance after payment.', err);
          }
        },
        theme: { color: "#3399cc" },
      };

      const Rz = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;
      const rzp = new Rz(options);
      rzp.open();

    } catch (error) {
      console.error("Failed to initiate Razorpay order.", error);
      alert("Could not start the payment process. Please try again later.");
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-blue-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 bg-red-50 rounded-lg m-8">
        <h2 className="text-xl font-semibold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p>No user data found</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F7] min-h-screen p-4 md:p-8 pt-15 md:pt-20">
      <div className="max-w-7xl mx-auto">
        <ProfileHeader user={user} onEditClick={() => setIsEditModalOpen(true)} />

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide" aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-[#13097D] text-[#13097D]'
                    : 'border-transparent text-[#8C8CA1] hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-3 px-2 border-b-[3px] font-semibold text-[12px] md:text-sm transition-colors flex-shrink-0`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div>
          {activeTab === 'My Info'  && <MyInfoTab 
                user={user} 
                onEditCourse={() => handleOpenPrefsModal('course')}
                onEditStates={() => handleOpenPrefsModal('states')}
                onAddFunds={() => setIsAddFundsOpen(true)}
                />}
          {activeTab === 'Appointments' && <AppointmentsTab />}
          {activeTab === 'Counsellors' && <CounsellorsTab />}
          {activeTab === 'Transactions' && <TransactionsTab transactions={user.transactions} />}
          {activeTab === 'Reviews' && <ReviewsTab />}
        </div>
      </div>
      <EditProfileModal 
        key={user.email}
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateProfile}
        onUploadComplete={fetchUserProfile}
      />
      {prefsEditMode && (
        <EditPreferencesModal
          mode={prefsEditMode}
          currentUser={user}
          onClose={handleClosePrefsModal}
        />
      )}
      <AddFundsPanel 
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
        balance={calculatedBalance}
        onAddMoney={handleAddFunds}
      />
    </div>
  );
};

export default StudentDashboardPage;