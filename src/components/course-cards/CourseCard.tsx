import type { CourseType } from "@/types/course";
import { Bookmark } from "lucide-react";

interface propsType {
  course: CourseType;
  role: "user" | "student" | "counselor";
  onBookmark?: (courseId: string) => void;
  showBookmark?: boolean;
}

export default function CourseCard({ course, role, onBookmark, showBookmark = false }: propsType) {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookmark) {
      onBookmark(course.id);
    }
  };

  return (
    <div className="relative flex flex-col gap-3 max-w-56 p-3 border-[#efefef] border rounded-[0.75rem] bg-white">
      <img src={course.image} alt="" className="max-w-50" />
      {showBookmark && (role === 'user' || role === 'student') && (
        <button
          onClick={handleBookmarkClick}
          aria-label="Bookmark course"
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition-colors hover:bg-black/50"
        >
          <Bookmark className={`h-4 w-4 text-white transition-colors ${course.isBookmarked ? 'fill-current' : ''}`} />
        </button>
      )}
      <p className="flex justify-between lg:text-[1rem] font-medium text-[#718EBF]">
        {course.subject}
        {course.rating && course.reviews && (
          <span className="flex text-[#343C6A]">
            {course.rating}
            <div className="text-[#3D3D3D] font-normal">({course.reviews})</div>
          </span>
        )}
      </p>
      <h1 className="text-[#242645] font-semibold text-[0.90rem] md:text-[1rem] lg:text-[1.25rem]">{course.name}- Name</h1>

      <div className="flex gap-0.5 items-center">
        <img src="/coin.svg" alt="" />
        <h2 className="font-semibold text-transparent text-[0.90rem] md:text-[1rem] lg:txt-[1.25rem] bg-clip-text bg-gradient-to-r from-[#072EB1] to-[#03134B]">{course.price} Procoins</h2>
      </div>
    </div>
  );
}
