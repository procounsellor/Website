import { useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '@/store/AuthStore';
import { getUserProfile } from '@/api/user';
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

const TABS = ['My Info', 'Appointments', 'Counsellors', 'Transactions', 'Reviews'];

const StudentDashboardPage: React.FC = () => {
  const { userId } = useAuthStore();
  const token = localStorage.getItem('jwt');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('My Info');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [prefsEditMode, setPrefsEditMode] = useState<'course' | 'states' | null>(null);

  const handleOpenPrefsModal = (mode: 'course' | 'states') => {
    setPrefsEditMode(mode);
  };

  const fetchUserProfile = useCallback(async () => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }
    try {
      const userData = await getUserProfile(userId, token);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      if (loading) setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleClosePrefsModal = () => {
    setPrefsEditMode(null);
    fetchUserProfile();
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
    <div className="bg-[#F5F5F7] min-h-screen p-4 md:p-8 pt-14 md:pt-20">
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
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors flex-shrink-0`}
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
      />
      {prefsEditMode && (
        <EditPreferencesModal
          mode={prefsEditMode}
          currentUser={user}
          onClose={handleClosePrefsModal}
        />
      )}
    </div>
  );
};

export default StudentDashboardPage;