import type { CourseType } from "@/types/course";
import { useNavigate } from "react-router-dom";
import RatingBadge from "./RatingBadge";

interface CourseCardParam {
  isBaught: boolean;
  course?: CourseType;
  isLoading: boolean;
}

const formatDisplayPrice = (price?: string) => {
  if (!price) return "0";
  const trimmed = String(price).trim();
  if (trimmed.toLowerCase() === "free") return "Free";
  return trimmed.replace(/₹/g, "").trim();
};

export default function CourseCard(params: CourseCardParam) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "user";
  const duration = "3 Week";
  const displayPrice = formatDisplayPrice(params.course?.price);
  const courseId = params.course?.id;
  const canNavigate = Boolean(courseId);

  const handleNavigate = () => {
    if (!courseId) return;
    navigate(`/detail/${courseId}/${role}`);
  };

  if (params.isLoading) {
    return (
      <div className="w-78 h-[28.188rem] bg-white p-3 rounded-2xl flex flex-col gap-2.5 animate-pulse">
        <div className="w-full h-65 rounded-xl bg-gray-200" />

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
    <div>
      <div
        className={`relative w-[200px] h-[275px] md:hidden ${canNavigate ? "cursor-pointer" : ""}`}
        onClick={handleNavigate}
        role={canNavigate ? "button" : undefined}
        tabIndex={canNavigate ? 0 : -1}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          width="200"
          height="275"
          viewBox="0 0 200 275"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M192.308 0C196.556 3.77405e-06 200 4.37119 200 9.76331V215.991C200 222.619 194.627 227.991 188 227.991L166.064 227.991C160.478 227.991 155.631 231.846 154.372 237.288L147.802 265.703C146.543 271.146 141.696 275 136.11 275H7.69231C3.44397 275 5.42061e-08 270.629 0 265.237V9.76331C1.36289e-06 4.37119 3.44396 1.96565e-07 7.69231 0H192.308Z"
            fill="white"
          />
        </svg>
        <div className="relative z-10 h-full w-full p-3 flex flex-col">
          {/* Mobile content shell: you can customize this block for the remaining design */}
          <div className="relative">
            {/* <RatingBadge rating={params.course?.rating ?? "4.8"} /> */}
            <img
              src={params.course?.image}
              alt={params.course?.name}
              className="w-full h-[151px] rounded-[10px] object-cover"
            />
          </div>

          <div className="mt-2">
            <h3 className="text-(--text-main) font-semibold text-[0.875rem] line-clamp-1">
              {params.course?.name}
            </h3>
            <p className="text-(--text-muted) text-[0.75rem]">By: Aditya Ram</p>
          </div>

          <div className="mt-2 flex flex-col gap-3">
            <div className="flex items-center gap-1 text-sm leading-none">
              <p className="font-medium text-(--text-main)">Duration:</p>
              <span className="font-normal text-(--text-muted)">3 Weeks</span>
            </div>

            <div className="flex items-center gap-1 text-(--text-main) font-medium text-sm">
              <img src="/coin.svg" alt="procoin_icon" className="w-4 h-4" />
              <p>{displayPrice}</p>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0">
          <svg
            width="46"
            height="41"
            viewBox="0 0 46 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.84 6.23929C6.66311 2.5911 9.90394 0 13.6438 0H37.9973C42.4156 0 45.9973 3.58172 45.9973 8V33C45.9973 37.4183 42.4156 41 37.9973 41H8.00333C2.87473 41 -0.929248 36.2421 0.199495 31.2393L5.84 6.23929Z"
              fill="#0E1629"
            />
          </svg>

          <svg
            className="absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_2642_12728)">
              <path
                d="M4.16687 9.58301H15.8335"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.5 12.9163L15.8333 9.58301"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.5 6.25L15.8333 9.58333"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_2642_12728">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>

      <div
        className={`w-78 h-[28.188rem] bg-white p-3 rounded-2xl hidden md:flex flex-col gap-2.5 ${canNavigate ? "cursor-pointer" : ""}`}
        onClick={handleNavigate}
        role={canNavigate ? "button" : undefined}
        tabIndex={canNavigate ? 0 : -1}
      >
        <div className="w-full h-65 rounded-xl bg-gray-300 relative">
          <RatingBadge rating={params.course?.rating ?? "4.8"} />
          <img
            src={params.course?.image}
            alt={params.course?.name}
            className="w-[18rem] h-65 rounded-xl object-cover"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-(--text-main) font-semibold text-[1rem] truncate whitespace-nowrap overflow-hidden">
              {params.course?.name}
            </h1>
            <span className="text-(--text-muted) text-xs font-normal">
              Aditya Ram
            </span>
          </div>

          <div className="flex flex-col gap-1 text-(--text-main) text-[0.875rem] font-semibold">
            <p>
              Duration:{" "}
              <span className="text-(--text-muted) font-normal pr-1">
                {duration}
              </span>
            </p>
            <div className="flex items-center gap-1 text-(--text-main) font-medium text-sm">
              <img src="/coin.svg" alt="procoin_icon" className="w-5 h-5" />
              <p>{displayPrice}</p>
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
    </div>
  );
}
