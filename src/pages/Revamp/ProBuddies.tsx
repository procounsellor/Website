import AdvantageCard from "@/components/Revamp/probuddies/AdvantageCard";
import AdvantageSection from "@/components/Revamp/probuddies/AdvantageSection";
import Stories from "@/components/Revamp/probuddies/Stories";
import { SearchIcon } from "lucide-react";

export default function ProBuddies() {
  return (
    <div className="">
        <div className="w-full h-[520px] bg-[url('/probuddiesbg.jpg')] bg-cover bg-center">
      <div className="flex flex-col gap-10 items-center justify-center w-full h-full bg-[#0E1629A6]/95">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)" />
          <input
            type="text"
            name="searchbox"
            id="search"
            placeholder="search for college"
            className="bg-white rounded-[12px] h-14 w-[456px] py-4 pl-[56px] pr-4 placeholder:text-(--text-muted)"
          />
        </div>

        <div className="flex flex-col gap-6 justify-center items-center">
          <h1 className="text-white text-6xl font-bold">ProBuddies</h1>
          <p className="max-w-[753px] text-wrap text-center text-2xl font-medium text-[#9CA3AF]">
            Lorem ipsum dolor sit amet consectetur. Senectus arcu cras at risus
            a tortor ut quam in. Lorem ipsum dolor.
          </p>
        </div>
      </div>
    </div>

    <div className=" bg-[#C6DDF040] flex flex-col pb-20">
      <AdvantageSection/>
      <Stories/>
    </div>

    </div>
  );
}
