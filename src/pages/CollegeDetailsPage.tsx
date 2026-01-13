import { useState } from 'react';
import CollegeBannerCard from '@/components/college/CollegeBannerCard';
import CollegeTabs from '@/components/college/CollegeTabs';
import AdmissionCard from '@/components/college/AdmissionCard';
import InfoTab from '@/components/college/tabs/InfoTab';
import CoursesTab from '@/components/college/tabs/CoursesTab';
import CounsellorsTab from '@/components/college/tabs/CounsellorsTab';
import InfrastructureTab from '@/components/college/tabs/InfrastructureTab';
import ScholarshipsTab from '@/components/college/tabs/ScholarshipsTab';
import EventsTab from '@/components/college/tabs/EventsTab';
import AluminiTab from '@/components/college/tabs/AluminiTab';
import ExamsTab from '@/components/college/tabs/ExamsTab';
import ImportantDatesTab from '@/components/college/tabs/ImportantDatesTab';

const CollegeDetailsPageNew = () => {
  const [activeTab, setActiveTab] = useState("Info");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Info":
        return <InfoTab />;
      case "Courses":
        return <CoursesTab />;
      case "Counsellors":
        return <CounsellorsTab />;
      case "Infrastructure":
        return <InfrastructureTab />;
      case "Scholarships":
        return <ScholarshipsTab />;
      case "Events":
        return <EventsTab />
      case "Alumini":
        return <AluminiTab />
      case "Exams":
        return <ExamsTab />
      case "Important Dates":
        return <ImportantDatesTab />;
      default:
        return (
          <div className="p-4 min-h-[300px] rounded-lg flex items-center justify-center text-gray-400">
            Content for {activeTab} coming soon...
          </div>
        );
    }
}

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-20">
      <div className="max-w-7xl mx-auto mt-14 md:mt-14 px-4 md:px-8 pt-4 md:pt-10">
        <div className="mb-6 md:mb-8">
          <h1 
            className="text-[#242645] font-semibold text-[20px] md:text-[24px] leading-[125%]"
            style={{ fontFamily: 'Montserrat' }}
          >
            IIT Delhi
          </h1>
          <p 
            className="text-[#8C8CA1] font-medium mt-1 md:mt-2 text-[14px] md:text-[18px] leading-[135%] md:leading-[125%]"
            style={{ fontFamily: 'Montserrat' }}
          >
            Discover their expertise and find the right guidance for your future
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          <div className="flex-1 w-full lg:w-[70%]">
            <CollegeBannerCard name="IIT Delhi" location="New Delhi, Delhi" />

            <div className="mt-6 md:mt-8">
               <CollegeTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="mt-4 md:mt-6">
               {renderTabContent()}
            </div>
          </div>

          <div className="w-full lg:w-[30%] max-w-[400px] shrink-0 sticky top-24">
             <AdmissionCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetailsPageNew;