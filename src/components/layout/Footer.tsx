import { Link } from "react-router-dom";
import { 
  locationIcon, 
  phoneIcon, 
  emailIcon, 
  linkedinIcon, 
  facebookIcon, 
  instagramIcon, 
  twitterIcon 
} from "@/assets/icons";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#FCEDE3] to-[#F5C3A3] text-slate-700">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 md:px-16 lg:px-[125px] py-6 sm:py-10">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 md:gap-[50px] md:grid-cols-12">
          <div className="md:col-span-4 space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Logo"
                className="h-8 sm:h-10 lg:h-12 object-contain flex-shrink-0"
              />
              <div className="flex flex-col leading-tight">
                <h1 className="text-xl sm:text-2xl font-bold text-orange-600">ProCounsel</h1>
                <span className="text-xs text-gray-500">By CatalystAI</span>
              </div>
            </div>
            
            <p className="text-sm sm:text-md leading-tight text-[#232323] max-w-full sm:max-w-[338px]">
              Discover the best colleges and courses in India. Your gateway to quality
              education and bright career prospects.
            </p>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <img src={locationIcon} alt="Location" className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 mt-0.5" />
                <p className="font-montserrat font-normal text-sm sm:text-base leading-tight text-[#180033] max-w-full sm:max-w-[280px]">
                  Office No. 327, 3rd Floor, Ceras Imperium Rise, MIDC Phase 2, Main Road,
                  Near Ceras Imperium Rise Plaza, Hinjawadi, Pune, Maharashtra - 411057
                </p>
              </div>
              <div className="flex items-center gap-3">
                <img src={phoneIcon} alt="Phone" className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                <p className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033]">7004794849, 9470988669</p>
              </div>
              <div className="flex items-center gap-3">
                <img src={emailIcon} alt="Email" className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                <a href="mailto:hr@procounsel.co.in" className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:underline break-all sm:break-normal">hr@procounsel.co.in</a>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="md:h-[270px] flex flex-col">
              <h4 className="mb-4 sm:mb-6 font-montserrat font-medium text-lg sm:text-xl leading-none text-[#180033]">Useful Links</h4>
              <ul className="space-y-3 sm:space-y-6 flex-1">
                <li className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors cursor-pointer" >Colleges</li>
                <li className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors cursor-pointer" >Courses</li>
                <li className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors cursor-pointer" >Exams</li>
                <li className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors cursor-pointer" >About Us</li>
                <li className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors cursor-pointer" >Contact</li>
                <li className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors cursor-pointer" >Add College</li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="md:h-[270px] flex flex-col">
              <h4 className="mb-4 sm:mb-6 font-montserrat font-medium text-lg sm:text-xl leading-none text-[#180033]">Popular Categories</h4>
              <ul className="space-y-3 sm:space-y-6 flex-1">
                <li className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033]">Engineering</li>
                <li className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033]">Medical</li>
                <li className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033]">Management</li>
                <li className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033]">Design</li>
                <li className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033]">Science</li>
                <li className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033]">Arts</li>
              </ul>
            </div>
          </div>

 
          <div className="md:col-span-3">
            <div className="md:w-[198px] md:h-[270px] flex flex-col">
              <h4 className="mb-4 sm:mb-6 font-montserrat font-medium text-lg sm:text-xl leading-none text-[#180033]">Follow Us on</h4>
              <ul className="space-y-3 sm:space-y-6 flex-1">
                <li className="flex items-center gap-3">
                  <img src={linkedinIcon} alt="LinkedIn" className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0" />
                  <a href="#" aria-label="LinkedIn" className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors">LinkedIn</a>
                </li>
                <li className="flex items-center gap-3">
                  <img src={facebookIcon} alt="Facebook" className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0" />
                  <a href="#" aria-label="Facebook" className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors">Facebook</a>
                </li>
                <li className="flex items-center gap-3">
                  <img src={instagramIcon} alt="Instagram" className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0" />
                  <a href="#" aria-label="Instagram" className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors">Instagram</a>
                </li>
                <li className="flex items-center gap-3">
                  <img src={twitterIcon} alt="Twitter" className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0" />
                  <a href="#" aria-label="Twitter" className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors">Twitter</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 border-t border-[#6C696933] pt-4 sm:pt-6 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <p className="font-montserrat font-medium text-xs sm:text-sm leading-none text-[#180033]">© 2025 CATALYST TECHNOLOGY PRIVATE LIMITED. All rights reserved.</p>
            <p className="font-montserrat font-normal text-xs leading-none text-[#180033]">ProCounsel™ is a trademark of CATALYSTAI TECHNOLOGY PRIVATE LIMITED.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-4 md:mt-0">
            <Link className="font-montserrat font-medium text-xs sm:text-sm leading-none text-[#180033] hover:text-[#FA660F] transition-colors" to="/privacy-policy">Privacy Policy</Link>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <Link className="font-montserrat font-medium text-xs sm:text-sm leading-none text-[#180033] hover:text-[#FA660F] transition-colors" to="/terms">Terms of Service</Link>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <Link className="font-montserrat font-medium text-xs sm:text-sm leading-none text-[#180033] hover:text-[#FA660F] transition-colors" to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
