import type { ReactElement } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CounselorCardSkeleton(): ReactElement {
  return (
    <div className="w-full max-w-85 md:max-w-none md:w-61 shrink-0">
      <div className="relative h-40 w-full md:hidden">
        <div className="absolute inset-0 rounded-[12px] bg-white shadow-[0px_0px_4px_0px_#23232340]" />

        <div className="relative h-full w-full p-3">
          <div className="flex h-full gap-2">
            <div className="relative h-full w-[42%] max-w-35 shrink-0 overflow-hidden rounded-[10px] bg-gray-200/80" />

            <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
              <div>
                <Skeleton className="h-3 w-16 mb-1 bg-gray-200/80" />
                <Skeleton className="h-4 w-28 mb-1 bg-gray-200/80" />
                <Skeleton className="h-3 w-32 mb-1 bg-gray-100/80" />
                <Skeleton className="h-3 w-24 bg-gray-100/80" />
              </div>

              <div className="flex items-center gap-1.5 pr-[24%]">
                <Skeleton className="h-3.5 w-3.5 rounded-full bg-gray-200/80" />
                <Skeleton className="h-3 w-16 bg-gray-200/80" />
              </div>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 w-13.25 h-12.5 rounded-tl-xl rounded-br-xl bg-[#0E1629]" />
        </div>
      </div>

      <div className="relative hidden md:block w-61 h-91.75">
        <div className="absolute inset-0 rounded-[14px] bg-white shadow-[0px_0px_4px_0px_#23232340]" />

        <div className="relative h-full p-3 flex flex-col">
          <div className="absolute top-4.5 right-4.5 z-10 h-8 w-8 rounded-full bg-gray-200/80 animate-pulse" />
          <div className="absolute top-5 left-5 z-10 h-6 w-12 rounded-full bg-gray-200/80 animate-pulse" />

          <div className="overflow-hidden w-55 h-52 rounded-[10px] bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer">
            <Skeleton className="w-full h-full rounded-[10px] bg-gray-200/80" />
          </div>

          <div className="mt-2">
            <Skeleton className="h-6 w-40 bg-gray-200/80" />
          </div>

          <div className="flex flex-col gap-1 mt-3">
            <div className="flex items-center gap-1">
              <Skeleton className="w-5 h-5 rounded-full bg-gray-200/80" />
              <Skeleton className="h-4 w-36 bg-gray-200/80" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="w-5 h-5 rounded-full bg-gray-200/80" />
              <Skeleton className="h-4 w-30 bg-gray-200/80" />
            </div>
          </div>

          <div className="flex items-center gap-1 mt-3">
            <Skeleton className="w-8 h-8 rounded bg-gray-200/80" />
            <Skeleton className="h-5 w-30 bg-gray-200/80" />
          </div>

          <div className="absolute -right-px bottom-[1.5px] w-12 h-10.25 md:w-13.25 md:h-12.5 rounded-tl-[10px] rounded-br-[10px] bg-[#0E1629]" />
        </div>
      </div>
    </div>
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
