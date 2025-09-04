import { useEffect, useState } from "react";
import { SearchBar } from "./Searchbar";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, UserCircle2Icon } from "lucide-react";
import { useAuthStore } from "@/store/AuthStore";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [heroSearchVisible, setHeroSearchVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const {toggleLogin,isAuthenticated} = useAuthStore()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50); 
    };

    const handleHeroSearchBarVisibility = (event: CustomEvent) => {
      setHeroSearchVisible(event.detail.isVisible);
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("heroSearchBarVisibility", handleHeroSearchBarVisibility as EventListener);
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("heroSearchBarVisibility", handleHeroSearchBarVisibility as EventListener);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all shadow-md
          ${scrolled ? "bg-white/80 backdrop-blur-md shadow" : "bg-transparent"}
        `}
      >
        <div className="w-full mx-auto px-6 py-3 flex items-center justify-between">
          <a className="flex items-center space-x-2 shrink-0" href="#">
            <img
              src="/logo.svg"
              alt="Logo"
              className="h-8 md:h-10 lg:h-12 object-contain"
            />
            <div className="flex flex-col leading-tight">
              <h1 className="text-2xl font-bold text-orange-600">ProCounsel</h1>
              <span className="text-xs text-gray-500">By CatlyastAI</span>
            </div>
          </a>

          <div
            className={`hidden lg:flex flex-1 justify-center mx-6 transition-all duration-500 ${
              scrolled && !heroSearchVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <div className="w-full max-w-lg">
              <SearchBar onSearch={(q) => console.log(q)} />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium shrink-0">
           {isAuthenticated? (<UserCircle2Icon className="w-11 h-11 text-gray-400"/>
           
          ): <Button
              className="py-4 px-3 flex items-center h-10 rounded-lg font-semibold border-[#FA660F] text-[#FA660F] hover:bg-[#FA660F] hover:text-white"
              variant={"outline"}
              onClick={toggleLogin}
            >
              Login/Sign Up
            </Button>
           
           }
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            {scrolled && !heroSearchVisible && (
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setMobileSearchOpen(true)}
                aria-label="Open search"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </button>
            )}
            
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-md md:hidden">
          <div className="pt-20 px-6 space-y-6">
            <div className="w-full">
              <SearchBar onSearch={(q) => console.log(q)} />
            </div>
            <div className="space-y-4">
              <Button
                className="w-full py-4 px-3 flex items-center justify-center h-12 rounded-lg font-semibold border-[#FA660F] text-[#FA660F] hover:bg-[#FA660F] hover:text-white"
                variant={"outline"}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login/Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}

      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-md md:hidden">
          <div className="pt-20 px-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setMobileSearchOpen(false)}
                aria-label="Close search"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">Search</h2>
            </div>
            <div className="w-full">
              <SearchBar 
                onSearch={(q) => {
                  console.log(q);
                  setMobileSearchOpen(false);
                }} 
                showBackdrop={false}
                autoFocus={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
