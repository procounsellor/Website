import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface TimeframePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  mode: 'monthly' | 'yearly';
}

export default function TimeframePicker({ value, onChange, mode }: TimeframePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'months' | 'years'>(mode === 'yearly' ? 'years' : 'months');
  const [pickerYear, setPickerYear] = useState(value.getFullYear());
  
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  
  const startYear = Math.floor((pickerYear - 1) / 12) * 12 + 1;
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const handleMonthSelect = (monthIndex: number) => {
    onChange(new Date(pickerYear, monthIndex, 1));
    setIsOpen(false);
  };
  
  const handleYearSelect = (year: number) => {
    if (mode === 'yearly') {
      onChange(new Date(year, 0, 1));
      setIsOpen(false);
    } else {
      setPickerYear(year);
      setView('months');
    }
  };

  const formattedValue = mode === 'yearly'
    ? value.getFullYear()
    : value.toLocaleString('default', { month: 'short' }) + "'" + value.getFullYear().toString().slice(-2);

  return (
    <div className="relative" ref={wrapperRef}>
      <button 
        onClick={() => {
            setIsOpen(!isOpen);
            setView(mode === 'yearly' ? 'years' : 'months');
            setPickerYear(value.getFullYear());
        }}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-md p-1 px-3"
      >
        <span className="text-sm font-medium">{formattedValue}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-4">
          {view === 'months' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => setPickerYear(p => p - 1)} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={18} /></button>
                <button onClick={() => setView('years')} className="font-semibold text-[#13097D] hover:bg-gray-100 px-2 py-1 rounded-md">{pickerYear}</button>
                <button onClick={() => setPickerYear(p => p + 1)} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight size={18} /></button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {months.map((month, index) => (
                  <button 
                    key={month}
                    onClick={() => handleMonthSelect(index)}
                    className={`p-2 text-sm rounded-md text-center ${value.getFullYear() === pickerYear && value.getMonth() === index ? 'bg-[#13097D] text-white' : 'hover:bg-gray-100'}`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          )}
          {view === 'years' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => setPickerYear(p => p - 12)} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={18} /></button>
                <span className="font-semibold text-[#13097D]">{`${startYear} - ${startYear + 11}`}</span>
                <button onClick={() => setPickerYear(p => p + 12)} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight size={18} /></button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {years.map(year => (
                  <button 
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`p-2 text-sm rounded-md ${value.getFullYear() === year ? 'bg-[#13097D] text-white' : 'hover:bg-gray-100'}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}