import { useRef, useEffect } from 'react';
import { GlobalSearchBar } from './GlobalSearchBar';

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
        threshold: 0.3, 
        rootMargin: '-80px 0px 0px 0px' 
      }
    );

    observer.observe(searchBar);
    return () => observer.disconnect();
  }, []);

  return (
     <section className='w-full h-64 lg:h-[592px] mt-[52px] lg:mt-20'>
      <div 
      className="bg-[url('/phoneHero.png')] lg:bg-[url('/desktopHero.png')] bg-cover h-full w-full">

        <div className='flex flex-col items-center justify-center h-full'>
          <div className='flex flex-col items-center'>
            <h1 className='font-extrabold text-lg lg:text-[44px]'>
              Where Ambition
              <br/>
                meets <span className='text-[#FF660F]'>guidance</span>
            </h1>
            <p className='font-medium text-[6px] lg:text-[16px] pb-3 '>Find trusted guidance, personalised course matches, and clear admissions support to help you choose the right path.</p>

          </div>
          <div ref={searchBarRef} className='w-full max-w-56 lg:max-w-lg text-[8px] lg:text-[16px] font-medium lg:font'>
            <GlobalSearchBar showBackdrop={true} />
          </div>
        </div>

      </div>
    </section>
  )
};

export default Hero;
