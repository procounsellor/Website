import React from 'react';
import ProBuddySidebar from '@/components/Revamp/ProbuddiesDashboard/ProBuddySidebar';
import ProBuddyMainContent from '@/components/Revamp/ProbuddiesDashboard/ProBuddyMainContent';

const ProBuddiesDashboard: React.FC = () => {
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