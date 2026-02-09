export default function RevampAbout() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div 
        className="w-full h-[460px] bg-[url('/probuddiesbg.jpg')] bg-cover bg-center"
      >
        <div className="w-full h-full bg-[#0E1629]/85 flex items-center justify-center">
          
          <div className="flex flex-col items-center justify-center gap-2.5 w-full max-w-[805px] px-4">
            <h1 className="text-white font-poppins font-bold text-[60px] leading-20 text-center">
              About ProCounsel
            </h1>
            <p className="max-w-[753px] font-poppins font-medium text-[24px] leading-tight text-center text-white/70">
              Bridging the gap between ambitious students and expert education counsellors
            </p>

          </div>
        </div>
      </div>

      <div className="bg-white py-20 px-[60px]">
          {/* Mission Content */}

      </div>
    </div>
  );
}