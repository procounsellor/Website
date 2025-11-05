import { CircleCheckBig } from "lucide-react";
import { TbBriefcase2 } from "react-icons/tb";
import type { AllCounselor } from "@/types/academic";

type CounselorCardProps = {
  counselor: AllCounselor;
};

// Helper function to capitalize first letter of each name part
const capitalizeName = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export function CounselorCard({ counselor }: CounselorCardProps) {
  const firstName = capitalizeName(counselor.firstName || "Unknown");
  const lastName = capitalizeName(counselor.lastName || "Counselor");
  const fullName = `${firstName} ${lastName}`;
  const imageUrl =
    counselor.photoUrlSmall ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName
    )}&background=6B7280&color=ffffff&size=400`;
  const languages = counselor.languagesKnow || ["English"];
  const experience = counselor.experience
    ? `${counselor.experience} Years`
    : "Entry Level";
  const description = languages.slice(0, 2).join(" | ");

  return (
    <div
      className="flex flex-col  w-[170px] lg:w-[282px] h-[221px]
    lg:h-[366px] p-[10px] transition-all duration-300  hover:shadow-lg
     bg-white shadow-[0px_0px_4px_0px_#23232340] rounded-[12px] lg:rounded-[20px]"
    >
      <img
        src={imageUrl}
        alt={fullName}
        className="w-full max-w-[150px] lg:max-w-[262px] h-[124px] lg:h-[248px] object-cover rounded-[10px]"
      />

      <div className="flex flex-col mt-2">
        <h1 className="text-[14px] lg:text-[20px] font-medium lg:font-semibold text-[#242645]">
          {fullName}
        </h1>

        <span className="font-medium text-xs lg:text-lg text-[#8C8CA1] lg:mt-0 mt-1">
          {description}
        </span>

        <hr className="h-px text-[#E3E3E3] mt-1" />

        <div className="flex justify-between text-xs lg:text-[16px] mt-2">
          <div className="flex gap-x-1 lg:gap-2 text-[#7EE655]">
            <CircleCheckBig className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="text-[#696969]">Verified</span>
          </div>
          <div className="flex gap-x-1 lg:gap-2">
            <TbBriefcase2 className="w-4 h-4 lg:w-5 lg:h-5 text-[#4471FF]" />
            {experience}
          </div>
        </div>
      </div>
    </div>
  );
}
