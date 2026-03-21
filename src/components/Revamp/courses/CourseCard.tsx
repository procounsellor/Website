import type { CourseType } from "@/types/course";

interface CourseCardParam {
  isBaught: boolean;
  course?: CourseType;
  isLoading: boolean;
}

export default function CourseCard(params: CourseCardParam) {
  const duration = "3 Week";

  if (params.isLoading) {
    return (
      <div className="w-[19.5rem] h-[28.188rem] bg-white p-3 rounded-2xl flex flex-col gap-2.5 animate-pulse">
        <div className="w-full h-[16.25rem] rounded-[8px] bg-gray-200" />

        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 w-[70%] rounded bg-gray-200" />
          <div className="h-3 w-[40%] rounded bg-gray-100" />

          <div className="flex gap-2 mt-2">
            <div className="h-3 w-[35%] rounded bg-gray-200" />
            <div className="h-3 w-[35%] rounded bg-gray-200" />
          </div>

          <div className="h-10 mt-auto rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-[19.5rem] h-[28.188rem] bg-white p-3 rounded-2xl flex flex-col gap-2.5">
      <div className="w-full h-[16.25rem] rounded-[8px] bg-gray-300 relative">
        {/* <div className="absolute top-1 left-1">
          <Star />
          <span>{params.course?.rating}</span>
        </div> */}
        <img
          src={params.course?.image}
          alt={params.course?.name}
          className="w-[18rem] h-[16.25rem] rounded-[8px] object-cover"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="flex flex-col gap-1 text-(--text-main) font-semibold text-[1rem] ">
          {params.course?.name}
          <span className="text-(--text-muted) text-xs font-normal">
            Aditya Ram
          </span>
        </h1>

        <div className="flex flex-col gap-1 text-(--text-main) text-[0.875rem] font-semibold">
          <p>
            Duration: <span className="text-(--text-muted) font-normal pr-1">{duration}</span>
          </p>
          <div className="flex gap-1">
            <div className="flex gap-1">
              <p>Price: {params.course?.price}</p>
              <div className="relative inline-flex items-center">
                <p className="text-(--text-muted) font-normal text-[0.875rem] leading-none pr-0.5">
                  {params.course?.price}
                </p>
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-(--text-muted)"></div>
              </div>
            </div>

            <div className="bg-[#E6EFEC] rounded-2xl py-0.5 px-3">
              <p className="text-[#25A777] font-normal text-[0.625rem]">40% off</p>
            </div>
          </div>
        </div>

        {params.isBaught ? (
          <button className="group flex gap-2.5 items-center justify-center mt-2 border border-(--text-main) text-(--text-main) px-2.5 py-2 rounded-[12px] cursor-pointer transition-colors duration-300 hover:bg-(--text-main) hover:text-white">
            Continue{" "}
            <span className="relative w-5 h-5 overflow-hidden">
              <img
                src="/arrow.svg"
                alt="arrow"
                className="absolute inset-0 w-full h-full transition-all duration-300 group-hover:translate-x-5 group-hover:opacity-0"
                style={{ filter: "brightness(0)" }}
              />
              <img
                src="/arrow.svg"
                alt="arrow"
                className="absolute inset-0 w-full h-full -translate-x-5 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </span>
          </button>
        ) : (
          <button className="mt-2 border border-(--text-main) text-(--text-main) px-2.5 py-2 rounded-[12px] cursor-pointer transition-colors duration-300 hover:bg-(--text-main) hover:text-white">
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
}
