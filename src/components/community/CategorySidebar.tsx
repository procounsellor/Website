import React from 'react';
import { 
  GraduationCap, 
  Palette, 
  Stethoscope, 
  FileText, 
} from 'lucide-react';

interface CategorySidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const categories = [
  { 
    id: 1, 
    label: 'Colleges', 
    icon: GraduationCap, 
    colorClass: 'text-blue-600', 
    bgClass: 'bg-blue-100' 
  },
  { 
    id: 2, 
    label: 'Courses', 
    icon: Palette, 
    colorClass: 'text-teal-600', 
    bgClass: 'bg-teal-100' 
  },
  { 
    id: 3, 
    label: 'Exams', 
    icon: Stethoscope, 
    colorClass: 'text-red-600', 
    bgClass: 'bg-red-100' 
  },
  { 
    id: 4, 
    label: 'Other',
    icon: FileText, 
    colorClass: 'text-purple-600', 
    bgClass: 'bg-purple-100' 
  },
];

const CategorySidebar: React.FC<CategorySidebarProps> = ({ selectedCategory, onSelectCategory }) => {
  
  const handleCategoryClick = (label: string) => {
    if (selectedCategory === label) {
      onSelectCategory(null);
    } else {
      onSelectCategory(label);
    }
  };

  return (
    <div className="w-[191px] bg-white mt-15 rounded-lg shadow-sm border border-gray-100 sticky top-24">
      <div className="pt-2.5 pb-2.5 px-3 flex flex-col gap-5">
        
        {categories.map((category) => {
          const isSelected = selectedCategory === category.label;
          
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.label)}
              className={`group w-[167px] h-7 flex items-center cursor-pointer gap-2.5 rounded-[56px] p-1 transition-all text-left border
                ${isSelected 
                  ? 'bg-gray-100 border-gray-300' 
                  : 'border-transparent hover:bg-gray-50'
                }
              `}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${category.bgClass}`}>
                <category.icon size={12} className={category.colorClass} />
              </div>
              
              <span className={`text-sm font-medium truncate ${isSelected ? 'text-gray-900 font-bold' : 'text-gray-700 group-hover:text-gray-900'}`}>
                {category.label}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
};

export default CategorySidebar;