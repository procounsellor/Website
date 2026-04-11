import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDown } from 'lucide-react';
import EditableField from './EditableField';
import TimeList from './TimeList';
import type { CounselorProfileData } from '@/types/counselorProfile';

type Option = { label: string; value: string };

interface EditableWorkScheduleProps {
  isEditing: boolean;
  data: Partial<CounselorProfileData>;
  onMultiChange: (name: string, value: string[]) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  daysOptions: Option[];
  startTimeOptions: Option[];
  endTimeOptions: Option[];
  displayValue: string;
}

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="text-xs md:text-sm text-[#232323]">{label}</label>
    <div className="mt-1 md:mt-2 w-full min-h-12 md:min-h-10 flex items-center px-4 py-2 rounded-lg md:rounded-md border border-[#EFEFEF] md:border-gray-200 bg-[#F9FAFB] md:bg-white cursor-not-allowed">
      <p className="font-normal md:font-medium text-sm md:text-base text-[#718EBF]">{value}</p>
    </div>
  </div>
);

export default function EditableWorkSchedule({
  isEditing,
  data,
  onMultiChange,
  onChange,
  daysOptions,
  startTimeOptions,
  endTimeOptions,
  displayValue
}: EditableWorkScheduleProps) {

  if (!isEditing) {
    return <InfoField label="Working days & Time" value={displayValue} />
  }

  const handleTimeChange = (name: 'officeStartTime' | 'officeEndTime', value: string) => {
    const syntheticEvent = {
      target: {
        name,
        value,
      },
    } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
    
    onChange(syntheticEvent);
  };

  const handleDayToggle = (dayValue: string) => {
    const currentDays = data.workingDays || [];
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter(day => day !== dayValue)
      : [...currentDays, dayValue];
      
    onMultiChange('workingDays', newDays);
  };

  const getDisplayDays = () => {
    const days = data.workingDays;
    if (!days || days.length === 0) return "...";
    if (days.length === 7) return "Mon - Sun";
    if (days.length === 5 && !days.includes("Saturday") && !days.includes("Sunday")) return "Mon - Fri";
    return days.map(d => d.slice(0, 3)).join(', ');
  };

  const displayDays = getDisplayDays();
  
  const displayStart = startTimeOptions.find(opt => opt.value === data.officeStartTime)?.label 
    || (data.officeStartTime || '...');
    
  const displayEnd = endTimeOptions.find(opt => opt.value === data.officeEndTime)?.label 
    || (data.officeEndTime || '...');

  const liveDisplayValue = `${displayDays}, ${displayStart} - ${displayEnd}`;

  return (
    <>
      <div className="flex flex-col gap-y-4 md:hidden">
        <EditableField
          label="Working Days"
          name="workingDays"
          as="multiselect"
          isEditing={true}
          value={data.workingDays || []}
          multiSelectOptions={daysOptions}
          onMultiChange={(selected) => onMultiChange('workingDays', selected)}
        />
        <div className="grid grid-cols-2 gap-4">
          <EditableField
            label="Start Time"
            name="officeStartTime"
            isEditing={true}
            value={data.officeStartTime || ''}
            onChange={onChange}
            as="select"
            selectOptions={startTimeOptions}
          />
          <EditableField
            label="End Time"
            name="officeEndTime"
            isEditing={true}
            value={data.officeEndTime || ''}
            onChange={onChange}
            as="select"
            selectOptions={endTimeOptions}
          />
        </div>
      </div>

      <div className="hidden md:block">
        <Popover className="relative">
          {({ open }) => (
            <>
              <label className="text-xs md:text-sm text-[#858585] md:text-[#232323]">Working days & Time</label>
              <Popover.Button
                className={`
                  mt-1 md:mt-2 w-full min-h-12 md:min-h-10 flex items-center justify-between px-4 py-2 rounded-lg md:rounded-md border
                  border-[#EFEFEF] md:border-gray-200 bg-[#F9FAFB] md:bg-white text-left hover:cursor-pointer
                `}
              >
                <span className="font-normal md:font-medium text-sm md:text-base text-gray-800">
                  {liveDisplayValue || "Select schedule..."}
                </span>

                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'transform rotate-180' : ''}`}
                />
              </Popover.Button>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute z-20 w-[480px] mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-3 divide-x divide-gray-100">
                    
                    <div className="flex flex-col h-full">
                      <h4 className="text-sm font-medium text-gray-900 px-4 py-2 border-b border-gray-100">
                        Working Days
                      </h4>
                      <div className="flex-1 overflow-y-auto h-60 md:h-72 p-2">
                        <div className="flex flex-col gap-1">
                          {daysOptions.map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center gap-3 px-3 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded text-[#13097D] focus:ring-indigo-400 cursor-pointer"
                                checked={(data.workingDays || []).includes(option.value)}
                                onChange={() => handleDayToggle(option.value)}
                              />
                              <span className="text-sm text-gray-700">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <TimeList
                      title="Start Time"
                      options={startTimeOptions}
                      selectedValue={data.officeStartTime || ''}
                      onSelect={(value) => handleTimeChange('officeStartTime', value)}
                    />
                    <TimeList
                      title="End Time"
                      options={endTimeOptions}
                      selectedValue={data.officeEndTime || ''}
                      onSelect={(value) => handleTimeChange('officeEndTime', value)}
                    />
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </>
  );
}