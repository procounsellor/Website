import React, { useState } from 'react';

interface CallData {
  id: string;
  initials: string;
  name: string;
  designation: string;
  dateTime: string;
}

const mockCalls: CallData[] = Array(5).fill(null).map((_, index) => ({
  id: `call-${index}`,
  initials: 'SG',
  name: 'Subhash Ghai',
  designation: 'Student',
  dateTime: '14 Jul, 10:30 AM',
}));

const ProBuddyCallsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Requests');

  return (
    <div className="pt-[24px] pl-[24px] font-poppins">
      
      <div className="w-[880px] h-[478px] rounded-[16px] border border-[#EFEFEF] bg-white pt-[20px] pl-[16.5px] pr-[10.5px] flex flex-col">
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

        <div className="flex flex-col w-[853px]">
          {mockCalls.map((call) => (
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

              <div className="gap-[4px] flex flex-col shrink-0">
                <span className="text-[20px] font-medium text-[#0E1629] leading-[150%]">
                  Date & Time
                </span>
                <span className="text-[16px] font-medium text-[#6B7280] leading-[150%]">
                  {call.dateTime}
                </span>
              </div>

              <button className="w-[80px] h-[34px] rounded-[8px] border border-[#2F43F2] flex items-center justify-center cursor-pointer ml-auto hover:bg-[#2F43F21A] transition-colors">
                <span className="text-[12px] font-medium text-[#2F43F2] leading-none">
                  Call
                </span>
              </button>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProBuddyCallsTab;