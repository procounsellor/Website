import React from 'react';
import { 
  GraduationCap, 
  Palette, 
  Stethoscope, 
  FileText, 
  Building2 
} from 'lucide-react';

const categories = [
  { 
    id: 1, 
    label: 'Engineering', 
    icon: GraduationCap, 
    colorClass: 'text-blue-600', 
    bgClass: 'bg-blue-100' 
  },
  { 
    id: 2, 
    label: 'Design', 
    icon: Palette, 
    colorClass: 'text-teal-600', 
    bgClass: 'bg-teal-100' 
  },
  { 
    id: 3, 
    label: 'Medical', 
    icon: Stethoscope, 
    colorClass: 'text-red-600', 
    bgClass: 'bg-red-100' 
  },
  { 
    id: 4, 
    label: 'Exams', 
    icon: FileText, 
    colorClass: 'text-purple-600', 
    bgClass: 'bg-purple-100' 
  },
  { 
    id: 5, 
    label: 'Colleges', 
    icon: Building2, 
    colorClass: 'text-orange-600', 
    bgClass: 'bg-orange-100' 
  },
];

const CategorySidebar: React.FC = () => {
  return (
    <div className="w-[191px] bg-white mt-15 rounded-lg shadow-sm border border-gray-100 sticky top-24">
      <div className="pt-2.5 pb-2.5 px-3 flex flex-col gap-5">
        
        {categories.map((category) => (
          <button
            key={category.id}
            className="group w-[167px] h-7 flex items-center cursor-pointer gap-2.5 rounded-[56px] p-1 transition-all hover:bg-gray-50 text-left"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${category.bgClass}`}>
              <category.icon size={12} className={category.colorClass} />
            </div>
            
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">
              {category.label}
            </span>
          </button>
        ))}

      </div>
    </div>
  );
};

export default CategorySidebar;