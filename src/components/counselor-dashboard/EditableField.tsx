import DashboardMultiSelect from "./DashboardMultiSelect";

interface EditableFieldProps {
  label: string;
  value: string | string[];
  isEditing: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  name: string;
  as?: 'input' | 'textarea' | 'multiselect' | 'select';
  type?: string;
  multiSelectOptions?: { label: string; value: string }[];
  onMultiChange?: (selected: string[]) => void;
  selectOptions?: { label: string; value: string }[];
}

export default function EditableField({ 
  label, 
  value, 
  isEditing, 
  onChange = () => {}, 
  name,
  as = 'input',
  type = 'text',
  multiSelectOptions = [],
  onMultiChange = () => {},
  selectOptions = []
}: EditableFieldProps) {
  
  const displayValue = Array.isArray(value) 
    ? value.join(', ') 
    : (as === 'select' && !isEditing)
      ? selectOptions.find(opt => opt.value === value)?.label || String(value)
      : String(value);

  const singleValue = Array.isArray(value) ? value[0] || '' : value;

  const baseWrapperStyles = 'mt-1 md:mt-2 w-full rounded-lg md:rounded-md border border-[#EFEFEF] md:border-gray-200 bg-[#F9FAFB] md:bg-white';
  const heightStyles = 'min-h-[48px] md:min-h-[40px]';
  const layoutStyles = (isEditing && (as === 'select' || as === 'multiselect'))
    ? 'p-0'
    : 'px-4 py-2 flex items-center'; 

  return (
    <div>
      <label className="text-xs md:text-sm text-[#858585] md:text-[#232323]">{label}</label>
      <div 
        className={`
          ${baseWrapperStyles} 
          ${heightStyles} 
          ${layoutStyles}
        `}
      >
        {isEditing ? (
          <>
            {as === 'input' && (
              <input
                type={type}
                name={name}
                value={singleValue}
                onChange={onChange}
                className="w-full font-normal md:font-medium text-sm md:text-base text-gray-800 bg-transparent focus:outline-none"
              />
            )}
            {as === 'textarea' && (
              <textarea
                name={name}
                value={singleValue}
                onChange={onChange}
                className="w-full font-normal md:font-medium text-sm md:text-base text-gray-800 bg-transparent focus:outline-none min-h-20 resize-none overflow-auto"
                rows={3}
              />
            )}
            {as === 'multiselect' && (
              <DashboardMultiSelect
                options={multiSelectOptions}
                selected={Array.isArray(value) ? value : []}
                onChange={onMultiChange}
                placeholder={`Select ${label}...`}
              />
            )}
            {as === 'select' && (
              <select
                name={name}
                value={singleValue}
                onChange={onChange}
                className="w-full h-full min-h-12 md:min-h-10 px-4 py-2 font-normal md:font-medium text-sm md:text-base text-gray-800 bg-transparent focus:outline-none rounded-lg md:rounded-md appearance-none cursor-pointer"
              >
                <option value="" disabled>Select {label}</option>
                {selectOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

          </>
        ) : (
          <p className="font-normal md:font-medium text-sm md:text-base text-[#718EBF]">
            {displayValue || (Array.isArray(value) && value.length === 0 ? 'Not set' : displayValue)}
          </p>
        )}
      </div>
    </div>
  );
}