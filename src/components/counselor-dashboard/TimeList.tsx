export type TimeOption = {
  label: string;
  value: string;
};

interface TimeListProps {
  options: TimeOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  title: string;
}

export default function TimeList({
  options,
  selectedValue,
  onSelect,
  title,
}: TimeListProps) {
  return (
    <div className="flex flex-col h-full">
      <h4 className="text-sm font-medium text-gray-900 px-4 py-2 border-b border-gray-100">
        {title}
      </h4>
      <div
        className="flex-1 overflow-y-auto max-h-60 md:max-h-72 p-2 scrollbar-hide"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`
                w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer
                ${
                  selectedValue === option.value
                    ? "bg-[#13097D] text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
              aria-pressed={selectedValue === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}