import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
}

export default function DashboardMultiSelect({
  options,
  selected,
  onChange,
  placeholder,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    const newSelection = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelection);
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CustomCheckbox = ({ isSelected }: { isSelected: boolean }) => (
    <div className={`w-5 h-5 flex justify-center items-center rounded border-2 ${isSelected ? 'bg-white border-white' : 'border-[#23232380]'}`}>
        {isSelected && <Check className="w-4 h-4 text-[#13097D]" />}
    </div>
  );
  
  const maxVisibleItems = 3;

  return (
    <div className="relative font-montserrat" ref={dropdownRef}>
        <button
            type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full min-h-[48px] md:min-h-[40px] h-auto px-4 py-2 rounded-xl text-left bg-white flex items-center justify-between hover:cursor-pointer"
        >
            <div 
              className="flex flex-wrap items-center gap-1"
            >
                {selected.length === 0 ? (
                    <span className="text-[#6C696980]">{placeholder}</span>
                ) : (
                    <>
                        {selected.slice(0, maxVisibleItems).map(value => {
                            const label = options.find(opt => opt.value === value)?.label || value;
                            return (
                                <span key={value} className="bg-gray-200 text-gray-800 text-sm font-medium px-2 py-1 rounded-md flex items-center gap-1.5 flex-shrink-0">
                                    {label}
                                    <X 
                                        className="h-3.5 w-3.5 cursor-pointer hover:text-red-500" 
                                        onMouseDown={(e) => { e.stopPropagation(); handleRemove(value); }}
                                    />
                                </span>
                            );
                        })}
                        {selected.length > maxVisibleItems && (
                            <span className="bg-gray-200 text-gray-800 text-sm font-medium px-2 py-1 rounded-md flex-shrink-0">
                                +{selected.length - maxVisibleItems} more
                            </span>
                        )}
                    </>
                )}
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-[#F5F5F5] border border-gray-200 rounded-xl shadow-lg p-2 overflow-hidden">
                <div className="relative mb-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#343C6A]" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full h-10 pl-12 pr-4 py-1.5 border border-[#EFEFEF] rounded-lg bg-white placeholder:text-[#232323] placeholder:font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <ul className="max-h-40 overflow-y-auto space-y-1 pr-6 -mr-6">
                    {filteredOptions.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`p-2 h-[34px] rounded-lg cursor-pointer flex items-center gap-3 font-semibold text-sm ${selected.includes(option.value) ? 'bg-[#13097D] text-white' : 'hover:bg-gray-200 text-[#232323]'}`}
                        >
                            <CustomCheckbox isSelected={selected.includes(option.value)} />
                            {option.label}
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
}