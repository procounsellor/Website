import AdvantageCard from "./AdvantageCard";

export default function AdvantageSection() {
  return (
    <div className="flex flex-col gap-7  w-full h-[596px] py-10 ">
      <div className="flex justify-between mx-auto" style={{ width: 'calc(420px * 3 + 30px * 2)' }}>
        <div className="flex items-start">
          <img src="/icon.svg" alt="icon_avg" className="items-start" />
        </div>

        <h1 className="text-(--text-main) text-2xl font-medium max-w-[682px] max-h-[108px]">
          Discover curated programs across mental wellness, assessments,
          admissions, and upskilling led by experienced professionals, built
          around your needs.
        </h1>
      </div>

      <div className="flex gap-[30px] justify-center">
        <AdvantageCard />
        <AdvantageCard />
        <AdvantageCard />
      </div>
    </div>
  );
}
