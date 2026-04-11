interface props{
    label:string,
    placeholder:string,
    value?:string,
    onChange?:(value:string)=>void
}

export function Textarea({label, placeholder, value, onChange}:props){
        return <div className="flex flex-col gap-2">
        <label 
        htmlFor={label}
        className="text-[1rem] font-normal"
        >{label}</label>
        <textarea
         value={value}
         onChange={(e) => onChange?.(e.target.value)}
         placeholder={placeholder || 'Enter ..'}
         className="border border-[#13097D66] resize-none py-3 px-4 rounded-[12px] min-h-[132px] w-full placeholder:text-(--text-muted) placeholder:font-medium"
        />
    </div>
}