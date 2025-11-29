import { useState, useEffect } from "react";
import AdvancedSettingsDrawer from "./AdvancedSettingsDrawer";

type Step2Data = {
  courseDurationType: string;
  coursePrice: string;
  discount: string;
  coursePriceAfterDiscount: number;
};

type Step2CardProps = {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
};

export default function Step2Card({ data, onChange }: Step2CardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Auto-calculate price after discount
  useEffect(() => {
    const price = parseFloat(data.coursePrice) || 0;
    const discount = parseFloat(data.discount) || 0;
    const priceAfterDiscount = Math.max(0, price - discount);
    
    if (priceAfterDiscount !== data.coursePriceAfterDiscount) {
      onChange({ ...data, coursePriceAfterDiscount: priceAfterDiscount });
    }
  }, [data.coursePrice, data.discount]);

  return (
    <>
    <div className="flex flex-col gap-5 bg-white max-w-234 min-h-[29.688rem] p-6 rounded-2xl">
      <div className="flex flex-col gap-3 items-start">
        <label
          htmlFor="name"
          className="text-[1rem] font-medium text-[#8C8CA1]"
        >
          Course Duration Type*
        </label>
        <input
          type="text"
          placeholder="Lifetime Validity"
          value={data.courseDurationType}
          onChange={(e) => onChange({ ...data, courseDurationType: e.target.value })}
          className="bg-[#F5F7FA] rounded-[0.75rem] h-12 p-2 w-218"
        />
      </div>

      <div className="flex gap-5">
        <div className="flex flex-col gap-3 items-start">
          <label
            htmlFor="button"
            className="text-[1rem] font-medium text-[#8C8CA1]"
          >
            Price*
          </label>
          <input
            type="number"
            placeholder="₹"
            value={data.coursePrice}
            onChange={(e) => onChange({ ...data, coursePrice: e.target.value })}
            className="bg-[#F5F7FA] rounded-[0.75rem] h-12 p-2 max-w-[9.313rem]"
          />
        </div>

        <div className="flex flex-col gap-3 items-start">
          <label
            htmlFor="button"
            className="text-[1rem] font-medium text-[#8C8CA1]"
          >
            Discount*
          </label>
          <input
            type="number"
            placeholder="₹"
            value={data.discount}
            onChange={(e) => onChange({ ...data, discount: e.target.value })}
            className="bg-[#F5F7FA] rounded-[0.75rem] h-12 p-2 max-w-[9.313rem]"
          />
        </div>

        <div className="flex flex-col gap-3 items-start">
          <label
            htmlFor="button"
            className="text-[1rem] font-medium text-[#8C8CA1]"
          >
            Final Price*
          </label>
          <input
            type="number"
            placeholder="₹"
            value={data.coursePriceAfterDiscount}
            readOnly
            className="bg-[#E8E8E8] rounded-[0.75rem] h-12 p-2 max-w-[9.313rem] cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 items-start">
        <button 
          onClick={() => setDrawerOpen(true)}
          className="flex  items-center gap-2 py-2 px-6 border border-[#13097D] text-[#13097D] rounded-[0.75rem] font-semibold text-[1rem] hover:bg-[#13097D] hover:text-white transition-all duration-200"
        >
           Advanced Settings
        </button>
      </div>
    </div>

    <AdvancedSettingsDrawer 
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    />
    </>
  );
}
