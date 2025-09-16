import { Briefcase } from "lucide-react";

export type CourseCardData = {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
  duration: string;
};

type CourseCardProps = {
  course: CourseCardData;
};

export function CourseCard({ course }: CourseCardProps){
  return (
    <div className="flex w-full max-w-sm flex-col overflow-hidden cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className="relative">
        <img
          src={course.imageUrl}
          alt={`Image for ${course.name}`}
          className="h-50 w-full object-cover"
        />
        <span className="absolute right-3 top-3 rounded-xl bg-white/30 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xl">
          {course.type}
        </span>
      </div>

      <div className="flex flex-grow flex-col p-4">
        <h3 className="mb-2 text-lg font-bold text-[#242645] leading-snug">
          {course.name}
        </h3>

        <div className="mt-auto flex items-center text-sm text-[#8C8CA1]">
          <Briefcase className="mr-2 h-4 w-4"/>
          <span>{course.duration}</span>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-3 text-center">
          <a
            href="#"
            className="text-sm font-semibold underline text-[#718EBF] hover:text-blue-800"
          >
            View Course
          </a>
        </div>
      </div>
    </div>
  );
}