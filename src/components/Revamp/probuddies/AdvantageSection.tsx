import AdvantageCard from "./AdvantageCard";

const advantages = [
  {
    title: "Real Insider Perspective",
    description:
      "Connect with students already studying at your target college. Get honest, unfiltered insights about campus life, academics, and what admission really looks like from someone who's been through it.",
  },
  {
    title: "Know Before You Go",
    description:
      "Explore hostel life, faculty quality, extracurricular opportunities, and the true campus culture — straight from a ProBuddy who lives it every day. Make your college decision with complete confidence.",
  },
  {
    title: "Peer-to-Peer Admission Help",
    description:
      "ProBuddies have walked the same path you're on. They can guide you through entrance exam prep, document checklists, college interviews, and share tips that no brochure will ever tell you.",
  },
];

export default function AdvantageSection() {
  return (
    <div>
      {/* mobile view */}
      <div className="flex flex-col w-full p-5 md:hidden">

         <div className="flex flex-col gap-3">
            <div className="flex items-start">
              <img src="/icon.svg" alt="icon_avg" className="w-[138px]" />
            </div>

            <h1 className="text-(--text-main) text-xs font-medium w-full">
              Why connect with a ProBuddy? Real students, real college stories —
              get the honest inside view before you decide.
            </h1>
          </div>

        <div className="grid  grid-rows-3 gap-3 pt-5">
          <div className="bg-white flex flex-col gap-1 rounded-[8px]  h-fit border border-[#EDEDED] overflow-clip p-3">
            <img src="/Frame.svg" alt="avvantage_frame_image" className="h-6 w-6" />
            <h1 className="text-sm font-semibold text(--text-main)">{advantages[0].title}</h1>
            <p className="text-xs font-medium text-(--text-muted)">{advantages[0].description}</p>
          </div>

          <div className="bg-white  flex flex-col gap-1 rounded-[8px]  h-fit border border-[#EDEDED] overflow-clip p-3">
            <img src="/Frame.svg" alt="avvantage_frame_image" className="h-6 w-6" />
            <h1 className="text-sm font-semibold text(--text-main)">{advantages[1].title}</h1>
            <p className="text-xs font-medium text-(--text-muted)">{advantages[1].description}</p>
          </div>

           <div className="bg-white  flex flex-col gap-1 rounded-[8px] w-full h-fit border border-[#EDEDED] overflow-clip p-3">
            <img src="/Frame.svg" alt="avvantage_frame_image" className="h-6 w-6" />
            <h1 className="text-sm font-semibold text(--text-main)">{advantages[1].title}</h1>
            <p className="text-xs font-medium text-(--text-muted)">{advantages[1].description}</p>
          </div>


        </div>

        <div>

        </div>

      </div>


      <div className="hidden md:flex flex-col gap-7 w-full py-10">
        <div className="flex justify-between mx-auto" style={{ width: 'calc(420px * 3 + 30px * 2)' }}>
          <div className="flex items-start">
            <img src="/icon.svg" alt="icon_avg" className="items-start" />
          </div>

          <h1 className="text-(--text-main) text-2xl font-medium max-w-[682px]">
            Why connect with a ProBuddy? Real students, real college stories —
            get the honest inside view before you decide.
          </h1>
        </div>

        <div className="flex gap-[30px] justify-center">
          {advantages.map((adv, i) => (
            <AdvantageCard key={i} {...adv} />
          ))}
        </div>
      </div>
    </div>
  );
}
