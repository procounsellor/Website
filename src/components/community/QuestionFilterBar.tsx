import { Search, SlidersHorizontal  } from 'lucide-react';


export default function QuestionFilterBar() {
  return (
    <div className="w-full max-w-[900px] mt-10 bg-white rounded-lg p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-4">
          <Search size={24} className="text-[#13097D]" />
          
          <input
            type="text"
            placeholder="Search questions"
            className="w-full h-[46px] bg-[#F5F5F7] rounded-md px-3 py-3
                       text-sm text-[#13097D] font-medium
                       placeholder:text-[#2F43F2] placeholder:opacity-70 placeholder:font-normal
                       focus:outline-none focus:ring-2 focus:ring-[#13097D]"
          />
        </div>

        <button
          className="w-[90px] h-10 flex items-center justify-center gap-2
                     bg-white border border-[#EFEFEF] rounded-xl
                     text-sm font-semibold text-gray-700
                     hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <SlidersHorizontal size={16} />
          <span>Filter</span>
        </button>

      </div>
    </div>
  );
}