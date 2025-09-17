import { DiscoverCard, type DiscoverCardData } from "../cards/DiscoverCard";
import { Badge } from "../ui";
import { useNavigate } from "react-router-dom";

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
    layout: "image-left",
  },
  {
    tag: "Exams",
    title: "Prepare for your upcoming entrance exams",
    description: "Access resources and strategies to top your exams.",
    imageUrl: "/discover-exam.jpg",
    layout: "image-right",
  },
  {
    tag: "Courses",
    title: "Discover courses that align with your passion",
    description: "Browse a wide range of courses to skill up and advance.",
    imageUrl: "/discover-courses.jpg",
    layout: "image-left",
  },
]

export function DiscoverSection(){
  const firstItem = discoverItems[0];
  const otherItems = discoverItems.slice(1);
  const navigate = useNavigate();

  const handleDiscoverClick = (tag: string) => {
    switch(tag.toLowerCase()) {
      case 'counsellors':
      case 'counselors':
        navigate('/counselors');
        break;
      case 'colleges':
        navigate('/colleges');
        break;
      case 'exams':
        navigate('/exams');
        break;
      case 'courses':
        navigate('/courses');
        break;
      default:
        break;
    }
  };

  return(
    <section 
        className="w-full py-8"
        style={{background: "linear-gradient(180deg, rgba(236,128,61,0.1) 0%, rgba(236,128,61,0.02) 100%)"}}
        >
      <div className="max-w-[1200px] mx-auto px-5 lg:rounded-[20px] lg:p-10 lg:px-10">
        <h2 className="text-3xl lg:text-2xl font-semibold text-black mb-8">
          Discover
        </h2>

        {/* Mobile Layout - Your hardcoded version */}
        <div className="grid grid-cols-1 gap-3 lg:hidden">
          <div 
            className="w-full h-[99px] flex bg-[#FFFFFF] items-center rounded-[12px] gap-3 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleDiscoverClick('counselors')}
          >
                <img src="/discover-imageCounselor2.jpg" alt="counselor_discover" 
                className="w-[98px] h-[91px] rounded-[12px] pl-1"
              />
              <div className="max-w-[198px] ">
                <Badge
                className="text-[#13097D] bg-[#E7F0F9] text-[11px] px-2 py-0.5"
                >Counselors</Badge>
                   <p className="font-semibold text-xs">Find the best guidance from top counsellors</p>
                   <p className="font-normal text-xs">Connect with experts who can help you navigate</p>
              </div>
          </div>

           <div 
             className="h-[99px] flex justify-between bg-[#FFFFFF] rounded-[12px] p-0.5 cursor-pointer hover:shadow-lg transition-shadow"
             onClick={() => handleDiscoverClick('colleges')}
           >
                <div className="max-w-[198px] pl-2.5 ">
                <Badge
                className="text-[#13097D] bg-[#E7F0F9] px-2 py-0.5"
                >Colleges</Badge>
                   <p className="font-semibold text-xs">Explore top colleges and universities.</p>
                   <p className="font-normal text-xs">Discover institutions that match your career goals.</p>
              </div>

              <img src="/discover-iit-roorkee.jpg" alt="counselor_discover" 
                className="w-[98px] h-[91px] rounded-[12px]"
              />
          </div>

          <div 
            className="h-[99px] flex bg-[#FFFFFF] items-center rounded-[12px] gap-3 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleDiscoverClick('courses')}
          >
              <img src="/discover-courses.jpg" alt="counselor_discover" 
                className="w-[98px] h-[91px] rounded-[12px] pl-1"
              />
              <div className="max-w-[198px]">
                <Badge
                className="text-[#13097D] bg-[#E7F0F9] py-0.5 px-2"
                >Courses</Badge>
                   <p className="font-semibold text-xs ">Discover courses that align with your passion</p>
                   <p className="font-normal text-xs">Browse a wide range of courses to skill up and advance.</p>
              </div>
          </div>

          <div 
            className="h-[99px] flex justify-between bg-[#FFFFFF] rounded-[12px] cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleDiscoverClick('exams')}
          >
               <div className="max-w-[198px]">
                <Badge
                className="text-[#13097D] bg-[#E7F0F9] py-0.5 px-2"
                >Exams</Badge>
                   <p className="font-semibold text-xs">Prepare for your upcoming entrance exams</p>
                   <p className="font-normal text-xs">Access resources and strategies to top your exams.</p>
              </div>
                <img src="/discover-exam.jpg" alt="counselor_discover" 
                className="w-[98px] h-[91px] rounded-[12px]"
              />
          </div>
        </div>


        <div className="hidden lg:grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <DiscoverCard 
              card={firstItem} 
              hFull
              onClick={() => handleDiscoverClick(firstItem.tag)}
            />
          </div>
          <div className="lg:col-span-3 flex flex-col gap-4 justify-between">
            {otherItems.map((item, index) => (
              <DiscoverCard 
                key={index} 
                card={item} 
                onClick={() => handleDiscoverClick(item.tag)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}