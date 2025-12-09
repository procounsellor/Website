import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/AuthStore";
import toast from 'react-hot-toast';
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
  const { toggleCounselorSignup, role, user } = useAuthStore();
  
  const handleBecomeCounselor = () => {
    if (role === 'counselor' && user?.verified) {
      toast.error("You are already registered as a counselor!");
      return;
    }
    const hasSubmitted = localStorage.getItem('hasSubmittedCounselorApp') === 'true';
    if (hasSubmitted) {
       toast.error("Your application is already under review.");
       return;
    }
    toggleCounselorSignup();
  };
  
  return (
    <footer className="bg-linear-to-b from-[#ECEBF5] from-0% to-[#13097D4D] to-100% text-slate-700">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 md:px-16 lg:px-[125px] py-6 sm:py-10">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 md:gap-[50px] md:grid-cols-12">
          <div className="md:col-span-4 space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8 sm:h-10 lg:h-12 object-contain rounded-md shrink-0"
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
                <img src={locationIcon} alt="Location" className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 mt-0.5" />
                <p className="font-montserrat font-normal text-sm sm:text-base leading-tight text-[#180033] max-w-full sm:max-w-[280px]">
                  The Address Commercia, Shop No. 427, Near Hinjewadi Bridge, Wakad-411057
                </p>
              </div>
              <div className="flex items-center gap-3">
                <img src={phoneIcon} alt="Phone" className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                <p className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033]">7004794849, 9470988669</p>
              </div>
              <div className="flex items-center gap-3">
                <img src={emailIcon} alt="Email" className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                <a href="mailto:support@procounsel.co.in" className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:underline break-all sm:break-normal">support@procounsel.co.in</a>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="md:min-h-[270px] flex flex-col">
              <h4 className="mb-4 sm:mb-6 font-montserrat font-medium text-lg sm:text-xl leading-none text-[#180033]">Useful Links</h4>
              <ul className="space-y-3 sm:space-y-6 flex-1">
                {/* <li>
                  <a href="/colleges" className="block font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors">Colleges</a>
                </li> */}
                {/* <li>
                  <a href="/courses" className="block font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors">Courses</a>
                </li> */}
                <li>
                  <a href="/exams" className="block font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors">Exams</a>
                </li>
                <li>
                  <a href="/counsellors" className="block font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors">Counsellors</a>
                </li>
                <li>
                  <a href="/about" className="block font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors">About Us</a>
                </li>
                <li>
                  <a href="/contact" className="block font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors">Contact</a>
                </li>
                {/* <li>
                  <a href="/counsellor-dashboard" className="block font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors">Add College</a>
                </li> */}
                <li>
                  <button 
                    onClick={handleBecomeCounselor} 
                    className="block cursor-pointer font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors text-left w-full"
                  >
                    Become a Counsellor?
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="md:min-h-[270px] flex flex-col">
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
            <div className="md:w-[198px] md:min-h-[270px] flex flex-col">
              <h4 className="mb-4 sm:mb-6 font-montserrat font-medium text-lg sm:text-xl leading-none text-[#180033]">Follow Us on</h4>
              <ul className="space-y-3 sm:space-y-6 flex-1">
                <li className="flex items-center gap-3">
                  <img src={linkedinIcon} alt="LinkedIn" className="h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
                  <a href="https://www.linkedin.com/company/procounsel-by-catalystai/posts/?feedView=all" target="_blank" aria-label="LinkedIn" className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors">LinkedIn</a>
                </li>
                <li className="flex items-center gap-3">
                  <img src={facebookIcon} alt="Facebook" className="h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
                  <a href="https://www.facebook.com/share/17GiZ34K46/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors">Facebook</a>
                </li>
                <li className="flex items-center gap-3">
                  <img src={instagramIcon} alt="Instagram" className="h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
                  <a href="https://www.instagram.com/procounsel.co.in?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors">Instagram</a>
                </li>
                <li className="flex items-center gap-3">
                  <img src={twitterIcon} alt="Twitter" className="h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
                  <a href="https://x.com/procounsel2025" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="font-montserrat font-normal text-sm sm:text-base leading-none text-[#180033] hover:text-[#FA660F] transition-colors">Twitter</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 border-t border-[#6C696933] pt-4 sm:pt-6 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <p className="font-montserrat font-medium text-xs sm:text-sm leading-none text-[#180033]">© 2025 CATALYSTAI TECHNOLOGY PRIVATE LIMITED. All rights reserved.</p>
            <p className="font-montserrat font-normal text-xs leading-none text-[#180033]">ProCounsel™ is a trademark of CATALYSTAI TECHNOLOGY PRIVATE LIMITED.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-4 md:mt-0">
            <Link className="font-montserrat font-medium text-xs sm:text-sm leading-none text-[#180033] hover:text-[#FA660F] transition-colors" to="/privacy-policy">Privacy Policy</Link>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <Link className="font-montserrat font-medium text-xs sm:text-sm leading-none text-[#180033] hover:text-[#FA660F] transition-colors" to="/terms">Terms of Service</Link>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <Link className="font-montserrat font-medium text-xs sm:text-sm leading-none text-[#180033] hover:text-[#FA660F] transition-colors" to="/cancellation-refund">Cancellation & Refund</Link>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <Link className="font-montserrat font-medium text-xs sm:text-sm leading-none text-[#180033] hover:text-[#FA660F] transition-colors" to="/shipping-exchange">Shipping & Exchange</Link>
            {/* <span className="text-slate-300 hidden sm:inline">|</span>
            <Link className="font-montserrat font-medium text-xs sm:text-sm leading-none text-[#180033] hover:text-[#FA660F] transition-colors" to="/sitemap">Sitemap</Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
