interface EditableFieldProps {
  label: string;
  value: string | string[];
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

export default function EditableField({ label, value, isEditing, onChange, name }: EditableFieldProps) {
  const displayValue = Array.isArray(value) ? value.join(', ') : value;

  return (
    <div>
      <label className="text-xs md:text-sm text-[#858585] md:text-[#232323]">{label}</label>
      <div 
        className={`
          mt-1 md:mt-2 w-full min-h-[48px] md:min-h-[40px] flex items-center 
          px-4 py-2 rounded-lg md:rounded-md 
          border border-[#EFEFEF] md:border-gray-200 
          bg-[#F9FAFB] md:bg-white
        `}
      >
        {isEditing ? (
          <input
            type="text"
            name={name}
            value={displayValue}
            onChange={onChange}
            className="w-full font-normal md:font-medium text-sm md:text-base text-gray-800 bg-transparent focus:outline-none"
          />
        ) : (
          <p className="font-normal md:font-medium text-sm md:text-base text-[#718EBF]">
            {displayValue}
          </p>
        )}
      </div>
    </div>
  );
}