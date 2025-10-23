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
      <label className="text-sm font-montserrat text-[#232323]">{label}</label>
      <div className="mt-2 w-full min-h-[40px] flex items-center px-4 py-2 rounded-md border border-gray-200 bg-white">
        {isEditing ? (
          <input
            type="text"
            name={name}
            value={displayValue}
            onChange={onChange}
            className="w-full font-montserrat font-medium text-base text-gray-800 bg-transparent focus:outline-none"
          />
        ) : (
          <p className="font-montserrat font-medium text-base text-[#718EBF]">{displayValue}</p>
        )}
      </div>
    </div>
  );
}