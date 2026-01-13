const INFRASTRUCTURE_DATA = [
  {
    title: "Academic Infrastructure",
    description: "Modern classrooms, auditoriums, library, and computer labs",
    items: [
      {
        label: "Classrooms",
        text: "Air-conditioned with modern audio-visual aids, LCD projectors and public address systems"
      },
      {
        label: "Auditoriums",
        text: "Multiple halls with largest seating 1000+ people for lectures and events"
      },
      {
        label: "Library",
        text: "Over 150,000 books, journals, e-resources and online databases like EBSCO"
      },
      {
        label: "Computer Labs",
        text: "24/7 access with high-speed internet and latest software for analytics and simulations"
      }
    ]
  },
  {
    title: "Hostel & Residential",
    description: "Secure accommodation with mess and cafeteria facilities",
    items: [
      {
        label: "Accommodation",
        text: "Separate and secure hostel accommodation for male and female students with well-furnished rooms"
      },
      {
        label: "Mess & Cafeteria",
        text: "Multi-cuisine dining hall with hygienic and nutritious meals, plus cafeteria for snacks"
      },
      {
        label: "Connectivity",
        text: "Wi-Fi enabled throughout campus including hostel areas"
      }
    ]
  },
  {
    title: "Sports & Recreation",
    description: "Swimming pool, gymnasium, and various sports facilities",
    items: [
      {
        label: "Health & Fitness",
        text: "Modern swimming pool and well-equipped gymnasium for physical fitness"
      },
      {
        label: "Outdoor Sports",
        text: "Basketball courts, volleyball courts, and grounds for football and cricket"
      },
      {
        label: "Indoor Games",
        text: "Facilities for table tennis, carrom, chess and other recreational activities"
      }
    ]
  },
  {
    title: "Other Amenities",
    description: "Medical facilities, convenience store, and essential services",
    items: [
      {
        label: "Medical Facilities",
        text: "Healthcare center with resident doctor and ambulance facility for medical emergencies"
      },
      {
        label: "Convenience Store",
        text: "On-campus tuck shop catering to daily needs of students"
      }
    ]
  }
];

const InfrastructureTab = () => {
  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      
      <div 
        className="bg-white rounded-2xl border border-[#EFEFEF] shadow-[0px_0px_4px_0px_#23232326] p-3.5 md:p-4"
      >
        <h3 
          className="text-[#343C6A] font-semibold text-[18px] md:text-[20px] leading-[125%]" 
          style={{ fontFamily: 'Montserrat' }}
        >
          Overview
        </h3>
        <p 
          className="text-[#718EBF] font-medium text-[14px] md:text-[16px] leading-[125%] mt-2" 
          style={{ fontFamily: 'Montserrat' }}
        >
          IIT Delhi boasts a sprawling 325-acre campus with state-of-the-art infrastructure. It features modern academic blocks, advanced research laboratories, and comprehensive residential facilities, creating a self-sustained ecosystem for holistic learning and innovation.
        </p>
      </div>

      <div 
        className="bg-white rounded-2xl border border-[#EFEFEF] shadow-[0px_0px_4px_0px_#23232326] flex flex-col gap-6 md:gap-8 p-3.5 md:p-4"
      >
        {INFRASTRUCTURE_DATA.map((section, index) => (
          <div key={index} className="flex flex-col gap-2">
            
            <h3 
              className="text-[#343C6A] font-semibold text-[18px] md:text-[20px] leading-[125%]" 
              style={{ fontFamily: 'Montserrat' }}
            >
              {section.title}
            </h3>
            
            <p 
              className="text-[#718EBF] font-medium text-[14px] md:text-[16px] leading-[125%] mb-1 md:mb-2" 
              style={{ fontFamily: 'Montserrat' }}
            >
              {section.description}
            </p>

            <div className="flex flex-col gap-3 md:gap-4 pl-2">
              {section.items.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#343C6A] mt-1 shrink-0"></span>
                    <span 
                      className="text-[#343C6A] font-semibold text-[14px] md:text-[16px] leading-[125%]"
                      style={{ fontFamily: 'Montserrat' }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <p 
                    className="text-[#718EBF] font-medium text-[14px] md:text-[16px] leading-[125%] pl-3.5"
                    style={{ fontFamily: 'Montserrat' }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfrastructureTab;