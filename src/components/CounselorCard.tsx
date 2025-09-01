import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CircleCheckBig } from "lucide-react";
import { TbBriefcase2 } from "react-icons/tb";


export type Counselor = {
  name: string;
  description: string;
  experience: string;
  imageUrl: string;
  verified: boolean;
};

type CounselorCardProps = {
  counselor: Counselor;
};

export function CounselorCard({ counselor }: CounselorCardProps) {
  return (  
    <Card className="flex h-full w-full flex-col p-3 rounded-3xl cursor-pointer">
      <div className="overflow-hidden rounded-2xl">
        <img
          src={counselor.imageUrl}
          alt={`Photo of ${counselor.name}`}
          className="aspect-square h-[90%] w-full object-cover rounded-2xl"
        />
      </div>

      <div className="flex flex-col gap-2 -mt-10">
      <CardHeader className="p-0 gap-0.5">
        <CardTitle className="font-light text-2xl text-[#343C6A] tracking-wider">{counselor.name}</CardTitle>
        <CardDescription className="text-[#718EBF] text-xl tracking-wider">{counselor.description}</CardDescription>
      </CardHeader>
        <div className="h-px bg-gray-100" />
      <CardFooter className="flex justify-between p-0 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5 text-[#7EE655]">
          <CircleCheckBig className="h-4 w-4" />
          <span className="font-medium text-black">Verified</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#4471FF]">
          <TbBriefcase2 className="h-4 w-4" />
          <span className="text-black">{counselor.experience}</span>
        </div>
      </CardFooter>
      </div>
    </Card>
  );
}