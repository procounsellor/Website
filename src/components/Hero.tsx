import FloatingProfiles from "./ImageParticles";
import { SearchBar } from "./Searchbar";

export default function Hero() {
  return (
    <div id="hero" className="relative h-[592px] w-full flex flex-col items-center justify-center bg-white overflow-hidden pt-[80px]">
      <FloatingProfiles />

      <div className="relative z-10 text-center flex flex-col items-center">
        <div className="w-full max-w-[712px] flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            <span className="block">Where ambition</span>
            <span className="block">
              meets <span className="text-orange-500">guidance</span>
            </span>
          </h1>

          <p className="mt-4 text-lg text-gray-600 text-center max-w-[712px]">
            Lorem ipsum dolor sit amet consectetur. Senectus arcu cras at risus a
            tortor ut quam in.
          </p>

          <div className="mt-8 ml-6 w-full max-w-[620px] flex justify-center">
            <div className="relative w-[520px]">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-gray-300/40 via-gray-200/20 to-transparent blur-xl opacity-70 pointer-events-none" />
              
              <div className="relative z-10">
                <SearchBar onSearch={() => {}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
