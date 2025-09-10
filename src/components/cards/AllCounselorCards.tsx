import { Card, CardFooter } from "@/components/ui/card";
import { Star, MapPin } from "lucide-react";
import { TbBriefcase2 } from "react-icons/tb";

export type AllCounselor = {
  id: string;
  name: string;
  description: string;
  experience: string;
  imageUrl: string;
  location: string;
  rating: number;
  reviews: number;
  rate: string;
};

type CounselorCardProps = {
  counselor: AllCounselor;
};

export function AllCounselorCards({ counselor }: CounselorCardProps){
  return (
    <Card className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative -mb-2 w-full overflow-hidden rounded-xl aspect-square">
        <img
          src={counselor.imageUrl}
          alt={`Photo of ${counselor.name}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-grow flex-col justify-between gap-3">
        <div>
          <h3 className="truncate font-bold text-lg text-[#343C6A]">
            {counselor.name}
          </h3>
          <p className="truncate text-sm text-[#718EBF]">
            {counselor.description}
          </p>
          <div className="flex items-center mt-1 gap-1.5 text-xs text-[#718EBF] truncate pt-1">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{counselor.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm font-medium text-gray-700">
          <div className="flex items-center gap-1.5 text-gray-800">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-500"/>
            <span className="font-semibold">{counselor.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({counselor.reviews})</span>
          </div>

          <div className="flex items-center gap-1.5 text-blue-600">
            <TbBriefcase2 className="h-4 w-4" />
            <span>{counselor.experience}</span>
          </div>
        </div>

        <div className="h-px bg-gray-200 -mb-4"/>
        
        <CardFooter className="flex p-0 pt-3 -mb-2 items-center">
          <div className="flex items-center gap-2 w-full">
            <img
              src="/Procoin.jpg"
              alt="ProCoins icon"
              className="h-8 w-8"
            />
            <span
              className="text-black font-semibold whitespace-nowrap"
              style={{
                fontSize: 'clamp(14px, 3vw, 18px)'
              }}
            >
              {counselor.rate === 'N/A' ? (
                <span className="text-gray-500 text-sm">N/A</span>
              ) : (
                <>
                  {counselor.rate.split(' ')[0]} {counselor.rate.split(' ')[1]}
                  <span className="text-black text-xs font-bold">/Year</span>
                </>
              )}
            </span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}