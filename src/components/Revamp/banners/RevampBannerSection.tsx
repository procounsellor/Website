import AdityaBanner from './AdityaBanner';
import GyanDhanBanner from './GyanDhanBanner';

const RevampBannerSection = () => {
  return (
    <section className="w-full max-w-[1440px] mx-auto py-20 px-[60px] flex flex-col items-center bg-gray-50">
      <div className="flex flex-col items-center gap-8 w-full">
        
        <div className="self-start box-border flex items-center gap-2 bg-white border border-gray-100 rounded-[6px] px-3 py-1 shadow-sm">
           <div className="w-4 h-4 bg-[#0E1629] shrink-0" />
           <span className="font-poppins font-semibold text-[14px] leading-none tracking-[0.07em] text-[#0E1629] uppercase">
             Partners
           </span>
        </div>

        <div className="w-full flex flex-wrap justify-center gap-6">
          <GyanDhanBanner />
          <AdityaBanner />
        </div>

      </div>
    </section>
  );
};

export default RevampBannerSection;