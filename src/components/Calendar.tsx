import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useEffect, useRef, useState } from "react";

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

export default function DateCalendarReferenceDate({
  value: propValue,
  onChange,
}:
CalendarProps = {}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState<Dayjs>(
    propValue ? dayjs(propValue) : dayjs()
  );

  useEffect(() => {
    if (propValue) {
      setValue(dayjs(propValue));
    }
  }, [propValue]);

  useEffect(() => {
    const stripYear = () => {
      if (!rootRef.current) return;
      const walker = document.createTreeWalker(
        rootRef.current,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
        null
      );
      let node: Node | null = walker.nextNode();
      while (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const txt = node.textContent?.trim();
          if (txt && /\b[A-Za-z]+\s+\d{4}\b/.test(txt)) {
            node.textContent = txt.replace(/\s+\d{4}\b/, "");
          }
        }
        node = walker.nextNode();
      }
    };

    const observer = new MutationObserver(() => stripYear());
    if (rootRef.current) {
      observer.observe(rootRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      stripYear();
    }

    return () => observer.disconnect();
  }, []);


  return (
    <div ref={rootRef} className="proc-calendar">
      <style>{`
        .proc-calendar .MuiPickersMonth-root button.Mui-selected,
        .proc-calendar .MuiMonthPicker-root button.Mui-selected,
        .proc-calendar .MuiPickersMonth-monthButton.Mui-selected {
          background-color: #FA660F !important;
          color: #ffffff !important;
          border: none !important;
          box-shadow: none !important;
        }
        .proc-calendar .MuiDateCalendar-root {
          width: 100%;
          overflow: hidden !important;
        }
        .proc-calendar .MuiPickersCalendarHeader-root {
          padding-top: 4px !important;
          padding-bottom: 4px !important;
          margin: 0 !important;
        }
        .proc-calendar .MuiDayCalendar-header {
          margin: 0 !important;
        }
        .proc-calendar .MuiDayCalendar-weekContainer {
          margin: 0 !important;
        }
        .proc-calendar .MuiDayCalendar-monthContainer {
          padding: 0 !important;
          margin: 0 !important;
        }
        .proc-calendar .MuiPickersSlideTransition-root {
          overflow: hidden !important;
        }
        .proc-calendar ::-webkit-scrollbar {
          display: none !important;
        }
        .proc-calendar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }

      `}</style>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          showDaysOutsideCurrentMonth
          value={value}
          onChange={(newVal) => {
            const newValue = newVal ?? dayjs();
            setValue(newValue);
            if (onChange) {
              onChange(newValue.toDate());
            }
          }}
          referenceDate={dayjs("2022-04-17")}
          views={["month", "day"]}
        />
      </LocalizationProvider>
    </div>
  );
}