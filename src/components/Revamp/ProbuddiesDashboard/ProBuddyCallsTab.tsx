import React, { useState } from 'react';

interface CallData {
  id: string;
  initials: string;
  name: string;
  designation: string;
  date: string;
  time: string;
  dateTime?: string;
  duration?: string;
}

const mockRequests: CallData[] = Array(5).fill(null).map((_, index) => ({
  id: `req-${index}`,
  initials: 'SG',
  name: 'Subhash Ghai',
  designation: 'Student',
  dateTime: '14 Jul, 10:30 AM',
  date: '14 Jul, 2026',
  time: '10:30 AM',
}));

const mockCompleted: CallData[] = Array(5).fill(null).map((_, index) => ({
  id: `comp-${index}`,
  initials: 'SG',
  name: 'Subhash Ghai',
  designation: 'Student',
  date: '14 Jul, 2026',
  time: '10:30 AM',
  duration: '10 Min',
}));

const ProBuddyCallsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Requests');

  const currentData = activeTab === 'Requests' ? mockRequests : mockCompleted;

  return (
    <div className="pt-[24px] pl-[24px] font-poppins">
      
      <style>
        {`
          @keyframes fadeInSlide {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .tab-transition {
            animation: fadeInSlide 0.3s ease-out forwards;
          }
        `}
      </style>

      <div className="w-[880px] h-[478px] rounded-[16px] border border-[#EFEFEF] bg-white pt-[20px] pl-[16.5px] pr-[24px] flex flex-col">
        
        <div className="flex gap-[12px] h-[30px] w-[235px] mb-[24px]">
          <button
            onClick={() => setActiveTab('Requests')}
            className={`flex items-center justify-center px-[16px] h-full rounded-[24px] cursor-pointer transition-colors ${
              activeTab === 'Requests' ? 'bg-[#E8E7F2]' : 'bg-transparent'
            }`}
          >
            <span className={`text-[16px] font-medium leading-none ${
              activeTab === 'Requests' ? 'text-[#0E1629]' : 'text-[#6B7280]'
            }`}>
              Requests
            </span>
          </button>

          <button
            onClick={() => setActiveTab('Completed')}
            className={`flex items-center justify-center px-[16px] h-full rounded-[24px] cursor-pointer transition-colors ${
              activeTab === 'Completed' ? 'bg-[#E8E7F2]' : 'bg-transparent'
            }`}
          >
            <span className={`text-[16px] font-medium leading-none ${
              activeTab === 'Completed' ? 'text-[#0E1629]' : 'text-[#6B7280]'
            }`}>
              Completed
            </span>
          </button>
        </div>

        <div key={activeTab} className="tab-transition flex flex-col w-full">
          {currentData.map((call) => (
            <div 
              key={call.id} 
              className="flex items-center w-full h-[57px] mb-[16px] border-b border-[#EFEFEF] pb-[16px] last:border-0 last:pb-0"
            >
              
              <div className="w-[52px] h-[52px] rounded-full bg-[#2F43F21A] border border-[#2F43F2] flex items-center justify-center shrink-0 mr-[12px]">
                <span className="text-[20px] font-semibold text-[#2F43F2] leading-[1.25]">
                  {call.initials}
                </span>
              </div>

              <div className="w-[142px] gap-[4px] flex flex-col shrink-0 mr-[175px]">
                <span className="text-[20px] font-medium text-[#0E1629] leading-[150%]">
                  {call.name}
                </span>
                <span className="text-[16px] font-medium text-[#6B7280] leading-[150%]">
                  {call.designation}
                </span>
              </div>

              {activeTab === 'Requests' ? (
                <>
                  <div className="gap-[9px] flex flex-col shrink-0 w-[120px]">
                    <span className="text-[16px] font-medium text-[#6B7280] leading-none">
                      {call.date}
                    </span>
                    <span className="text-[16px] font-medium text-[#6B7280] leading-none">
                      {call.time}
                    </span>
                  </div>

                  <button className="w-[80px] h-[34px] rounded-[8px] border border-[#2F43F2] flex items-center justify-center cursor-pointer ml-auto mr-[12px] hover:bg-[#2F43F21A] transition-colors">
                    <span className="text-[12px] font-medium text-[#2F43F2] leading-none">
                      Call
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <div className="gap-[9px] flex flex-col shrink-0 w-[120px]">
                    <span className="text-[16px] font-medium text-[#6B7280] leading-none">
                      {call.date}
                    </span>
                    <span className="text-[16px] font-medium text-[#6B7280] leading-none">
                      {call.time}
                    </span>
                  </div>

                  <div className="gap-[9px] flex flex-col shrink-0 ml-auto mr-[12px] w-[120px]">
                    <span className="text-[16px] font-medium text-[#6B7280] leading-none">
                      Call Duration
                    </span>
                    <span className="text-[16px] font-medium text-[#6B7280] leading-none">
                      {call.duration}
                    </span>
                  </div>
                </>
              )}

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProBuddyCallsTab;