interface props {
    label: string,
    placeholder: string,
    disabled?: boolean,
    value?: string,
    onChange?: (value: string) => void,
    error?: boolean,
    errorMessage?: string
}
export function Input({ label, placeholder, disabled, value, onChange, error, errorMessage }: props) {
    return <div className="flex flex-col gap-2">
        <label
            htmlFor={label}
            className={`text-[1rem] font-normal ${disabled && 'text-(--text-muted)'} `}
        >{label}</label>
        <input
            type="text"
            disabled={disabled}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder || 'Enter ..'}
            className={`border py-3 px-4 rounded-[12px] w-full placeholder:text-(--text-muted) placeholder:font-medium transition-colors ${error
                    ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#13097D66]'
                } ${disabled && 'border-[#6B7280] cursor-not-allowed'}`}
        />
        {error && errorMessage && (
            <span className="text-red-500 text-sm">{errorMessage}</span>
        )}
    </div>
}