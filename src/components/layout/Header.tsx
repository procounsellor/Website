import { SearchBar } from "./Searchbar";
import { useAuthStore } from "@/store/AuthStore";
import { Button } from "../ui";
import { User2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Header(){
    const {toggleLogin,isAuthenticated, logout} = useAuthStore()
    const [scrolled, setScrolled] = useState(false)
    const [showHeaderSearch, setShowHeaderSearch] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const searchBarRef = useRef(null)

    useEffect(() => {
        const onScroll = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 20);
        };

        const handleHeroSearchBarVisibility = (event: CustomEvent) => {
            setShowHeaderSearch(!event.detail.isVisible);
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        scrolled 
          ? "bg-white/85 backdrop-blur-xl border-b border-black/10 shadow-lg shadow-black/5" 
          : "bg-transparent"
      }`}>
      <div className="flex h-14 md:h-20 items-center justify-between px-5 lg:px-20">

        <div className="Logo flex">
        <img src="/logo.svg" alt="procounsel_logo" 
        className="h-7 w-7 md:w-11 md:h-12"
        />
        <div className="flex flex-col leading-tight pl-[9px]">
           <h1 className="text-[#232323] font-semibold text-sm md:text-xl">ProCounsel</h1>
            <span className="font-normal text-[#858585] text-[8px] md:text-[10px]">By CatalystAI</span>
        </div>
      </div>

  
      <div 
        ref={searchBarRef} 
        className={`hidden md:block w-full max-w-lg transition-all duration-700 ease-out ${
          showHeaderSearch 
            ? "opacity-100 translate-y-0 scale-100" 
            : "opacity-0 -translate-y-6 scale-95 pointer-events-none"
        }`}
      >
        <SearchBar onSearch={(query) => console.log('Search query:', query)} showBackdrop={true} />
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
          <div onClick={logout}><User2 className="h-6 w-6"/></div>
         ):(
           <Button
          variant={"outline"}
          className="w-full lg:w-[164px] flex items-center justify-center h-6 md:h-11 border rounded-[12px] font-semibold text-[#FF660F] border-[#FF660F]
           text-[10px] md:text-lg hover:bg-[#FF660F] hover:text-white transition-all duration-200"
          onClick={toggleLogin}
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
          <SearchBar 
            onSearch={(query) => {
              console.log('Mobile search query:', query);
            }} 
            showBackdrop={false}
            autoFocus={true}
            className="text-[#F5F5F7]"
          />
        </div>
      </div>
    )}
    </>
  )
}
  

