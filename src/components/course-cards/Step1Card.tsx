import { useRef } from "react";

type Step1Data = {
  courseName: string;
  description: string;
  thumbnail: File | null;
  category: string;
  courseTimeHours: string;
  courseTimeMinutes: string;
};

type Step1CardProps = {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
};

const clampNumber = (value: string, min: number, max: number) => {
  if (value === "") return "";
  const num = Number(value);
  if (isNaN(num)) return "";
  return Math.min(Math.max(num, min), max).toString();
};

export default function Step1Card({ data, onChange }: Step1CardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange({ ...data, thumbnail: file });
    }
  };

  return (
    <div className="flex flex-col gap-5 bg-white max-w-234 p-6 rounded-2xl">
      <div className="flex flex-col gap-3 items-start">
        <label
          htmlFor="name"
          className="text-[1rem] font-medium text-[#8C8CA1]"
        >
          Name*
        </label>
        <input
          type="text"
          placeholder="Enter course name"
          value={data.courseName}
          onChange={(e) => onChange({ ...data, courseName: e.target.value })}
          className="bg-[#F5F7FA] rounded-[0.75rem] h-12 p-2 w-218"
        />
      </div>

      <div className="flex flex-col gap-3 items-start">
        <label
          htmlFor="description"
          className="text-[1rem] font-medium text-[#8C8CA1]"
        >
          Description*
        </label>
        <textarea
          placeholder="Enter description here"
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="bg-[#F5F7FA] rounded-[0.75rem] h-24 p-2 w-218"
        />
      </div>

      <div className="flex flex-col gap-3 items-start">
        <label
          htmlFor="button"
          className="text-[1rem] font-medium text-[#8C8CA1]"
        >
          Add Thumbnail*
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleThumbnailUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="group flex items-center gap-2 py-2 px-6 border border-[#13097D] text-[#13097D] hover:cursor-pointer rounded-[0.75rem] font-semibold text-[1rem] hover:bg-[#13097D] hover:text-white transition-all duration-200"
        >
          <img
            src="/uploadIcon.svg"
            alt=""
            className="transition-all duration-200 group-hover:invert group-hover:brightness-0"
          />
          {data.thumbnail?.name || "Upload"}
        </button>
      </div>

      <div className="flex gap-5">
        <div className="flex flex-col gap-3 items-start">
          <label
            htmlFor="button"
            className="text-[1rem] font-medium text-[#8C8CA1]"
          >
            Course Duration (Hours)*
          </label>
          <input
            type="number"
            placeholder="0"
            value={data.courseTimeHours}
            min={0}
            max={999}
            onChange={(e) =>
              onChange({
                ...data,
                courseTimeHours: clampNumber(e.target.value, 0, 999),
              })
            }
            className="bg-[#F5F7FA] rounded-[0.75rem] h-12 p-2 w-55"
          />
        </div>

        <div className="flex flex-col gap-3 items-start">
          <label
            htmlFor="button"
            className="text-[1rem] font-medium text-[#8C8CA1]"
          >
            Course Duration (Minutes)*
          </label>
          <input
            type="number"
            placeholder="0"
            value={data.courseTimeMinutes}
            min={0}
            max={59}
            onChange={(e) =>
              onChange({
                ...data,
                courseTimeMinutes: clampNumber(e.target.value, 0, 59),
              })
            }
            className="bg-[#F5F7FA] rounded-[0.75rem] h-12 p-2 w-55"
          />
        </div>
      </div>
    </div>
  );
}
