import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export type CollegeCardData = {
  id: string;
  name: string;
  imageUrl: string;
  city: string;
  type: string;
};

type CollegeCardProps = {
  college: CollegeCardData;
};

export function CollegeCard({ college }: CollegeCardProps){
  return (
    <Link to={`/colleges/${college.id}`} className="flex w-full max-w-sm flex-col overflow-hidden cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className="relative">
        <img
          src={college.imageUrl}
          alt={`Image of ${college.name}`}
          className="h-50 w-full object-contain"
        />
        <span className="absolute right-3 top-3 rounded-xl bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xl">
          {college.type}
        </span>
      </div>

      <div className="flex flex-grow flex-col p-4">
        <h3 className="mb-2 text-lg font-bold text-[#242645] leading-snug">
          {college.name}
        </h3>

        <div className="mt-auto flex items-center text-sm text-[#8C8CA1]">
          <MapPin className="mr-2 h-4 w-4"/>
          <span>{college.city}</span>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-3 text-center">
          <span className="text-sm font-semibold underline text-[#718EBF] hover:text-blue-800">
            View College
          </span>
        </div>
      </div>
    </Link>
  );
}