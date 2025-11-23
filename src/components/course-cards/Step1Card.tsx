import { useState, useRef, useEffect } from 'react';

export default function Step1Card(){
    const [category, setCategory] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = [
        { value: 'PYQ', label: 'PYQ COURSE' },
        { value: 'TEST_SERIES', label: 'TEST SERIES' }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return <div className="flex flex-col gap-5 bg-white max-w-234 p-6 rounded-2xl">


        <div className="flex flex-col gap-3 items-start">
            <label htmlFor="name"  className='text-[1rem] font-medium text-[#8C8CA1]'>Name*</label>
            <input type="text" placeholder="Enter your name" className="bg-[#F5F7FA] rounded-[0.75rem] h-12 p-2 w-218" />
        </div>

          <div className="flex flex-col gap-3 items-start">
            <label htmlFor="description"  className='text-[1rem] font-medium text-[#8C8CA1]'>Description*</label>
            <textarea placeholder="Enter deacription here" className="bg-[#F5F7FA] rounded-[0.75rem] h-24 p-2 w-218" />
        </div>


        <div className="flex flex-col gap-3 items-start">
            <label htmlFor="button" className='text-[1rem] font-medium text-[#8C8CA1]'>Add Thumbnail*</label>

            <button className="flex  items-center gap-2 py-2 px-6 border border-[#13097D] text-[#13097D] rounded-[0.75rem] font-semibold text-[1rem]"><img src="/uploadIcon.svg" alt="" /> Upload</button>
        </div>


        <div className="flex gap-5">
             <div className="flex flex-col gap-3 items-start relative" ref={dropdownRef}>
            <label htmlFor="button" className='text-[1rem] font-medium text-[#8C8CA1]'>Category*</label>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#F5F7FA] rounded-[0.75rem] h-12 px-3 py-2 w-[19.438rem] flex items-center justify-between cursor-pointer hover:bg-[#eef0f4] transition-all duration-200"
            >
                <span className={category ? 'text-[#13097D] font-medium' : 'text-[#8C8CA1]'}>
                    {category ? options.find(opt => opt.value === category)?.label : 'Select'}
                </span>
                <svg 
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="#13097D" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
            {isOpen && (
                <div className="absolute top-18 left-0 w-[19.438rem] bg-white rounded-[0.75rem] shadow-lg border border-gray-200 overflow-hidden z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => {
                                setCategory(option.value);
                                setIsOpen(false);
                            }}
                            className="px-4 py-3 cursor-pointer hover:bg-[#13097D] hover:text-white text-[#13097D] font-medium transition-all duration-150"
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>

         <div className="flex flex-col gap-3 items-start">
            <label htmlFor="button" className='text-[1rem] font-medium text-[#8C8CA1]'>Course Duration (Hours)*</label>
            <input type="text" placeholder="Enter your name" className="bg-[#F5F7FA] rounded-[0.75rem] h-12 p-2 w-55" />

            
        </div>

         <div className="flex flex-col gap-3 items-start">
            <label htmlFor="button" className='text-[1rem] font-medium text-[#8C8CA1]'>Course Duration (Minutes)*</label>
            <input type="text" placeholder="Enter your name" className="bg-[#F5F7FA] rounded-[0.75rem] h-12 p-2 w-55" />
        </div>
            
       
        </div>
    </div>
}