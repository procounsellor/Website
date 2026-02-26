import { ArrowRight } from 'lucide-react';

const AdityaBanner = () => {
  return (
    <div 
      className="relative w-full max-w-[648px] h-[265px] rounded-2xl overflow-hidden shrink-0"
      style={{
        background: 'linear-gradient(90deg, #DA9BC0 -25.31%, #FFFFFF 119.95%)'
      }}
    >
      <div className="absolute top-6 left-6 flex flex-col items-start z-10">
        <h2 className="w-[433px] font-poppins font-bold text-[24px] leading-[170%] text-[#634657]">
          Explore Our Comprehensive Range of Courses By Aaditya
        </h2>

        <div className="mt-3.5 flex flex-col gap-3">
          <div className="flex flex-row gap-4">
            <div className="flex flex-row items-center gap-2">
              <img src="sparkles.svg" alt="sparkles" className="w-[18px] h-[18px] text-[#634657] fill-[#634657]"/>
              <span className="font-poppins font-medium text-[12px] leading-none text-[#634657]">
                Flexible learning paths
              </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <img src="sparkles.svg" alt="sparkles" className="w-[18px] h-[18px] text-[#634657] fill-[#634657]"/>
              <span className="font-poppins font-medium text-[12px] leading-none text-[#634657]">
                Expert-led practical learning
              </span>
            </div>
          </div>
          
          <div className="flex flex-row items-center gap-2">
            <img src="sparkles.svg" alt="sparkles" className="w-[18px] h-[18px] text-[#634657] fill-[#634657]"/>
            <span className="font-poppins font-medium text-[12px] leading-none text-[#634657]">
              Industry-relevant career programs
            </span>
          </div>
        </div>

        <div className="mt-3.5 w-[400px]">
          <p className="font-poppins font-normal text-[12px] leading-none text-[#021028]">
            Crack admissions with structured support along <span className="font-semibold text-[#634657]">56K subscribers</span>
          </p>
        </div>

        <div className="mt-4 flex flex-row items-center">
          <div className="flex flex-row items-center gap-4">
            <a 
              href="#" 
              className="font-poppins font-semibold text-[14px] leading-none text-[#021028] underline decoration-solid decoration-auto underline-offset-auto"
            >
              Live Sessions
            </a>
            <button className="flex items-center justify-center w-10 h-[35.6px] rounded-[5px] bg-[#021028] hover:bg-[#1a2b4d] transition-colors">
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>

          <a 
             href="#"
             className="ml-[17px] flex items-center justify-center w-[136px] h-[35px] bg-[#634657] rounded-xl hover:bg-[#523848] transition-colors"
          >
             <span className="font-poppins font-semibold text-[14px] leading-none text-white underline decoration-solid decoration-auto underline-offset-auto">
                Explore courses
             </span>
          </a>

        </div>
      </div>

      <img 
        src="/aditya.svg" 
        alt="Aaditya"
        className="absolute top-[50px] left-[424px] w-[220px] h-[215px] z-0 object-contain"
      />

    </div>
  );
};

export default AdityaBanner;