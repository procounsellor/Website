import { useState } from "react";
import PlansDrawer from "./PlansDrawer";
import { Check, X } from "lucide-react";
import type { CounselorDetails } from "@/types";
import type { SubscribedCounsellor } from "@/types/user";

/* eslint-disable @typescript-eslint/no-explicit-any */
type PlansResponse = {
  benefits?: Array<any>;
  elite?: string[];
  pro?: string[];
  plus?: string[];
  prices?: { elite?: string; pro?: string; plus?: string };
  seats?: { elite?: string; pro?: string; plus?: string };
  desc?: { elite?: string; pro?: string; plus?: string };
};

function ValueCell({ value }: { value: any }) {
  const isTrue = value === true || value === "true";
  const isFalse = value === false || value === "false";

  if (isTrue)
    return (
      <span className="inline-flex items-center justify-center w-full">
        <Check size={16} className="text-[#07B02E]" />
      </span>
    );
  if (isFalse)
    return (
      <span className="inline-flex items-center justify-center w-full">
        <X size={16} className="text-[#FF3B30]" />
      </span>
    );

  return (
    <span className="inline-flex items-center justify-center w-full text-[#13097D]">
      {String(value ?? "-")}
    </span>
  );
}

export default function PlansCard({ 
  plan, 
  counselor, 
  isUpgrade, 
  currentPlan,
  initialSelectedPlan
}: { 
  plan?: PlansResponse, 
  counselor?: CounselorDetails,
  isUpgrade?: boolean,
  currentPlan?: SubscribedCounsellor | null,
  initialSelectedPlan?: string | null
}) {
  const columns: Array<{ key: string; title: string; icon?: string }> = [
    { key: "plus", title: "Plus", icon: "/plusIcon.svg" },
    { key: "pro", title: "Pro", icon: "/proIcon.svg" },
    { key: "elite", title: "Elite", icon: "/eliteIcon.svg" },
  ];
  // default select the Elite plan
  const [selected, setSelected] = useState<string | null>(initialSelectedPlan || "elite");
  const [drawerOpen, setDrawerOpen] = useState(!!initialSelectedPlan);
  const planHierarchy = ['plus','pro','elite'];

  const currentPlanIndex = (isUpgrade && currentPlan?.plan)
    ? planHierarchy.indexOf(currentPlan.plan.toLowerCase())
    : -1;

  return (
    <div className="bg-white w-full max-w-[1092px] pl-6 pr-6 py-6 rounded-[20px]">
      <div className="flex gap-6 items-start">
        {/* Left column: header + benefit names */}
        <div className="w-[333px] pr-4">
          <h1 className="text-[#343C6A] text-[clamp(1.5rem, 2.5vw, 2rem)] font-semibold">Benefits</h1>
          <p className="text-[#232323] text-lg font-normal mb-8">
            To drive your passion
          </p>

          {plan?.benefits?.map((benefit, idx) => (
            <div
              key={idx}
              className="text-[#232323] text-[clamp(0.75rem , 4vw, 1rem)] font-medium py-1.5 flex items-center"
            >
              {benefit.name ?? "-"}
            </div>
          ))}
        </div>

        <div className="w-[591px]">
          <div className="flex gap-6">
            {columns.map((col) => {
            const isSelected = selected === col.key;
            const columnIndex = planHierarchy.indexOf(col.key);
            const isDisabled = isUpgrade && currentPlanIndex != -1 && columnIndex <= currentPlanIndex;
            return (
              <button
                key={col.key}
                type="button"
                disabled={isDisabled}
                aria-disabled={isDisabled}
                onClick={() => {
                  if (isDisabled) return;
                  setSelected(isSelected ? null : col.key)
                }}
                className={`w-[181px] p-4 transition-colors duration-150 rounded-[16px] text-left border-2 box-border ${
                  isSelected
                    ? "border-[#EC5E1A] bg-gradient-to-b from-[#FFF4EB] to-[#FFF1E6]"
                    : "border-transparent bg-transparent"
                } ${
                  isDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex gap-2.5 text-[28px] font-normal items-center ${
                      isSelected ? "text-[#EC5E1A]" : "text-[#13097D]"
                    }`}
                  >
                    <img
                      src={col.icon}
                      alt=""
                      className="h-5 w-5 object-contain"
                    />
                    {col.title}
                  </div>
                  <p
                    className={`${
                      isSelected ? "text-[#EC5E1A]" : "text-[#13097D]"
                    } text-2xl font-semibold`}
                  >
                    {(plan?.prices as any)?.[col.key]}
                  </p>

                  <div className="mt-2 w-full">
                    {plan?.benefits?.map((benefit, idx) => (
                      <div
                        key={`${col.key}-${idx}`}
                        className="py-1.5 text-[16px] text-center font-semibold w-full"
                      >
                        <ValueCell value={(benefit as any)[col.key]} />
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            );
            })}

          </div>

          {/* Single button centered below plan columns: width 586px, height 48px, 48px gap from last row */}
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => {
                if (!selected) return;
                setDrawerOpen(true);
              }}
              className={`w-[586px] h-12 rounded-md text-lg font-semibold transition-colors duration-150 ${
                selected
                  ? "bg-[#EC5E1A] text-white"
                  : "bg-white text-[#EC5E1A] border border-[#EC5E1A] opacity-50 cursor-not-allowed"
              }`}
              disabled={!selected}
            >
              Buy Membership
            </button>
          </div>

        </div>
      </div>
        {/* Plans drawer (overlay) */}
        <PlansDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          planKey={selected}
          plan={plan}
          planTitle={columns.find((c) => c.key === selected)?.title}
          price={(plan?.prices as any)?.[selected ?? ""]}
          counselor={counselor}
          isUpgrade={isUpgrade}
          currentPlan={currentPlan}
        />

    </div>
  );
}
