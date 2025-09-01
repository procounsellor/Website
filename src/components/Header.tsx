import { useEffect, useState } from "react";
import { SearchBar } from "./Searchbar";
import { Button } from "./ui/button";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50); // Trigger after 50px scroll
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all shadow-md
        ${scrolled ? "bg-white/80 backdrop-blur-md shadow" : "bg-transparent"}
      `}
    >
      <div className="max-w-8xl mx-auto px-6 py-3 flex items-center justify-between">
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
          className={`hidden md:flex flex-1 justify-center mx-6 transition-all duration-500 ${
            scrolled
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="w-full max-w-lg">
            <SearchBar onSearch={(q) => console.log(q)} />
          </div>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium shrink-0">
          <Button
            className="py-4 px-3 flex items-center h-10 rounded-lg font-semibold border-[#FA660F] text-[#FA660F] hover:bg-[#FA660F] hover:text-white"
            variant={"outline"}
          >
            Login/Sign Up
          </Button>
        </nav>
      </div>
    </header>
  );
}
