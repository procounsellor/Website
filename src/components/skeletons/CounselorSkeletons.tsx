import type { ReactElement } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CounselorCardSkeleton(): ReactElement {
  return (
    <Card
      className="flex flex-col w-[170px] lg:w-[282px] h-[221px] lg:h-[366px] p-[10px] transition-all duration-300 hover:shadow-lg bg-white shadow-[0px_0px_4px_0px_#23232340] rounded-[12px] lg:rounded-[20px]"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Image shimmer - match actual image size used in the real card */}
      <div className="overflow-hidden w-full max-w-[150px] lg:max-w-[262px] h-[124px] lg:h-[248px] rounded-[10px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer">
        <Skeleton className="w-full h-full rounded-[10px] bg-gray-200/80" />
      </div>

      <div className="flex flex-col mt-2">
        <Skeleton className="h-4 lg:h-6 w-32 lg:w-44 mb-1 bg-gray-200/80" />

        <Skeleton className="h-3 lg:h-4 w-24 lg:w-36 mb-2 bg-gray-200/80" />

        <div className="flex justify-between text-xs lg:text-[16px] mt-2">
          <div className="flex gap-x-1 lg:gap-2 text-[#7EE655]">
            <Skeleton className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-gray-200/80" />
            <Skeleton className="w-14 lg:w-20 h-3 bg-gray-200/80" />
          </div>
          <div className="flex gap-x-1 lg:gap-2">
            <Skeleton className="w-4 h-4 lg:w-5 lg:h-5 bg-gray-200/80" />
            <Skeleton className="w-20 lg:w-28 h-3 bg-gray-200/80" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function AllCounselorCardSkeleton(): ReactElement {
  return (
    <Card
      className="flex flex-col w-[170px] lg:w-[282px] h-[267px] lg:h-[444px] hover:shadow-lg transition-all duration-300 bg-white shadow-[0px_0px_4px_0px_#23232340] rounded-[12px] lg:rounded-[20px] p-[10px]"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Image shimmer - match the SmartImage size used in AllCounselorCard */}
      <div className="overflow-hidden w-[150px] lg:w-[262px] h-[124px] lg:h-[248px] rounded-[10px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer">
        <Skeleton className="w-full h-full rounded-[10px] bg-gray-200/80" />
      </div>

      <div className="mt-2 mb-1">
        <Skeleton className="h-4 lg:h-6 w-48 lg:w-64 mb-2 bg-gray-200/80" />

        <div className="flex flex-col text-[#8C8CA1] text-[12px] lg:text-[18px] font-medium">
          <Skeleton className="h-3 lg:h-4 w-36 lg:w-48 mb-1 bg-gray-200/80" />
          <Skeleton className="h-3 lg:h-4 w-28 lg:w-40 bg-gray-200/80" />
        </div>

        <div className="my-1">
          <div className="flex items-center justify-between lg:justify-start lg:gap-3 text-[#696969] text-[12px] lg:text-[16px] font-medium">
            <Skeleton className="h-4 lg:h-5 w-24 lg:w-32 bg-gray-200/80" />
            <Skeleton className="h-4 lg:h-5 w-28 lg:w-36 bg-gray-200/80" />
          </div>
        </div>

        <div className="h-px bg-gray-200 my-2" />

        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-6 lg:h-11 w-6 lg:w-11 rounded bg-gray-200/80" />
          <Skeleton className="h-3 lg:h-4 w-28 lg:w-40 bg-gray-200/80" />
        </div>
      </div>
    </Card>
  );
}
