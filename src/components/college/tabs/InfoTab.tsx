import { useState } from 'react';
import { Globe, Phone, Mail } from 'lucide-react';

const InfoTab = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const description = "Indian Institute of Technology Delhi is one of the 23 IITs created to be Centres of Excellence for training, research and development in science, engineering and technology in India. Established as College of Engineering in 1961, the Institute was later declared an Institution of National Importance under the 'Institutes of Technology (Amendment) Act, 1963' and was renamed 'Indian Institute of Technology Delhi'. It has since then been accorded the status of a Deemed University with powers to decide its own academic policy, to conduct its own examinations, and to award its own degrees.";

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full">
      
      <div className="bg-white rounded-2xl border border-[#EFEFEF] shadow-[0px_0px_4px_0px_#23232326] p-4 md:p-6">
        <h3 className="text-[#343C6A] font-semibold text-[18px] md:text-[20px] leading-[125%]" style={{ fontFamily: 'Poppins' }}>
          About
        </h3>
        <div className="mt-3 md:mt-4 relative">
          <p 
            className={`text-[#718EBF] font-medium text-[14px] md:text-[16px] leading-[150%] transition-all duration-300 ${!isExpanded ? 'line-clamp-3' : ''}`}
            style={{ fontFamily: 'Poppins' }}
          >
            {description}
          </p>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#343C6A] font-semibold text-[14px] md:text-[16px] underline mt-1 cursor-pointer hover:text-[#242645]"
            style={{ fontFamily: 'Poppins' }}
          >
            {isExpanded ? 'View less' : 'View more'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EFEFEF] shadow-[0px_0px_4px_0px_#23232326] py-4 md:py-6 px-3 md:px-4">
        <div className="flex justify-between items-start px-1 md:px-8">
          
          <div className="flex flex-col items-center gap-2 md:gap-3 w-1/3">
            <div className="h-[35px] md:h-[50px] flex items-center justify-center">
              <img src="/nirf.png" alt="NIRF" className="h-full object-contain" />
            </div>
            <span className="text-[#232323] font-medium text-[10px] md:text-[16px] text-center leading-tight" style={{ fontFamily: 'Poppins' }}>
              NIRF Ranking 2025
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 md:gap-3 w-1/3">
             <div className="h-[35px] md:h-[50px] flex items-center justify-center">
              <img src="/naac.png" alt="NAAC" className="h-full object-contain" />
            </div>
            <span className="text-[#232323] font-medium text-[10px] md:text-[16px] text-center leading-tight" style={{ fontFamily: 'Poppins' }}>
              NAAC A++
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 md:gap-3 w-1/3">
             <div className="h-[35px] md:h-[50px] flex items-center justify-center">
              <img src="/aicte.png" alt="AICTE" className="h-full object-contain" />
            </div>
            <span className="text-[#232323] font-medium text-[10px] md:text-[16px] text-center leading-tight" style={{ fontFamily: 'Poppins' }}>
              AICTE Approved
            </span>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EFEFEF] shadow-[0px_0px_4px_0px_#23232326] p-4 md:p-6">
        <h3 className="text-[#343C6A] font-semibold text-[18px] md:text-[20px] leading-[125%]" style={{ fontFamily: 'Poppins' }}>
          Address
        </h3>
        <p className="text-[#718EBF] font-medium text-[14px] md:text-[16px] leading-[125%] mt-2 md:mt-3" style={{ fontFamily: 'Poppins' }}>
          Hauz Khas, New Delhi, Delhi 110016
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EFEFEF] shadow-[0px_0px_4px_0px_#23232326] p-4 md:p-6">
        <h3 className="text-[#343C6A] font-semibold text-[18px] md:text-[20px] leading-[125%] mb-4 md:mb-6" style={{ fontFamily: 'Poppins' }}>
          Contact
        </h3>
        
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-[26px] h-[26px] md:w-[30px] md:h-[30px] rounded-full bg-[#13097D1A] flex items-center justify-center shrink-0">
              <Globe className="text-[#13097D] w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#9D9FA1] font-medium text-[12px] md:text-[14px] leading-none mb-1" style={{ fontFamily: 'Poppins' }}>
                Website
              </span>
              <a href="https://www.iitd.ac.in" target="_blank" rel="noreferrer" className="text-[#2F3032] font-medium text-[14px] md:text-[16px] leading-none hover:text-[#13097D]" style={{ fontFamily: 'Poppins' }}>
                www.iitd.ac.in
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-[26px] h-[26px] md:w-[30px] md:h-[30px] rounded-full bg-[#13097D1A] flex items-center justify-center shrink-0">
              <Phone className="text-[#13097D] w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#9D9FA1] font-medium text-[12px] md:text-[14px] leading-none mb-1" style={{ fontFamily: 'Poppins' }}>
                Call
              </span>
              <span className="text-[#2F3032] font-medium text-[14px] md:text-[16px] leading-none" style={{ fontFamily: 'Poppins' }}>
                011-2659-7135
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-[26px] h-[26px] md:w-[30px] md:h-[30px] rounded-full bg-[#13097D1A] flex items-center justify-center shrink-0">
              <Mail className="text-[#13097D] w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#9D9FA1] font-medium text-[12px] md:text-[14px] leading-none mb-1" style={{ fontFamily: 'Poppins' }}>
                Email
              </span>
              <a href="mailto:webmaster@admin.iitd.ac.in" className="text-[#2F3032] font-medium text-[14px] md:text-[16px] leading-none hover:text-[#13097D]" style={{ fontFamily: 'Poppins' }}>
                webmaster@admin.iitd.ac.in
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default InfoTab;