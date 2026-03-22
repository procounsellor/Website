import { useState, useEffect, useRef } from "react";

const TARGET_DATE = new Date("2026-03-29T14:00:00+05:30").getTime(); // 29th March 2026, 2:00 PM IST

const FlipUnit = ({ label, value }: { label: string; value: number }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [nextValue, setNextValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setCurrentValue(value);
      setNextValue(value);
      return;
    }

    if (value !== currentValue) {
      setNextValue(value);
      setIsFlipping(true);

      const finishTimeout = setTimeout(() => {
        setCurrentValue(value);
        setIsFlipping(false);
      }, 500);

      return () => clearTimeout(finishTimeout);
    }
  }, [value, currentValue]);

  const format = (v: number) => (v < 10 ? `0${v}` : v);

  return (
    <div className="flex flex-col items-center mx-1 sm:mx-2 md:mx-3">
      <div className="relative w-16 h-20 sm:w-24 sm:h-28 md:w-28 md:h-32 bg-[#2F43F2] rounded-xl sm:rounded-2xl shadow-xl text-white font-bold text-3xl sm:text-5xl md:text-6xl perspective-1000">

        <div className="absolute left-0 top-0 w-full h-1/2 overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-[#2F43F2]">
          <div className="absolute left-0 top-0 w-full h-[200%] flex items-center justify-center">
            {format(nextValue)}
          </div>
        </div>

        <div className="absolute left-0 bottom-0 w-full h-1/2 overflow-hidden rounded-b-xl sm:rounded-b-2xl bg-[#2F43F2]">
          <div className="absolute left-0 bottom-0 w-full h-[200%] flex items-center justify-center">
            {format(currentValue)}
          </div>
        </div>

        {isFlipping && (
          <div 
            className="absolute left-0 top-0 w-full h-1/2 overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-[#2F43F2] origin-bottom animate-flip-top"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="absolute left-0 top-0 w-full h-[200%] flex items-center justify-center">
              {format(currentValue)}
            </div>
            <div className="absolute inset-0 bg-black animate-shadow-top"></div>
          </div>
        )}

        {isFlipping && (
          <div 
            className="absolute left-0 bottom-0 w-full h-1/2 overflow-hidden rounded-b-xl sm:rounded-b-2xl bg-[#2F43F2] origin-top animate-flip-bottom"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="absolute left-0 bottom-0 w-full h-[200%] flex items-center justify-center">
              {format(nextValue)}
            </div>
            <div className="absolute inset-0 bg-black animate-shadow-bottom"></div>
          </div>
        )}

        <div className="absolute left-0 top-1/2 w-full h-[2px] bg-[#14238a] -translate-y-1/2 z-20 shadow-[0_2px_4px_rgba(0,0,0,0.4)]"></div>
        <div className="absolute left-0 top-1/2 w-full h-px bg-white/20 translate-y-1/2 z-20"></div>
      </div>
      
      <span className="text-[10px] sm:text-sm md:text-base font-bold text-gray-600 mt-4 sm:mt-5 uppercase tracking-[0.15em]">
        {label}
      </span>
    </div>
  );
};

const Colon = () => (
  <div className="flex flex-col gap-2 sm:gap-3 -mt-8 sm:-mt-10 mx-1 sm:mx-2">
    <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-[#2F43F2] rounded-full shadow-sm"></div>
    <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-[#2F43F2] rounded-full shadow-sm"></div>
  </div>
);

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        
        /* Top flap falls down to 90 degrees */
        .animate-flip-top {
          animation: flipTop 250ms ease-in forwards;
        }
        
        /* Bottom flap continues from 90 degrees to flat */
        .animate-flip-bottom {
          /* 'both' ensures it stays hidden at 90deg during the 250ms delay */
          animation: flipBottom 250ms ease-out 250ms both; 
        }
        
        @keyframes flipTop {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-90deg); }
        }
        
        @keyframes flipBottom {
          0% { transform: rotateX(90deg); }
          100% { transform: rotateX(0deg); }
        }

        /* Shadow overlays for a realistic 3D lighting effect */
        .animate-shadow-top {
          animation: shadowTop 250ms ease-in forwards;
        }
        .animate-shadow-bottom {
          animation: shadowBottom 250ms ease-out 250ms both;
        }
        @keyframes shadowTop {
          0% { opacity: 0; }
          100% { opacity: 0.4; }
        }
        @keyframes shadowBottom {
          0% { opacity: 0.4; }
          100% { opacity: 0; }
        }
      `}</style>
      
      <div className="flex justify-center items-center py-4">
        <FlipUnit label="Days" value={timeLeft.days} />
        <Colon />
        <FlipUnit label="Hours" value={timeLeft.hours} />
        <Colon />
        <FlipUnit label="Mins" value={timeLeft.minutes} />
        <Colon />
        <FlipUnit label="Secs" value={timeLeft.seconds} />
      </div>
    </>
  );
}