import { Star } from "lucide-react";

interface TestGroupCardProps {
  image: string;
  rating: string;
  title: string;
  totalTests: number;
  totalStudents: number;
}

export default function TestGroupCard({
  image,
  rating,
  title,
  totalTests,
  totalStudents,
}: TestGroupCardProps) {
  return (
    <div className="flex flex-col bg-white gap-2.5 p-3 rounded-2xl">
      <div className="relative w-[18rem] h-65 rounded-xl">
        <img
          src={image}
          alt="course_image"
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
          <p className="text-[12px] font-medium text-[#0E1629]">{rating}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 ">
        <h3
          className="text-[#0E1629] font-semibold text-xl max-w-[18rem] overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {title}
        </h3>

        <div className="flex gap-2.5 font-normal text-xs text-[#6B7280]">
          <div className="flex gap-1 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <g clipPath="url(#clip0_215_2617)">
                <path
                  d="M3.75 3.75C3.75 3.35218 3.90804 2.97064 4.18934 2.68934C4.47064 2.40804 4.85218 2.25 5.25 2.25H12.75C13.1478 2.25 13.5294 2.40804 13.8107 2.68934C14.092 2.97064 14.25 3.35218 14.25 3.75V14.25C14.25 14.6478 14.092 15.0294 13.8107 15.3107C13.5294 15.592 13.1478 15.75 12.75 15.75H5.25C4.85218 15.75 4.47064 15.592 4.18934 15.3107C3.90804 15.0294 3.75 14.6478 3.75 14.25V3.75Z"
                  stroke="#6B7280"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.75 5.25H11.25"
                  stroke="#6B7280"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.75 8.25H11.25"
                  stroke="#6B7280"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.75 11.25H9.75"
                  stroke="#6B7280"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_215_2617">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>

            <p>{`${totalTests} Tests`}</p>
          </div>

          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <g clipPath="url(#clip0_215_2625)">
                <path
                  d="M3.75 5.25C3.75 6.04565 4.06607 6.80871 4.62868 7.37132C5.19129 7.93393 5.95435 8.25 6.75 8.25C7.54565 8.25 8.30871 7.93393 8.87132 7.37132C9.43393 6.80871 9.75 6.04565 9.75 5.25C9.75 4.45435 9.43393 3.69129 8.87132 3.12868C8.30871 2.56607 7.54565 2.25 6.75 2.25C5.95435 2.25 5.19129 2.56607 4.62868 3.12868C4.06607 3.69129 3.75 4.45435 3.75 5.25Z"
                  stroke="#6B7280"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.25 15.75V14.25C2.25 13.4544 2.56607 12.6913 3.12868 12.1287C3.69129 11.5661 4.45435 11.25 5.25 11.25H8.25C9.04565 11.25 9.80871 11.5661 10.3713 12.1287C10.9339 12.6913 11.25 13.4544 11.25 14.25V15.75"
                  stroke="#6B7280"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 2.34766C12.6453 2.51288 13.2173 2.88818 13.6257 3.41439C14.0342 3.9406 14.2559 4.58778 14.2559 5.25391C14.2559 5.92003 14.0342 6.56722 13.6257 7.09342C13.2173 7.61963 12.6453 7.99493 12 8.16016"
                  stroke="#6B7280"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.75 15.7498V14.2498C15.7462 13.5877 15.5234 12.9454 15.1165 12.4231C14.7095 11.9008 14.1411 11.5278 13.5 11.3623"
                  stroke="#6B7280"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_215_2625">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <p>{`${totalStudents} Students`}</p>
          </div>
        </div>
        <button
          className="pt-3 font-medium text-[#0E1629] text-sm rounded-[0.75rem] border border-[#0E1629] w-[18rem] flex items-center justify-center py-2 px-2.5 cursor-pointer transition-colors duration-300 hover:bg-[#0E1629] hover:text-white"
        >
          Explore Test Series
        </button>
      </div>
    </div>
  );
}
