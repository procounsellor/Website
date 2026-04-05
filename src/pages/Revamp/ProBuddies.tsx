import { probuddiesApi } from "@/api/pro-buddies";
import AdvantageSection from "@/components/Revamp/probuddies/AdvantageSection";
import CollegeSection from "@/components/Revamp/probuddies/CollegeSection";
import ProBuddiesSection from "@/components/Revamp/probuddies/ProBuddiesSection";
import Stories from "@/components/Revamp/probuddies/Stories";
import { useAuthStore } from "@/store/AuthStore";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";

export default function ProBuddies() {
  const {userId} = useAuthStore()
  const { data: probuddies = [] } = useQuery({
  queryKey: ['revamp-probuddies', userId],
        queryFn: () => probuddiesApi.listing(userId as string),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });




  return (
    <div className="">
        <div className="w-full h-66 md:h-130 bg-[url('/probuddiesbg.jpg')] bg-cover bg-center">
      <div className="flex flex-col gap-10 items-center justify-center w-full h-full bg-[#0E1629A6]">
        <div className="relative hidden md:block">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)" />
          <input
            type="text"
            name="searchbox"
            id="search"
            placeholder="search for college"
            className="bg-white rounded-[12px] h-14 w-114 py-4 pl-14 pr-4 placeholder:text-(--text-muted)"
          />
        </div>

        <div className="flex flex-col gap-3 md:gap-6 justify-center items-center">
          <h1 className="text-white text-2xl md:text-6xl font-bold">ProBuddies</h1>
          <p className="max-w-188.25 text-wrap text-center text-sm md:text-2xl font-normal md:font-medium text-[#9CA3AF]">
            Bridging the gap between ambitious students and expert education counsellors
          </p>

           <div className="relative md:hidden">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted) h-4 w-4" />
          <input
            type="text"
            name="searchbox"
            id="search"
            placeholder="search for college"
            className="bg-white rounded-[12px] h-8 w-60 py-4 pl-14 pr-4 text-xs placeholder:text-(--text-muted)"
          />
        </div>
        </div>
      </div>
    </div>

    <div className=" bg-[#C6DDF040] flex flex-col pb-20">
      <CollegeSection/>
      <ProBuddiesSection probuddyList={probuddies}/>
      <AdvantageSection/>
      <Stories/>
    </div>

    </div>
  );
}
