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

type Props = {
  requests: CallData[];
  completed: CallData[];
};

const ProBuddyCallsTab: React.FC<Props> = ({ requests, completed }) => {
  const [activeTab, setActiveTab] = useState('Requests');
  const currentData = activeTab === 'Requests' ? requests : completed;

  return (
    <div className="pt-3 pl-3 pr-3 sm:pt-6 sm:pl-6 sm:pr-0 font-poppins">
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

      <div className="w-full sm:w-220 h-auto sm:h-119.5 rounded-2xl border border-[#EFEFEF] bg-white pt-4 sm:pt-5 pl-3 sm:pl-[16.5px] pr-3 sm:pr-6 flex flex-col">

        <div className="flex gap-2 sm:gap-3 h-8 sm:h-7.5 w-full sm:w-58.75 mb-4 sm:mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('Requests')}
            className={`flex items-center justify-center px-3 sm:px-4 h-full rounded-3xl cursor-pointer transition-colors shrink-0 ${
              activeTab === 'Requests' ? 'bg-[#E8E7F2]' : 'bg-transparent'
            }`}
          >
            <span className={`text-[14px] sm:text-[16px] font-medium leading-none ${
              activeTab === 'Requests' ? 'text-[#0E1629]' : 'text-[#6B7280]'
            }`}>
              Requests
            </span>
          </button>

          <button
            onClick={() => setActiveTab('Completed')}
            className={`flex items-center justify-center px-3 sm:px-4 h-full rounded-3xl cursor-pointer transition-colors shrink-0 ${
              activeTab === 'Completed' ? 'bg-[#E8E7F2]' : 'bg-transparent'
            }`}
          >
            <span className={`text-[14px] sm:text-[16px] font-medium leading-none ${
              activeTab === 'Completed' ? 'text-[#0E1629]' : 'text-[#6B7280]'
            }`}>
              Completed
            </span>
          </button>
        </div>

        <div key={activeTab} className="tab-transition flex flex-col w-full">
          {currentData.length > 0 ? (
            currentData.map((call) => (
              <div
                key={call.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] sm:flex sm:items-center w-full gap-x-1.5 gap-y-1.5 sm:gap-0 min-h-14.25 mb-4 sm:mb-4 border-b border-[#EFEFEF] pb-4 sm:pb-4 last:border-0 last:pb-0"
              >

                <div className="w-9 h-9 sm:w-13 sm:h-13 rounded-full bg-[#2F43F21A] border border-[#2F43F2] flex items-center justify-center shrink-0 mr-0 sm:mr-2">
                  <span className="text-[15px] sm:text-[20px] font-semibold text-[#2F43F2] leading-tight">
                    {call.initials}
                  </span>
                </div>

                <div className="min-w-0 gap-0.5 flex flex-col sm:w-35.5 sm:flex-1 sm:shrink-0 sm:mr-43.75">
                  <span className="text-[11px] sm:text-[20px] font-medium text-[#0E1629] leading-[130%] truncate">
                    {call.name}
                  </span>
                  <span className="text-[9px] sm:text-[16px] font-medium text-[#6B7280] leading-[130%] truncate">
                    {call.designation}
                  </span>
                </div>

                {activeTab === 'Requests' ? (
                  <>
                    <div className="gap-0.5 flex flex-col shrink-0 w-16 sm:w-30 ml-0 sm:ml-0 text-right sm:text-left">
                      <span className="text-[9px] sm:text-[16px] font-medium text-[#6B7280] leading-none truncate">
                        {call.date}
                      </span>
                      <span className="text-[9px] sm:text-[16px] font-medium text-[#6B7280] leading-none truncate">
                        {call.time}
                      </span>
                    </div>

                    <button className="w-12 sm:w-20 h-7 sm:h-8.5 rounded-xl border border-[#2F43F2] flex items-center justify-center cursor-pointer ml-0 sm:ml-auto mr-0 sm:mr-2 hover:bg-[#2F43F21A] transition-colors">
                      <span className="text-[9px] sm:text-[12px] font-medium text-[#2F43F2] leading-none">
                        Call
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="gap-0.5 flex flex-col shrink-0 w-16 sm:w-30 ml-0 sm:ml-0 text-right sm:text-left">
                      <span className="text-[9px] sm:text-[16px] font-medium text-[#6B7280] leading-none truncate">
                        {call.date}
                      </span>
                      <span className="text-[9px] sm:text-[16px] font-medium text-[#6B7280] leading-none truncate">
                        {call.time}
                      </span>
                    </div>

                    <div className="gap-0.5 flex flex-col shrink-0 ml-0 sm:ml-auto mr-0 sm:mr-2 w-16 sm:w-30 text-right">
                      <span className="text-[9px] sm:text-[16px] font-medium text-[#6B7280] leading-none truncate">
                        Call Duration
                      </span>
                      <span className="text-[9px] sm:text-[16px] font-medium text-[#6B7280] leading-none truncate">
                        {call.duration ?? 'NA'}
                      </span>
                    </div>
                  </>
                )}

              </div>
            ))
          ) : (
            <div className="w-full h-50 flex items-center justify-center text-[16px] font-medium text-[#6B7280]">
              NA
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProBuddyCallsTab;
