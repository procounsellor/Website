import { GlobalSearchBar } from "./GlobalSearchBar";
import { useAuthStore } from "@/store/AuthStore";
import { Button } from "../ui";
import { User2, Search, X, LogOut, LayoutDashboard } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import SmartImage from "@/components/ui/SmartImage";
import { BANNER_DISMISS_EVENT } from "@/components/shared/AppInstallBanner";

export default function Header(){
    const {user,toggleLogin,isAuthenticated, logout} = useAuthStore()
    const [scrolled, setScrolled] = useState(false)
    const [showHeaderSearch, setShowHeaderSearch] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isBannerVisible, setIsBannerVisible] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchBarRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()

    // Check if we're on the home page
    const isHomePage = location.pathname === '/'

    useEffect(() => {
      const handleBannerDismiss = () => {
        setIsBannerVisible(false);
      };
      window.addEventListener(BANNER_DISMISS_EVENT, handleBannerDismiss);
        const onScroll = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 20);
        };

        const handleHeroSearchBarVisibility = (event: CustomEvent) => {
            // Only show header search based on hero visibility if we're on home page
            if (isHomePage) {
                setShowHeaderSearch(!event.detail.isVisible);
            }
        };

        window.addEventListener("scroll", onScroll);
        
        if (isHomePage) {
            window.addEventListener("heroSearchBarVisibility", handleHeroSearchBarVisibility as EventListener);
        } else {
            // Always show search on non-home pages
            setShowHeaderSearch(true);
        }
        
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("heroSearchBarVisibility", handleHeroSearchBarVisibility as EventListener);
            window.removeEventListener(BANNER_DISMISS_EVENT, handleBannerDismiss);
        };
    }, [isHomePage]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    // const handleProfileClick = () => {
    //     navigate('/dashboard/student');
    // };
    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        navigate('/');
        toast.success('Logged out successfully!', { duration: 3000 });
    };

    useEffect(() => {
    setIsDropdownOpen(false);
}, [location.pathname]);

const handleProfileNavigation = () => {
    if (user?.role === 'counsellor') {
        navigate('/counselor-dashboard');
    } else {
        navigate('/dashboard/student');
    }
    setIsDropdownOpen(false);
};


  return (
    <>
    
    <header className={`fixed top-0 left-0 right-0 z-50 border border-[#d6d6d6] shadow-xs transition-all duration-300 ease-out ${
      (isBannerVisible && !scrolled) ? "top-[60px] md:top-0" : "top-0"
      } ${
        scrolled 
          ? "bg-white/85 backdrop-blur-xl  shadow-lg shadow-black/5" 
          : "bg-transparent"
      }`}>
      <div className="flex h-14 md:h-20 items-center justify-between px-5 lg:px-20">

        <div className="Logo flex items-center cursor-pointer" onClick={() => navigate('/')}>
        <SmartImage src="/logo.svg" alt="procounsel_logo" 
          className="h-7 w-7 md:w-11 md:h-12"
          width={44}
          height={44}
          priority
        />
 ~       <div className="flex items-center leading-tight pl-[9px] hover:cursor-pointer" onClick={() => navigate('/')}>
           <h1 className="text-[#232323] font-semibold text-sm md:text-xl">ProCounsel</h1>
        </div>
      </div>

  
      <div 
        ref={searchBarRef} 
        className={`hidden md:block w-full max-w-lg transition-all duration-700 ease-out ${
          showHeaderSearch 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 translate-y-6 scale-95 pointer-events-none"
        }`}
      >
        <GlobalSearchBar showBackdrop={true} />
      </div>

      <div className="flex items-center gap-3">
        <button 
          className={`md:hidden p-2 rounded-full hover:bg-black/5 transition-all duration-700 ease-out ${
            showHeaderSearch 
              ? "opacity-100 translate-x-0 scale-100" 
              : "opacity-0 translate-x-4 scale-95 pointer-events-none"
          }`}
          onClick={() => setMobileSearchOpen(true)}
          aria-label="Search"
        >
          <Search className="h-5 w-5 text-[#232323]" />
        </button>

        <div className="btn">
         {isAuthenticated ? (
          <>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              className="p-2 rounded-full hover:bg-gray-200 transition-colors" 
              aria-label="Open user menu"
            >
              <User2 className="h-6 w-6 text-gray-700" />
            </button>
                                    
            {isDropdownOpen && (
              
              <div 
              ref={dropdownRef}
              className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 py-1 border border-gray-200">
                <button
                  onClick={handleProfileNavigation}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LayoutDashboard size={16} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </>
         ):(
           <Button
          variant={"outline"}
          className="w-full lg:w-[164px] flex items-center justify-center h-6 md:h-11 border rounded-[12px] font-semibold text-[#FF660F] border-[#FF660F]
           text-[10px] md:text-lg hover:bg-[#FF660F] hover:text-white transition-all duration-200"
          onClick={() => toggleLogin()}
          >
            Login/Sign Up
          </Button>
         )}
        </div>
      </div>
      </div>
    </header>

    {mobileSearchOpen && (
      <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between p-4 border-b border-black/10">
          <h2 className="text-lg font-semibold text-[#232323]">Search</h2>
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
            aria-label="Close search"
          >
            <X className="h-5 w-5 text-[#232323]" />
          </button>
        </div>
        <div className="p-4">
          <GlobalSearchBar 
            showBackdrop={false}
            autoFocus={true}
            className="text-[#F5F5F7]"
            onClose={() => setMobileSearchOpen(false)}
          />
        </div>
      </div>
    )}
    </>
  )
}
  
