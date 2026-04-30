import React, { useState } from 'react';

interface CallData {
  id: string;
  userId: string;
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
  onCallRequest: (call: CallData) => void | Promise<void>;
  isCalling?: boolean;
};

const ProBuddyCallsTab: React.FC<Props> = ({ requests, completed, onCallRequest, isCalling = false }) => {
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
          .calls-scroll::-webkit-scrollbar {
            width: 4px;
          }
          .calls-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .calls-scroll::-webkit-scrollbar-thumb {
            background: #E5E7EB;
            border-radius: 99px;
          }
          .calls-scroll::-webkit-scrollbar-thumb:hover {
            background: #D1D5DB;
          }
        `}
      </style>

      <div className="w-full sm:w-220 h-auto sm:h-119.5 rounded-2xl border border-[#EFEFEF] bg-white pt-4 sm:pt-5 pl-3 sm:pl-[16.5px] pr-3 sm:pr-4 flex flex-col min-h-0">

        <div className="flex gap-1.5 sm:gap-2 h-9 sm:h-8 w-fit mb-4 sm:mb-5 bg-[#F3F4F6] rounded-2xl p-1 shrink-0">
          {['Requests', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center justify-center px-4 sm:px-5 h-full rounded-xl cursor-pointer transition-all duration-200 shrink-0 ${
                activeTab === tab ? 'bg-white shadow-sm' : 'bg-transparent hover:bg-white/50'
              }`}
            >
              <span className={`text-[13px] sm:text-[14px] font-medium leading-none transition-colors ${
                activeTab === tab ? 'text-[#0E1629]' : 'text-[#6B7280]'
              }`}>
                {tab}
              </span>
            </button>
          ))}
        </div>

        <div key={activeTab} className="tab-transition flex flex-col w-full sm:flex-1 sm:overflow-y-auto sm:min-h-0 calls-scroll sm:pr-2">
          {currentData.length > 0 ? (
            currentData.map((call) => (
              <div
                key={call.id}
                className="flex items-center w-full gap-3 min-h-[60px] sm:min-h-[64px] mb-2 sm:mb-0 sm:py-3.5 border-b border-[#F3F4F6] last:border-0"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#EEF1FE] border border-[#C7CEFC] flex items-center justify-center shrink-0">
                  <span className="text-[13px] sm:text-[15px] font-semibold text-[#2F43F2] leading-none">
                    {call.initials}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] sm:text-[15px] font-semibold text-[#0E1629] leading-snug truncate">
                    {call.name}
                  </p>
                  <p className="text-[11px] sm:text-[13px] font-medium text-[#9CA3AF] leading-snug truncate mt-0.5">
                    {call.designation !== 'NA' ? call.designation : ''}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="text-[11px] sm:text-[12px] font-medium text-[#6B7280] leading-none">
                    {call.date}
                  </span>
                  <span className="text-[11px] sm:text-[12px] font-medium text-[#9CA3AF] leading-none mt-0.5">
                    {call.time}
                  </span>
                </div>

                {activeTab === 'Requests' ? (
                  <button
                    onClick={() => onCallRequest(call)}
                    disabled={isCalling}
                    className="ml-2 sm:ml-3 w-[60px] sm:w-[72px] h-8 sm:h-9 rounded-xl bg-[#EEF1FE] border border-[#2F43F2]/30 flex items-center justify-center cursor-pointer hover:bg-[#2F43F2] hover:border-[#2F43F2] group transition-all duration-200 shrink-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="text-[12px] sm:text-[13px] font-semibold text-[#2F43F2] group-hover:text-white leading-none transition-colors">
                      {isCalling ? '...' : 'Call'}
                    </span>
                  </button>
                ) : (
                  <div className="ml-2 sm:ml-3 flex flex-col items-end shrink-0 min-w-[64px]">
                    <span className="text-[10px] sm:text-[11px] font-medium text-[#9CA3AF] leading-none">
                      Duration
                    </span>
                    <span className="text-[12px] sm:text-[13px] font-semibold text-[#0E1629] leading-none mt-1">
                      {call.duration && call.duration !== 'NA' ? call.duration : '—'}
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="w-full flex-1 flex flex-col items-center justify-center gap-2 py-16 sm:py-0 sm:h-full">
              <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <p className="text-[14px] font-medium text-[#9CA3AF]">No {activeTab.toLowerCase()} calls</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProBuddyCallsTab;
