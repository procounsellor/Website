import { useRef, useEffect } from 'react';
import { SearchBar } from './Searchbar';
import {
  avatar1, avatar2, avatar3, avatar4, avatar5, avatar6,
  avatar7, avatar8, avatar9, avatar10, avatar11,
  icon1, icon2, icon3, icon4, icon5, icon6,
  icon7, icon8, icon9, icon10
} from '../../assets';

const elements = [
  { src: avatar1, x: 350, y: 20, size: 71, type: 'profile' },
  { src: avatar2, x: 66, y: 63, size: 72, type: 'profile' },
  { src: avatar3, x: 231, y: 167, size: 72, type: 'profile' },
  { src: avatar4, x: 10, y: 294, size: 81, type: 'profile' }, 
  { src: avatar5, x: 128, y: 416, size: 71, type: 'profile' },
  { src: avatar6, x: 332, y: 476, size: 96, type: 'profile' },
  { src: avatar7, x: 1014, y: 469, size: 69, type: 'profile' },
  { src: avatar8, x: 1198, y: 277, size: 64, type: 'profile' },
  { src: avatar9, x: 1071, y: 101, size: 75, type: 'profile' },
  { src: avatar10, x: 1311, y: 429, size: 93, type: 'profile' },
  { src: avatar11, x: 1350, y: 30, size: 103, type: 'profile' }, 
  { src: icon1, x: 168, y: 120, size: 50, type: 'icon' },
  { src: icon2, x: 41, y: 208, size: 50, type: 'icon' },
  { src: icon3, x: 203, y: 340, size: 30, type: 'icon' },
  { src: icon4, x: 327, y: 402, size: 50, type: 'icon' },
  { src: icon5, x: 87, y: 504, size: 30, type: 'icon' },
  { src: icon6, x: 1092, y: 405, size: 48, type: 'icon' },
  { src: icon7, x: 1251, y: 479, size: 50, type: 'icon' },
  { src: icon8, x: 1368, y: 321, size: 40, type: 'icon' },
  { src: icon9, x: 1275, y: 114, size: 50, type: 'icon' },
  { src: icon10, x: 1147, y: 58, size: 40, type: 'icon' },
];

const DESIGN_WIDTH = 1444;
const DESIGN_HEIGHT = 592;

const Hero = () => {
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchBar = searchBarRef.current;
    if (!searchBar) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        window.dispatchEvent(
          new CustomEvent('heroSearchBarVisibility', {
            detail: { isVisible: entry.isIntersecting }
          })
        );
      },
      {
        threshold: 0.5, 
        rootMargin: '-80px 0px 0px 0px'
      }
    );

    observer.observe(searchBar);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="pt-[80px] flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-[1444px] h-[400px] sm:h-[500px] lg:h-[592px] overflow-hidden">
        <div className="absolute inset-0 z-0 hidden sm:block">
          {elements.map((el, index) => {
            const style = {
              left: `${(el.x / DESIGN_WIDTH) * 100}%`,
              top: `${(el.y / DESIGN_HEIGHT) * 100}%`,
              width: `${(el.size / DESIGN_WIDTH) * 100}%`,
            };

            return (
              <img
                key={index}
                src={el.src}
                alt=""
                className="absolute w-full h-auto"
                style={style}
              />
            );
          })}
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-7xl">
            <span className="block">Where ambition</span>
            <span className="block">meets <span className='text-[#FF660F]'>guidance</span></span>
          </h1>
          <p className="mt-4 max-w-xl text-base sm:text-lg text-gray-600 sm:mt-6">
            Lorem ipsum dolor sit amet consectetur. Senectus arcu cras at risus a tortor ut quam in.
          </p>
          <div ref={searchBarRef} className="mt-6 sm:mt-8 w-full max-w-lg lg:mt-10">
            <SearchBar onSearch={(query) => console.log('Search query:', query)} showBackdrop={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
