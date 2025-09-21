/* eslint-disable @typescript-eslint/no-explicit-any */
import { Clock, Users, Award, Calendar } from 'lucide-react';
import React from 'react';

const StatItem = ({ icon, label, value, bgColorClass }: { icon: React.ReactNode, label: string, value: string, bgColorClass: string }) => (
  <div className="flex flex-col items-center text-center">
    <div className={`flex items-center justify-center w-12 h-12 rounded-lg mb-2 ${bgColorClass}`}>
      {icon}
    </div>
    <span className="font-medium text-[#232323] text-xs lg:text-[16px]">{value}</span>
    <span className="font-semibold text-[#232323] text-xs lg:text-[16px]">{label}</span>
  </div>
);

export function ExamStatsCard({ examData }: { examData: any }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex justify-around items-start">
        <StatItem 
          icon={<Clock className="w-5 lg:w-10 h-5 lg:h-10 text-[#165DFB]" />} 
          label={examData.duration || '3 Years'} 
          value="Duration" 
          bgColorClass="bg-[#EFF6FF]" 
        />
        <StatItem 
          icon={<Users className="w-5 lg:w-10 h-5 lg:h-10 text-[#00A63E]" />} 
          label={examData.level || 'National'} 
          value="Level" 
          bgColorClass="bg-[#EFFDF4]"
        />
        <StatItem 
          icon={<Award className="w-5 lg:w-10 h-5 lg:h-10 text-[#FAA629]" />} 
          label={examData.maxMarks || '300'} 
          value="Max Marks" 
          bgColorClass="bg-[#FFE9C9]"
        />
        <StatItem 
          icon={<Calendar className="w-5 lg:w-10 h-5 lg:h-10 text-[#E9605A]" />} 
          label={examData.frequency || 'Twice a Year'} 
          value="Frequency" 
          bgColorClass="bg-[#F7C9C7]"
        />
      </div>
    </div>
  );
}