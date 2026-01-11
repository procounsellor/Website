interface props{
    label:string,
    placeholder:string,
    disabled?:boolean,
    value?:string,
    onChange?:(value:string)=>void
}
export function Input({label, placeholder, disabled, value, onChange}:props){
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
         className="border border-[#13097D66] disabled:border-[#6B7280] disabled:cursor-not-allowed placeholder:disabled:#6B7280 py-3 px-4 rounded-[12px] w-full placeholder:text-(--text-muted) placeholder:font-medium"
        />
    </div>
}