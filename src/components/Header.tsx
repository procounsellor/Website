import { useEffect, useState } from "react";
import { SearchBar } from "./Searchbar";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [heroSearchVisible, setHeroSearchVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
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
            <Button
              className="py-4 px-3 flex items-center h-10 rounded-lg font-semibold border-[#FA660F] text-[#FA660F] hover:bg-[#FA660F] hover:text-white"
              variant={"outline"}
            >
              Login/Sign Up
            </Button>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
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
    </>
  );
}
