import React, { useState } from 'react';

const ProBuddyEarningsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Payouts');
  const [slabTab, setSlabTab] = useState('Yearly');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const EarningBlock = ({ title, amount, type }: { title: string, amount: string, type: 'earnings' | 'payout' }) => {
    const isEarnings = type === 'earnings';
    
    return (
      <div 
        className={`w-[190px] h-[74px] rounded-[16px] border flex flex-col justify-center px-[16px] relative ${
          isEarnings ? 'border-[#C9F7DD]' : 'border-[#FFE3D1]'
        }`}
      >
        <span className="text-[14px] font-medium text-[#0E1629] leading-none mb-[8px]">
          {title}
        </span>
        <div className="flex items-center gap-2">
          
          {isEarnings ? (
            <img 
              src="/Procoin.jpg" 
              alt="Procoin" 
              className="w-[24px] h-[24px] rounded-full object-cover" 
            />
          ) : (
            <span className="text-[20px] leading-none text-[#F97116]">₹</span>
          )}

          <span className={`text-[20px] font-semibold leading-none ${
            isEarnings ? 'text-[#14A249]' : 'text-[#F97116]'
          }`}>
            {amount}
          </span>
        </div>
      </div>
    );
  };

  const EarningsSection = ({ heading }: { heading: string }) => (
    <div className="flex flex-col mb-[24px] last:mb-0">
      <h3 className="text-[20px] font-semibold text-[#0E1629] leading-none mb-[11px]">
        {heading}
      </h3>
      <div className="flex w-[404px] gap-[24px]">
        <EarningBlock title="Earnings" amount="230500" type="earnings" />
        <EarningBlock title="Payout" amount="154250" type="payout" />
      </div>
    </div>
  );

  const MAX_CHART_VALUE = 1500;

  const mockChartData = [
    { label: 'Jan', value: 850 }, 
    { label: 'Feb', value: 1490 },
    { label: 'Mar', value: 1250 }, 
    { label: 'Apr', value: 800 },
    { label: 'May', value: 650 }, 
    { label: 'Jun', value: 920 },
    { label: 'Jul', value: 780 }, 
    { label: 'Aug', value: 920 },
    { label: 'Sep', value: 1216 }, 
    { label: 'Oct', value: 1000 },
    { label: 'Nov', value: 1250 }, 
    { label: 'Dec', value: 1250 },
  ];

  return (
    <div className="pt-[24px] pl-[24px] font-poppins h-full">
      
      <div className="flex gap-[12px] h-[30px] w-[235px] mb-[36px]">
        <button
          onClick={() => setActiveTab('Payouts')}
          className={`flex items-center justify-center px-[16px] h-full rounded-[24px] cursor-pointer transition-colors ${
            activeTab === 'Payouts' ? 'bg-[#E8E7F2]' : 'bg-transparent'
          }`}
        >
          <span className={`text-[16px] font-medium leading-none ${
            activeTab === 'Payouts' ? 'text-[#0E1629]' : 'text-[#6B7280]'
          }`}>
            Payouts
          </span>
        </button>

        <button
          onClick={() => setActiveTab('Call Revenue')}
          className={`flex items-center justify-center px-[16px] h-full rounded-[24px] cursor-pointer transition-colors text-nowrap ${
            activeTab === 'Call Revenue' ? 'bg-[#E8E7F2]' : 'bg-transparent'
          }`}
        >
          <span className={`text-[16px] font-medium leading-none ${
            activeTab === 'Call Revenue' ? 'text-[#0E1629]' : 'text-[#6B7280]'
          }`}>
            Call Revenue
          </span>
        </button>
      </div>

      <div className="flex gap-[40px]">
        
        <div className="w-[404px] flex flex-col">
          <EarningsSection heading="Current Cycle Earnings" />
          <hr className="w-[404px] border-[#E4E4E4] mb-[24px]" />
          <EarningsSection heading="This Year Earnings" />
          <hr className="w-[404px] border-[#E4E4E4] mb-[24px]" />
          <EarningsSection heading="Lifetime Earnings" />
        </div>

        <div className="flex flex-col">
           <h3 className="text-[20px] font-semibold text-[#0E1629] leading-none mb-[16px]">
             Earnings Trend
           </h3>
           
           <div className="w-[444px] h-[380px] rounded-[16px] border border-[#EFEFEF] bg-white relative">
             
             <h4 className="absolute top-[18px] left-[18px] w-[103px] h-[24px] text-[18px] font-semibold text-[#0E1629] leading-none text-nowrap">
               Current Slab
             </h4>

             <div className="absolute top-[56px] left-[18px] w-[412px] h-[52px] rounded-[12px] border border-[#EFEFEF] bg-[#F9FAFB] flex items-center justify-center gap-[12px]">
                
                <button
                  onClick={() => setSlabTab('Monthly')}
                  className={`w-[180px] h-[41px] flex items-center justify-center cursor-pointer transition-colors ${
                    slabTab === 'Monthly' 
                      ? 'bg-[#2F43F2] rounded-[8px] text-white font-semibold' 
                      : 'bg-transparent rounded-[10px] text-[#0E1629] font-medium'
                  } text-[14px] leading-none`}
                >
                  Monthly
                </button>

                <button
                  onClick={() => setSlabTab('Yearly')}
                  className={`w-[180px] h-[41px] flex items-center justify-center cursor-pointer transition-colors ${
                    slabTab === 'Yearly' 
                      ? 'bg-[#2F43F2] rounded-[8px] text-white font-semibold' 
                      : 'bg-transparent rounded-[10px] text-[#0E1629] font-medium'
                  } text-[14px] leading-none`}
                >
                  Yearly
                </button>
             </div>

             <div className="absolute top-[140px] left-[18px] w-[412px] h-[220px] flex">
                
                <div className="w-[40px] h-[190px] flex flex-col justify-between items-end pr-[8px] text-[12px] text-[#B8B8B8] border-r border-dashed border-[#E5E5E5] relative z-10">
                  <span>1500</span>
                  <span>1000</span>
                  <span>500</span>
                  <span>0</span>
                </div>

                <div className="flex-grow h-[190px] relative flex items-end justify-between pl-[12px] pr-[8px] border-b border-dashed border-[#E5E5E5]">
                  

                  {mockChartData.map((data, index) => (
                    <div 
                      key={index} 
                      className={`flex flex-col items-center justify-end h-full relative group cursor-pointer w-[20px] ${hoveredIndex === index ? 'z-50' : 'z-10'}`}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      
                      {/* Tooltip */}
                      <div 
                        className={`absolute bottom-full mb-[10px] left-1/2 transform -translate-x-1/2 bg-white rounded-[8px] shadow-[0px_4px_16px_rgba(0,0,0,0.12)] px-[12px] py-[8px] flex items-center justify-center gap-[6px] whitespace-nowrap transition-all duration-200 ${
                          hoveredIndex === index ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-1'
                        }`}
                      >
                        <span className="text-[14px] font-bold text-[#0E1629]">
                          {data.label}:
                        </span>
                        <img 
                          src="/Procoin.jpg" 
                          alt="Procoin" 
                          className="w-[16px] h-[16px] rounded-full object-cover" 
                        />
                        <span className="text-[14px] font-medium text-[#EAB308]">
                          {data.value}
                        </span>
                        
                        <div className="absolute -bottom-[5px] left-1/2 transform -translate-x-1/2 w-[10px] h-[10px] bg-white rotate-45 shadow-[4px_4px_10px_rgba(0,0,0,0.06)] rounded-[1px] z-[-1]"></div>
                      </div>

                      <div 
                        className={`w-[20px] bg-[#2F43F2] rounded-t-[4px] relative transition-all duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`} 
                        style={{ height: `${(data.value / MAX_CHART_VALUE) * 100}%` }}
                      />
                      
                      <div className="absolute bottom-[-45px] text-[12px] font-medium text-[#B8B8B8] -ml-[18px] -rotate-90 origin-top transform translate-y-[-50%]">
                        {data.label}
                      </div>
                    </div>
                  ))}

                </div>
             </div>

           </div>
        </div>

      </div>

    </div>
  );
};

export default ProBuddyEarningsTab;