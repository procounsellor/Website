import { useState } from 'react';
import CustomCalendar from "@/components/Calendar";
import MyEarningsTab from '@/components/counselor-dashboard/MyEarningsTab';
import ClientsTab from '@/components/counselor-dashboard/ClientsTab';
import ReviewsTab from '@/components/counselor-dashboard/ReviewsTab';

export default function CounselorDashboard() {
    const [activeTab, setActiveTab] = useState('My Earnings');
    const tabs = ['My Calendar', 'My Earnings', 'Appointments', 'Reviews', 'Clients'];

    return (
        <div className="w-full bg-[#F5F5F7] px-4 md:px-8 lg:px-16 xl:px-32 mt-20 flex flex-col items-center">
            <div className="w-full max-w-[1200px] flex justify-between items-center py-7">
               <div className="flex items-center gap-4">
                 <img src="/counselor.png" alt="Counselor" />
                 <h1 className="flex flex-col gap-2 font-semibold text-2xl text-[#343C6A]">
                    Ashutosh Kumar
                    <span className="text-[#718EBF] text-lg font-medium">
                        Career Counselor, 5+ years of experience
                    </span>
                 </h1>
               </div>
               <button className="h-full bg-white py-2.5 px-4 border border-[#343c6a] rounded-[12px] text-[16px] font-medium">
                View profile
               </button>
            </div>
            
            <div className="w-full max-w-[1200px]">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${
                            activeTab === tab
                                ? 'border-[#13097D] text-[#13097D]'
                                : 'border-transparent text-[#8C8CA1] hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-lg transition-colors`}
                        >
                            {tab}
                        </button>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="w-full max-w-[1200px] mt-8 mb-16">
                {activeTab === 'My Calendar' && <CustomCalendar />}
                {activeTab === 'My Earnings' && <MyEarningsTab />}
                {activeTab === 'Appointments' && <div className="p-8 bg-white rounded-lg">Appointments content goes here.</div>}
                {activeTab === 'Reviews' && <ReviewsTab />}
                {activeTab === 'Clients' && <ClientsTab />}
            </div>
        </div>
    );
}