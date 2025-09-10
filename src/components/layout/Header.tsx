import { SearchBar } from "./Searchbar";
import { useAuthStore } from "@/store/AuthStore";
import { Button } from "../ui";
import { User2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Header(){
    const {toggleLogin,isAuthenticated, logout} = useAuthStore()
    const [scrolled, setScrolled] = useState(false)
    // const [isHeroSearchVisible, setHeroSearchVisible] = useState(false)
    const searchBarRef = useRef(null)


    useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50); 
      // setHeroSearchVisible(true)
    };
       return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);



  return (
    <header className={`fixed inset-0 w-full transition-all z-50 ${scrolled ? "bg-white/80 backdrop-blur-md shadow":"bg-transparent"}`}>
      <div className="flex h-14 md:h-20 items-center justify-between px-5 lg:px-20 bg-white">

        <div className="Logo flex">
        <img src="/logo.svg" alt="procounsel_logo" 
        className="h-7 w-7 md:w-11 md:h-12"
        />
        <div className="flex flex-col leading-tight pl-[9px]">
           <h1 className="text-[#232323] font-semibold text-sm md:text-xl">ProCounsel</h1>
            <span className="font-normal text-[#858585] text-[8px] md:text-[10px]">By CatalystAI</span>
        </div>
      </div>

    
      <div ref={searchBarRef} className="hidden md:block w-full max-w-lg ">
              <SearchBar onSearch={(query) => console.log('Search query:', query)} showBackdrop={true} />
      </div>


      <div className="btn">
       {isAuthenticated ? (
        <div onClick={logout}><User2 className="h-6 w-6"/></div>
       ):(
         <Button
        variant={"outline"}
        className="w-full lg:w-[164px] flex items-center justify-center h-6 md:h-11 border rounded-[12px] font-semibold text-[#FF660F] border-[#FF660F]
         text-[10px] md:text-lg hover:bg-[#FF660F] hover:text-white"
        onClick={toggleLogin}
        >
          Login/Sign Up
        </Button>
       )}
      </div>
      </div>
    </header>
  )
}
  

