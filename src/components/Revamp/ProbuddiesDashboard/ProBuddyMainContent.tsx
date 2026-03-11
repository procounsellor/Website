import React, { useState } from 'react';
import ProBuddyOverviewTab from './ProBuddyOverviewTab';
import ProBuddyCallsTab from './ProBuddyCallsTab';
import ProBuddyEarningsTab from './ProBuddyEarningsTab';
import ProBuddyReviewsTab from './ProBuddyReviewsTab';

const tabs = ['Overview', 'Calls', 'My Earnings', 'Reviews'];

const ProBuddyMainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="w-[928px] min-h-[594px] bg-white rounded-[16px] shadow-sm flex flex-col relative z-20 font-poppins">
      
      <div className="w-full h-[59px] bg-[#C6DDF040] flex items-center px-8 gap-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative h-full flex items-center justify-center cursor-pointer transition-colors"
            >
              <span 
                className={`text-[16px] leading-none ${
                  isActive 
                    ? 'font-semibold text-[#0E1629]' 
                    : 'font-medium text-[#6B7280] hover:text-[#0E1629]'
                }`}
              >
                {tab}
              </span>

              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%+16px)] h-[3px] bg-[#0E1629] rounded-t-[2px]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-grow">
        {activeTab === 'Overview' && <ProBuddyOverviewTab />}
        {activeTab === 'Calls' && <ProBuddyCallsTab />}
        {activeTab === 'My Earnings' && <ProBuddyEarningsTab />}
        {activeTab === 'Reviews' && <ProBuddyReviewsTab />}
      </div>

    </div>
  );
};

export default ProBuddyMainContent;