import type { CounselorFormData } from '@/types/counselor';
import React, { useState, useRef, useEffect } from 'react';
import MultiSelectDropdown from './MultiSelectDropdown';

interface ProfileDetailsStepProps {
  formData: CounselorFormData;
  setFormData: React.Dispatch<React.SetStateAction<CounselorFormData>>;
  onNext: () => void;
  onVerifyEmail: () => void;
}

// Time Picker Component
const TimePicker = ({ 
  value, 
  onChange, 
  placeholder
}: { 
  value: string; 
  onChange: (value: string) => void; 
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const timeOptions = [];
  for (let hour = 6; hour <= 24; hour++) {
    const displayHour = hour === 24 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? 'AM' : hour === 24 ? 'AM' : 'PM';
    const hourStr = hour === 24 ? '00' : hour.toString().padStart(2, '0');
    timeOptions.push({
      value: `${hourStr}:00`,
      label: `${displayHour.toString().padStart(2, '0')}:00 ${period}`
    });
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedTime = timeOptions.find(t => t.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-full px-4 border border-[#13097D66] rounded-xl bg-white text-left flex items-center justify-between focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors hover:border-gray-400 hover:cursor-pointer"
      >
        <span className={selectedTime ? 'text-[#232323] font-medium' : 'text-[#6C696980] font-medium'}>
          {selectedTime ? selectedTime.label : placeholder}
        </span>
        <svg 
          className={`h-5 w-5 text-gray-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto scrollbar-hide min-w-full">
          {timeOptions.map((time) => (
            <button
              key={time.value}
              type="button"
              onClick={() => {
                onChange(time.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors cursor-pointer ${
                value === time.value ? 'bg-orange-100 text-[#FA660F] font-semibold' : 'text-gray-700'
              }`}
            >
              {time.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const languageOptions = [
  { label: 'English', value: 'English' },
  { label: 'Hindi', value: 'Hindi' },
  { label: 'Marathi', value: 'Marathi' },
  { label: 'Telugu', value: 'Telugu' },
];

const FormField = ({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className="flex flex-col gap-2">
        <label className="font-montserrat font-normal text-sm md:text-base text-[#232323]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const weekDays = [
  { label: 'Mon', value: 'Monday' },
  { label: 'Tue', value: 'Tuesday' },
  { label: 'Wed', value: 'Wednesday' },
  { label: 'Thu', value: 'Thursday' },
  { label: 'Fri', value: 'Friday' },
  { label: 'Sat', value: 'Saturday' },
  { label: 'Sun', value: 'Sunday' }
];

export default function ProfileDetailsStep({
  formData,
  setFormData,
  onNext,
  onVerifyEmail,
}: ProfileDetailsStepProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMultiSelectChange = (name: 'languagesKnown' | 'workingDays', value: string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleDay = (dayValue: string) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(dayValue)
        ? prev.workingDays.filter(d => d !== dayValue)
        : [...prev.workingDays, dayValue]
    }));
  };

  const handleSelectAllDays = () => {
    if (formData.workingDays.length === weekDays.length) {
      setFormData(prev => ({ ...prev, workingDays: [] }));
    } else {
      setFormData(prev => ({ ...prev, workingDays: weekDays.map(d => d.value) }));
    }
  };
  
  const isTimeEqual = formData.officeStartTime && formData.officeEndTime && formData.officeStartTime === formData.officeEndTime;

  const isFormValid = 
    formData.firstName?.trim() && 
    formData.email?.trim() && 
    formData.emailOtpVerified &&
    formData.organisation?.trim() &&
    formData.city?.trim() &&
    formData.languagesKnown.length > 0 &&
    formData.workingDays.length > 0 &&
    formData.officeStartTime &&
    formData.officeEndTime &&
    !isTimeEqual;

  return (
    <div className="font-montserrat space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 overflow-visible">
            <FormField label="First Name" required>
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="h-12 w-full px-4 border border-[#13097D66] rounded-xl placeholder:text-[#6C696980] placeholder:font-medium focus:outline-none focus:border-orange-500 focus:ring-0"/>
            </FormField>
            
            <FormField label="Last Name">
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="h-12 w-full px-4 border border-[#13097D66] rounded-xl placeholder:text-[#6C696980] placeholder:font-medium focus:outline-none focus:border-orange-500 focus:ring-0"/>
            </FormField>
                        
            <FormField label="Email" required>
                <div className="relative h-12">
                    <input type="email" name="email" placeholder="Enter your Email id" value={formData.email} onChange={handleChange} required className="h-full w-full px-4 border border-[#13097D66] rounded-xl placeholder:text-[#6C696980] placeholder:font-medium focus:outline-none focus:border-orange-500 focus:ring-0"/>
                    <button onClick={onVerifyEmail} disabled={formData.emailOtpVerified || !formData.email} className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold ${formData.emailOtpVerified ? 'text-green-600 cursor-default' : 'text-blue-600 hover:text-blue-800 disabled:opacity-50 hover:cursor-pointer'}`}>
                        {formData.emailOtpVerified ? 'Verified' : 'Verify'}
                    </button>
                </div>
            </FormField>
            
            <FormField label="Organisation" required>
                <input type="text" name="organisation" placeholder="Organisation" value={formData.organisation} onChange={handleChange} required className="h-12 w-full px-4 border border-[#13097D66] rounded-xl placeholder:text-[#6C696980] placeholder:font-medium focus:outline-none focus:border-orange-500 focus:ring-0"/>
            </FormField>

            <FormField label="Languages Known" required>
                <MultiSelectDropdown
                  placeholder="Select Languages"
                  options={languageOptions}
                  selected={formData.languagesKnown}
                  onChange={(selection) => handleMultiSelectChange('languagesKnown', selection)}
                />
            </FormField>
            
            <FormField label="City" required>
                <input 
                  type="text" 
                  name="city"
                  placeholder="City" 
                  value={formData.city}
                  onChange={handleChange} 
                  required
                  className="h-12 w-full px-4 border border-[#13097D66] rounded-xl placeholder:text-[#6C696980] placeholder:font-medium focus:outline-none focus:border-orange-500 focus:ring-0"
                />
            </FormField>
            
            <FormField label="Office Start Time" required>
                <TimePicker
                  value={formData.officeStartTime}
                  onChange={(value) => setFormData(prev => ({ ...prev, officeStartTime: value }))}
                  placeholder="Start Time"
                />
            </FormField>
            
            <FormField label="Office End Time" required>
                <TimePicker
                  value={formData.officeEndTime}
                  onChange={(value) => setFormData(prev => ({ ...prev, officeEndTime: value }))}
                  placeholder="End Time"
                />
            </FormField>
        </div>

        {isTimeEqual && (
            <p className="text-red-500 text-sm mt-0">
                Start time and End time cannot be the same.
            </p>
        )}

        <div className="mt-4 md:mt-6">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <label className="font-montserrat font-normal text-sm md:text-base text-[#232323]">Working Days <span className="text-red-500">*</span></label>
            <button
              type="button"
              onClick={handleSelectAllDays}
              className="text-xs font-semibold text-[#FA660F] hover:text-orange-700 px-2 py-1 rounded-md border border-[#FA660F] hover:bg-orange-50 transition-colors hover:cursor-pointer"
            >
              {formData.workingDays.length === weekDays.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {weekDays.map(day => {
              const isSelected = formData.workingDays.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FA660F] text-white border border-[#FA660F]'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-[#FA660F] hover:bg-orange-50'
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 md:pt-6 flex justify-center">
            <button
                onClick={onNext}
                disabled={!isFormValid}
              className="w-full md:w-[444px] h-11 text-white rounded-xl font-semibold text-base transition-colors disabled:bg-[#ACACAC] bg-[#FA660F] hover:bg-orange-700 hover:cursor-pointer"
            >
                Next
            </button>
        </div>
    </div>
  );
}