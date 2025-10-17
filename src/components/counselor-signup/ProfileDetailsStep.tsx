import type { CounselorFormData } from '@/types/counselor';
import React from 'react';
import MultiSelectDropdown from './MultiSelectDropdown';

interface ProfileDetailsStepProps {
  formData: CounselorFormData;
  setFormData: React.Dispatch<React.SetStateAction<CounselorFormData>>;
  onNext: () => void;
  onVerifyPhone: () => void;
  onVerifyEmail: () => void;
}

const languageOptions = [
  { label: 'English', value: 'English' },
  { label: 'Hindi', value: 'Hindi' },
  { label: 'Marathi', value: 'Marathi' },
  { label: 'Telugu', value: 'Telugu' },
];

const workingDaysOptions = [
  { label: 'Monday', value: 'Monday' }, { label: 'Tuesday', value: 'Tuesday' },
  { label: 'Wednesday', value: 'Wednesday' }, { label: 'Thursday', value: 'Thursday' },
  { label: 'Friday', value: 'Friday' }, { label: 'Saturday', value: 'Saturday' },
  { label: 'Sunday', value: 'Sunday' },
];

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-2">
        <label className="font-montserrat font-normal text-base text-[#232323]">{label}</label>
        {children}
    </div>
);

export default function ProfileDetailsStep({
  formData,
  setFormData,
  onNext,
  onVerifyEmail,
  onVerifyPhone
}: ProfileDetailsStepProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMultiSelectChange = (name: 'languagesKnown' | 'workingDays', value: string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const isFormValid = formData.firstName && formData.lastName && formData.phoneNumber.length === 10 && formData.email && formData.password && formData.phoneOtpVerified && formData.emailOtpVerified;

  return (
    <div className="font-montserrat space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField label="First Name">
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="h-12 w-full px-4 border border-[#13097D66] rounded-xl placeholder:text-[#6C696980] placeholder:font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"/>
            </FormField>
            <FormField label="Last Name">
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="h-12 w-full px-4 border border-[#13097D66] rounded-xl placeholder:text-[#6C696980] placeholder:font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"/>
            </FormField>
            <FormField label="Mobile Number*">
                 <div className="relative h-12">
                    <div className="flex items-center h-full border border-[#13097D66] rounded-xl focus-within:ring-1 focus-within:ring-orange-500">
                        <div className="flex items-center pl-4 pointer-events-none">
                            <img src="/india.png" alt="India Flag" className="h-5 w-5" />
                            <span className="ml-2 text-gray-800 font-medium">+91</span>
                        </div>
                        <div className="h-6 w-px bg-gray-300 mx-3"></div>
                        <input type="tel" name="phoneNumber" placeholder="Enter your phone number" value={formData.phoneNumber} onChange={handleChange} maxLength={10} required className="flex-1 h-full border-none focus:ring-0 focus:outline-none placeholder:text-[#6C696980] placeholder:font-medium"/>
                    </div>
                    <button onClick={onVerifyPhone} disabled={formData.phoneOtpVerified || formData.phoneNumber.length !== 10} className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold ${formData.phoneOtpVerified ? 'text-green-600 cursor-default' : 'text-blue-600 hover:text-blue-800 disabled:opacity-50'}`}>
                        {formData.phoneOtpVerified ? 'Verified' : 'Verify'}
                    </button>
                </div>
            </FormField>
            <FormField label="Email">
                <div className="relative h-12">
                    <input type="email" name="email" placeholder="Enter your Email id" value={formData.email} onChange={handleChange} required className="h-full w-full px-4 border border-[#13097D66] rounded-xl placeholder:text-[#6C696980] placeholder:font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"/>
                    <button onClick={onVerifyEmail} disabled={formData.emailOtpVerified || !formData.email} className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold ${formData.emailOtpVerified ? 'text-green-600 cursor-default' : 'text-blue-600 hover:text-blue-800 disabled:opacity-50'}`}>
                        {formData.emailOtpVerified ? 'Verified' : 'Verify'}
                    </button>
                </div>
            </FormField>
            <FormField label="Password">
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="h-12 w-full px-4 border border-[#13097D66] rounded-xl placeholder:text-[#6C696980] placeholder:font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"/>
            </FormField>
            <FormField label="Organisation">
                <input type="text" name="organisation" placeholder="Organisation" value={formData.organisation} onChange={handleChange} className="h-12 w-full px-4 border border-[#13097D66] rounded-xl placeholder:text-[#6C696980] placeholder:font-medium focus:outline-none focus:ring-1 focus:ring-orange-500"/>
            </FormField>
            <FormField label="Languages Known">
                <MultiSelectDropdown
                  placeholder="Select Languages"
                  options={languageOptions}
                  selected={formData.languagesKnown}
                  onChange={(selection) => handleMultiSelectChange('languagesKnown', selection)}
                />
            </FormField>
            <FormField label="Working Days">
                <MultiSelectDropdown
                  placeholder="Select Working Days"
                  options={workingDaysOptions}
                  selected={formData.workingDays}
                  onChange={(selection) => handleMultiSelectChange('workingDays', selection)}
                />
            </FormField>
            <FormField label="Office Start Time">
                <select name="officeStartTime" value={formData.officeStartTime} onChange={handleChange} className="h-12 w-full px-4 border border-[#13097D66] rounded-xl appearance-none bg-white text-[#6C696980] font-medium focus:outline-none focus:ring-1 focus:ring-orange-500">
                    <option value="" disabled>Start Time</option>
                    <option className="text-black" value="09:00">09:00 AM</option>
                    <option className="text-black" value="10:00">10:00 AM</option>
                    <option className="text-black" value="11:00">11:00 AM</option>
                </select>
            </FormField>
            <FormField label="Office End Time">
                <select name="officeEndTime" value={formData.officeEndTime} onChange={handleChange} className="h-12 w-full px-4 border border-[#13097D66] rounded-xl appearance-none bg-white text-[#6C696980] font-medium focus:outline-none focus:ring-1 focus:ring-orange-500">
                    <option value="" disabled>End Time</option>
                    <option className="text-black" value="17:00">05:00 PM</option>
                    <option className="text-black" value="18:00">06:00 PM</option>
                    <option className="text-black" value="19:00">07:00 PM</option>
                </select>
            </FormField>
        </div>

        <div className="pt-4 text-center">
            <button
                onClick={onNext}
                disabled={!isFormValid}
                className="w-[444px] h-11 text-white rounded-xl font-semibold text-base transition-colors disabled:bg-[#ACACAC] bg-[#FA660F] hover:bg-orange-700"
            >
                Next
            </button>
        </div>
    </div>
  );
}