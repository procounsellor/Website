import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/AuthStore';
import ProBuddySidebar from '@/components/Revamp/ProbuddiesDashboard/ProBuddySidebar';
import ProBuddyMainContent from '@/components/Revamp/ProbuddiesDashboard/ProBuddyMainContent';

const ProBuddiesDashboard: React.FC = () => {
  const { user, role, isAuthenticated, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!isAuthenticated || role !== "proBuddy")) {
      navigate("/");
    }
  }, [loading, isAuthenticated, role, navigate]);

  if (loading || (!isAuthenticated && role !== "proBuddy")) {
    return <div className="min-h-screen bg-[#C6DDF040]" />;
  }

  if (!user?.verified) {
    return (
      <div className="bg-[#C6DDF040] min-h-[calc(100vh)] flex flex-col items-center pb-20 p-8 text-center gap-6 font-poppins relative pt-[160px]">
        <div 
          className="absolute top-0 left-0 w-full h-[160px] bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/imageClient.png')" }}
        />
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full z-10 flex flex-col items-center border border-gray-100">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
               <svg className="w-10 h-10 text-[#0E1629]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#0E1629] mb-4">Application Under Review</h1>
            <p className="text-[#6B7280] text-lg mb-8 leading-relaxed">
              Your Pro Buddy application has been received and is currently under review by our team. Please check back later or wait for our verification confirmation.
            </p>
            <div className="bg-[#C6DDF040] rounded-xl p-5 w-full border border-[#0E1629]/10">
              <p className="text-sm text-[#0E1629] font-medium font-montserrat flex items-center justify-center gap-2">
                 <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 If your status doesn't change after approval, try logging out and logging back in.
              </p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#C6DDF040] min-h-screen pb-12 font-poppins relative">
      
      <div 
        className="w-full h-[160px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/imageClient.png')" }}
      />

      <div className="max-w-[1440px] mx-auto relative px-[120px]">
        
        <div className="flex flex-col md:flex-row gap-[24px] -mt-[120px]">
          
          <div className="flex-shrink-0">
            <ProBuddySidebar />
          </div>

          <div className="flex-shrink-0">
             <ProBuddyMainContent />
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProBuddiesDashboard;