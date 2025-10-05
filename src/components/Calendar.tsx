import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

export default function CustomCalendar() {
  return (
    <div className="p-4">
      <DayPicker
      showOutsideDays
      captionLayout="dropdown-months"
        mode="single"
        className="grid gap-2 text-sm"
        styles={{
          caption: { fontSize: '1.2rem', color: '#222' },
        }}
        modifiersClassNames={{
          selected:"h-9 w-9 border-[2px] rounded-full " ,
          today: "bg-[#FA660F] rounded-full h-9 w-9 text-white text-[16px]",
        }}
      />
    </div>
  )
}
