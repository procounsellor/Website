type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
}: CheckboxProps) {
  return (
    <label
      className={`flex items-center gap-3 select-none
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {/* Native checkbox (hidden but accessible) */}
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />

      {/* Custom checkbox */}
      <span
        className="relative flex items-center justify-center
                   w-[24px] h-[24px] rounded-[4px]
                   border border-[#0E1629]
                   shadow-[2px_2px_4px_0px_#2626261A]"
        style={{
          backgroundColor: checked ? "var(--btn-primary)" : "transparent",
          opacity: 1,
        }}
      >
        {/* Tick */}
        {checked && (
          <svg
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="none"
          >
            <path
              d="M1 5L5 9L13 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      {/* Label */}
      <span className="text-sm text-[#232323]">{label}</span>
    </label>
  );
}
