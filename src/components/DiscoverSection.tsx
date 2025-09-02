import { DiscoverCard, type DiscoverCardData } from "./DiscoverCard";

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
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-black mb-8">
          Discover
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
