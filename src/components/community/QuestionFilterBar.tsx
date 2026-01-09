import { Search } from 'lucide-react';

export default function QuestionFilterBar() {
  return (
    <div className="w-full max-w-[900px] mt-10 bg-white rounded-lg p-4 md:p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between gap-3 md:gap-4">
        <div className="flex-1 flex items-center gap-3 md:gap-4">
          <Search size={24} className="text-[#13097D]" />
          
          <input
            type="text"
            placeholder="Search questions"
            className="w-full h-[42px] md:h-[46px] bg-[#F5F5F7] rounded-md px-3 py-2 md:py-3
                       text-sm text-[#13097D] font-medium
                       placeholder:text-[#2F43F2] placeholder:opacity-70 placeholder:font-normal
                       focus:outline-none focus:ring-2 focus:ring-[#13097D]"
          />
        </div>

      </div>
    </div>
  );
}