import MultiSelectDropdown from "../counselor-signup/MultiSelectDropdown";

interface EditableFieldProps {
  label: string;
  value: string | string[];
  isEditing: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  name: string;
  as?: 'input' | 'textarea' | 'multiselect';
  type?: string;
  multiSelectOptions?: { label: string; value: string }[];
  onMultiChange?: (selected: string[]) => void;
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
  onMultiChange = () => {}
}: EditableFieldProps) {
  
  const displayValue = Array.isArray(value) ? value.join(', ') : value;

  return (
    <div>
      <label className="text-xs md:text-sm text-[#858585] md:text-[#232323]">{label}</label>
      <div 
        className={`
          mt-1 md:mt-2 w-full
          ${isEditing && as === 'multiselect' 
            ? '' 
            : 'min-h-[48px] md:min-h-[40px] flex items-center px-4 py-2 rounded-lg md:rounded-md border border-[#EFEFEF] md:border-gray-200 bg-[#F9FAFB] md:bg-white'
          }
        `}
      >
        {isEditing ? (
          <>
            {as === 'input' && (
              <input
                type={type}
                name={name}
                value={displayValue}
                onChange={onChange}
                className="w-full font-normal md:font-medium text-sm md:text-base text-gray-800 bg-transparent focus:outline-none"
              />
            )}
            {as === 'textarea' && (
              <textarea
                name={name}
                value={displayValue}
                onChange={onChange}
                className="w-full font-normal md:font-medium text-sm md:text-base text-gray-800 bg-transparent focus:outline-none min-h-[80px] resize-y"
                rows={3}
              />
            )}
            {as === 'multiselect' && (
              <MultiSelectDropdown
                options={multiSelectOptions}
                selected={Array.isArray(value) ? value : []}
                onChange={onMultiChange}
                placeholder={`Select ${label}...`}
              />
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