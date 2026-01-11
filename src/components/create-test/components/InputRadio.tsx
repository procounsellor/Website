type RadioProps<T extends string> = {
  label: string;
  name: string;
  value: T;
  checked: boolean;
  onChange: (value: T) => void;
  disabled?: boolean;
};

export function Radio<T extends string>({
  label,
  name,
  value,
  checked,
  onChange,
  disabled = false,
}: RadioProps<T>) {
  return (
    <label
      className={`flex items-center gap-3 select-none
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {/* Native input (hidden but accessible) */}
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="sr-only flex items-center justify-center"
      />

      {/* Custom radio */}
      <span
        className={`relative flex items-center justify-center
          w-[20px] h-[20px] rounded-full border-2
          ${checked ? "border-[#2F43F2]" : "border-gray-400"}`}
      >
        {/* Inner dot */}
        {checked && (
          <span
            className="absolute rounded-full bg-[#2F43F2]"
            style={{
              width: "12px",
              height: "12px",
              top: "2px",
              left: "2px",
              opacity: 1,
            }}
          />
        )}
      </span>

      {/* Label */}
      <span className="text-sm text-gray-800">{label}</span>
    </label>
  );
}
