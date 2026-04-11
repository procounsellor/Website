import React from 'react';

const ProBuddyOverviewTab: React.FC = () => {
  return (
    <div className="pt-[24px] pl-[24px] font-poppins">
      
      <h2 className="w-[118px] h-[24px] text-[16px] font-medium text-[#0E1629] leading-none mb-[16px]">
        About Yourself
      </h2>

      <div className="w-[880px] h-[144px] rounded-[12px] border border-[#EFEFEF] bg-white shadow-[0px_1px_4px_0px_rgba(14,22,41,0.2)] relative mb-[24px]">
        
        {/*<GraduationCap className="absolute top-[18px] left-[16px] w-[28px] h-[28px] text-[#0E1629] fill-current" /> */}
        <img 
          src='/graduationCap.svg'
          alt='graduation-cap'
          className='absolute top-[18px] left-[16px] w-[28px] h-[28px]'
        />
        
        <h3 className="absolute top-[18px] left-[52px] w-[269px] h-[30px] text-[20px] font-semibold text-[#0E1629]">
          Career Transition Strategy
        </h3>
        
        <p className="absolute top-[56px] left-[16px] w-[848px] h-[72px] text-[16px] font-medium text-[#6B7280] leading-[24px]">
          I've helped 850+ aspiring students navigate their college journey at IIT Delhi. Passionate about making the admission process less stressful and sharing real college insights that matter. Currently in 3rd year, been through it all - exams, placements, hostel life, branch selection.
        </p>
      </div>

      <div className="w-[880px] h-[125px] rounded-[12px] border border-[#EFEFEF] bg-white shadow-[0px_1px_4px_0px_rgba(14,22,41,0.2)] relative">
        
        <h3 className="absolute top-[20px] left-[16px] w-[320px] h-[30px] text-[20px] font-semibold text-[#0E1629] leading-none">
          Who Should Connect With You?
        </h3>
        
        <p className="absolute top-[57px] left-[16px] w-[848px] h-[48px] text-[16px] font-medium text-[#6B7280] leading-[24px]">
          Connect with me if you want real, unfiltered advice about IIT admission, competitive exam preparation, and actual college life (not just the Instagram version!)
        </p>
      </div>

    </div>
  );
};

export default ProBuddyOverviewTab;