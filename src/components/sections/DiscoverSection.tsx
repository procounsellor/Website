import { DiscoverCard, type DiscoverCardData } from "../cards/DiscoverCard";
import { Badge } from "../ui";

const discoverItems: DiscoverCardData[] = [
  {
    tag: "Counsellors",
    title: "Find the best guidance from top counsellors",
    description: "Connect with experts who can help you navigate your career path.",
    imageUrl: "/discover-imageCounselor2.jpg",
    layout: "vertical",
  },
  {
    tag: "Colleges",
    title: "Explore top colleges and universities",
    description: "Discover institutions that match your career goals.",
    imageUrl: "/discover-iit-roorkee.jpg",
    layout: "image-right",
  },
  {
    tag: "Exams",
    title: "Prepare for your upcoming entrance exams",
    description: "Access resources and strategies to top your exams.",
    imageUrl: "/discover-exam.jpg",
    layout: "image-left",
  },
  {
    tag: "Courses",
    title: "Discover courses that align with your passion",
    description: "Browse a wide range of courses to skill up and advance.",
    imageUrl: "/discover-courses.jpg",
    layout: "image-right",
  },
]

export function DiscoverSection(){
  const firstItem = discoverItems[0];
  const otherItems = discoverItems.slice(1);

  return(
    <section 
        className="w-full py-8 px-4"
        style={{background: "linear-gradient(180deg, rgba(236,128,61,0.1) 0%, rgba(236,128,61,0.02) 100%)"}}
        >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-black mb-8">
          Discover
        </h2>

        {/* Mobile Layout - Your hardcoded version */}
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          <div className="h-[99px] flex bg-[#FFFFFF] rounded-[12px] gap-3 p-1">
                <img src="/discover-imageCounselor2.jpg" alt="counselor_discover" 
                className="w-[98px] h-[91px] rounded-[12px]"
              />
              <div className="max-w-[198px]">
                <Badge
                className="text-[#13097D] bg-[#E7F0F9]"
                >Counselors</Badge>
                   <p className="font-semibold text-xs">Find the best guidance from top counsellors</p>
                   <p className="font-normal text-xs">Connect with experts who can help you navigate</p>
              </div>
          </div>

           <div className="h-[99px] flex justify-between bg-[#FFFFFF] rounded-[12px] p-0.5">
                <div className="max-w-[198px] pl-2.5">
                <Badge
                className="text-[#13097D] bg-[#E7F0F9]"
                >Colleges</Badge>
                   <p className="font-semibold text-xs">Explore top colleges and universities.</p>
                   <p className="font-normal text-xs">Discover institutions that match your career goals.</p>
              </div>

              <img src="/discover-iit-roorkee.jpg" alt="counselor_discover" 
                className="w-[98px] h-[91px] rounded-[12px]"
              />
          </div>

          <div className="h-[99px] flex bg-[#FFFFFF] rounded-[12px] gap-3 p-1">
              <img src="/discover-courses.jpg" alt="counselor_discover" 
                className="w-[98px] h-[91px] rounded-[12px]"
              />
              <div className="max-w-[198px]">
                <Badge
                className="text-[#13097D] bg-[#E7F0F9]"
                >Courses</Badge>
                   <p className="font-semibold text-xs">Discover courses that align with your passion</p>
                   <p className="font-normal text-xs">Browse a wide range of courses to skill up and advance.</p>
              </div>
          </div>

          <div className="h-[99px] flex justify-between bg-[#FFFFFF] rounded-[12px] p-1">
               <div className="max-w-[198px]">
                <Badge
                className="text-[#13097D] bg-[#E7F0F9]"
                >Exams</Badge>
                   <p className="font-semibold text-xs">Prepare for your upcoming entrance exams</p>
                   <p className="font-normal text-xs">Access resources and strategies to top your exams.</p>
              </div>
                <img src="/discover-exam.jpg" alt="counselor_discover" 
                className="w-[98px] h-[91px] rounded-[12px]"
              />
          </div>
        </div>

        {/* Desktop Layout - Your original DiscoverCard layout (unchanged) */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-4">
          <DiscoverCard card={firstItem} hFull />
          <div className="flex flex-col gap-3">
            {otherItems.map((item, index) => (
              <DiscoverCard key={index} card={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}