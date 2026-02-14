import { ArrowRight } from 'lucide-react';


const GyanDhanBanner = () => {
  return (
    <div 
      className="relative w-full max-w-[648px] h-[265px] rounded-2xl overflow-hidden shrink-0"
      style={{
        background: 'linear-gradient(90deg, #81C041 -84.26%, #FFFFFF 99.51%)'
      }}
    >
      <div className="absolute top-6 left-6 flex flex-col items-start z-10">
        
        <h2 className="w-[417px] font-poppins font-bold text-[24px] leading-[170%] text-[#48387C]">
          Plan your education journey with clarity and confidence to
        </h2>

        <div className="mt-3.5 flex flex-col gap-3">
          <div className="flex flex-row gap-4">
            <div className="flex flex-row items-center gap-2">
              <img src="sparkles.svg" alt="sparkle" className="w-[18px] h-[18px] text-[#48387C] fill-[#48387C]" />
              <span className="font-poppins font-medium text-[12px] leading-none text-[#48387C]">
                Access the right loans
              </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <img src="sparkles.svg" alt="sparkle" className="w-[18px] h-[18px] text-[#48387C] fill-[#48387C]" />
              <span className="font-poppins font-medium text-[12px] leading-none text-[#48387C]">
                Get expert advice
              </span>
            </div>
          </div>
          
          <div className="flex flex-row items-center gap-2">
            <img src="sparkles.svg" alt="sparkle" className="w-[18px] h-[18px] text-[#48387C] fill-[#48387C]" />
            <span className="font-poppins font-medium text-[12px] leading-none text-[#48387C]">
              A supportive network
            </span>
          </div>
        </div>

        <div className="mt-3.5 w-[380px]">
          <p className="font-poppins font-medium text-[12px] leading-none text-[#181818]">
            So you can focus on what truly matters: <span className="font-bold text-[#48387C]">Building Your Future.</span>
          </p>
        </div>

        <div className="mt-[15px] flex flex-row items-center gap-4">
          <a 
            href="#" 
            className="font-poppins font-semibold text-[14px] leading-none text-[#48387C] underline decoration-solid decoration-auto underline-offset-auto"
          >
            Check your Loan Eligibility
          </a>
          
          <button className="flex items-center justify-center w-10 h-[35.6px] rounded-[5px] bg-[#48387C] hover:bg-[#3b2d66] transition-colors">
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <img 
        src="/gyandhanlogo.svg" 
        alt="GyanDhan Logo"
        className="absolute top-7 left-[536px] w-[84px] h-[71.65px] z-20"
      />

      <img 
        src="/gyandhan2.svg" 
        alt="Education Illustration"
        className="absolute top-[118px] left-[408px] w-[229px] h-[135px] z-10"
      />

    </div>
  );
};

export default GyanDhanBanner;