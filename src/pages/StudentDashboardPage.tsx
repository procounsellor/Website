import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import ProfileHeader from '@/components/student-dashboard/ProfileHeader';
import MyInfoTab from '@/components/student-dashboard/MyInfoTab';
import AppointmentsTab from '@/components/student-dashboard/AppointmentsTab';
import { Loader2 } from 'lucide-react';
import CounsellorsTab from '@/components/student-dashboard/CounsellorsTab';
import TransactionsTab from '@/components/student-dashboard/TransactionsTab';
import ReviewsTab from '@/components/student-dashboard/ReviewsTab';
import MyCoursesTab from '@/components/student-dashboard/tabs/MyCoursesTab';
import EditProfileModal from '@/components/student-dashboard/EditProfileModal';
import EditPreferencesModal from '@/components/student-dashboard/EditPreferencesModal';
import AddFundsPanel from '@/components/student-dashboard/AddFundsPanel';
import startRecharge from '@/api/wallet';
import { updateUserProfile, getUserProfile } from '@/api/user';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

declare global {
  interface Window {
    Razorpay: unknown;
  }
}
type RazorpayConstructor = new (opts: unknown) => { open: () => void };

const TABS = ['My Info', 'Appointments', 'Counsellors', 'My Courses', 'Transactions', 'Reviews'];

const StudentDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('My Info');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [prefsEditMode, setPrefsEditMode] = useState<'course' | 'states' | null>(null);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

  const {
    data: user,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId || !token) {
        throw new Error('User not authenticated');
      }
      return getUserProfile(userId, token);
    },
    enabled: !!userId && !!token,
  });

  useEffect(() => {
    if (user && !loading) {
      if (!user.firstName || !user.email) {
        setIsEditModalOpen(true);
      }
    }
  }, [user, loading]);

  useEffect(() => {
    const state = location.state as { activeTab?: string; openAddFunds?: boolean };
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
    }
    if (state?.openAddFunds) {
      setIsAddFundsOpen(true);
    }
    if (state) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const {
    mutateAsync: handleUpdateProfile,
  } = useMutation({
    mutationFn: (updatedData: { firstName: string; lastName: string; email: string }) => {
      if (!userId || !token) {
        throw new Error("User ID is missing. Please log in again.");
      }
      return updateUserProfile(userId, updatedData, token);
    },
    onSuccess: () => {
      toast.success('Profile updated!');
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    mutate: handleAddFunds,
    isPending: isStartingPayment,
  } = useMutation({
    mutationFn: async (amount: number) => {
      if (!amount || amount <= 0) {
        throw new Error('A valid amount is required.');
      }
      if (!user?.userName) {
        throw new Error('User data not found.');
      }
      setIsAddFundsOpen(false);
      return await startRecharge(user.userName, amount);
    },
    onSuccess: (order) => {
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'ProCounsel Wallet',
        description: 'Wallet Recharge',
        notes: { userId: user?.userName },
        handler: () => {
          toast.success('Payment successful. Your balance will be updated shortly.');
          queryClient.invalidateQueries({ queryKey: ['user', userId] });
        },
        theme: { color: '#3399cc' },
      };
      const Rz = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;
      const rzp = new Rz(options);
      rzp.open();
    },
    onError: (error) => {
      console.error('Failed to initiate Razorpay order.', error);
      toast.error('Could not start the payment process. Please try again later.');
    },
  });

  const handleOpenPrefsModal = (mode: 'course' | 'states') => {
    setPrefsEditMode(mode);
  };

  const handleClosePrefsModal = () => {
    setPrefsEditMode(null);
    queryClient.invalidateQueries({ queryKey: ['user', userId] });
  };

  const onUpdateProfile = async (updatedData: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    await handleUpdateProfile(updatedData);
  };

  const error = queryError ? (queryError as Error).message : null;

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
          <nav
            className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide"
            aria-label="Tabs"
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-[#13097D] text-[#13097D]'
                    : 'border-transparent text-[#8C8CA1] hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-3 px-2 border-b-[3px] font-semibold text-[12px] md:text-sm transition-colors shrink-0`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div>
          {activeTab === 'My Info' && (
            <MyInfoTab
              user={user}
              onEditCourse={() => handleOpenPrefsModal('course')}
              onEditStates={() => handleOpenPrefsModal('states')}
              onAddFunds={() => setIsAddFundsOpen(true)}
            />
          )}
          {activeTab === 'Appointments' && <AppointmentsTab />}
          {activeTab === 'Counsellors' && <CounsellorsTab />}
          {activeTab === 'My Courses' && <MyCoursesTab />}
          {activeTab === 'Transactions' && (
            <TransactionsTab
              transactions={user.transactions || []}
              offlineTransactions={user.offlineTransactions || []}
            />
          )}
          {activeTab === 'Reviews' && <ReviewsTab />}
        </div>
      </div>
      <EditProfileModal
        key={user.email}
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={onUpdateProfile}
        onUploadComplete={() =>
          queryClient.invalidateQueries({ queryKey: ['user', userId] })
        }
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
        balance={user.walletAmount}
        onAddMoney={handleAddFunds}
        isProcessing={isStartingPayment}
      />
    </div>
  );
};

export default StudentDashboardPage;