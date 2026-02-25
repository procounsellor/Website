import CollegeCard from "./CollegeCard";

export default function College() {
  const colleges = [
    {
      name: "Indian Institute of Technology Mumbai",
      description: "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
      logoUrl: "/college.jpg"
    },
    {
      name: "Indian Institute of Technology Mumbai",
      description: "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
      logoUrl: "/college.jpg"
    },
    {
      name: "Indian Institute of Technology Mumbai",
      description: "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
      logoUrl: "/college.jpg"
    },
    {
      name: "Indian Institute of Technology Mumbai",
      description: "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
      logoUrl: "/college.jpg"
    }
  ];

  return (
    <div className="bg-[#C6DDF040] w-full py-[60px]">
      <div className="max-w-[1440px] mx-auto px-[60px]">
        {/* Header */}
        <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-md mb-6 w-fit">
          <div className="w-4 h-4 bg-[#0E1629]" />
          <p className="font-[Poppins] font-semibold text-[14px] text-[#0E1629] uppercase tracking-wider">
            COLLEGES
          </p>
        </div>

        {/* College Cards */}
        <div className="flex flex-col gap-6">
          {colleges.map((college, index) => (
            <CollegeCard
              key={index}
              name={college.name}
              description={college.description}
              logoUrl={college.logoUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}