export default function RevampAbout() {
  return (
    <div className="flex flex-col bg-[#F8FAFC]">
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

        {/* Mission Content */}
        <section className="w-full max-w-[1440px] h-[429px] mx-auto py-10 px-[60px] flex flex-col items-center">
        <div className="w-full max-w-[1260px] flex flex-col items-center gap-8">
          <div className="self-start box-border flex items-center w-[113px] h-[29px] gap-2 bg-white border border-gray-100 rounded-[6px] px-3 py-1 shadow-sm">
            <div className="w-4 h-4 bg-[#0E1629] shrink-0" />
              <span className="font-poppins font-semibold text-[14px] leading-none tracking-[0.07em] text-[#0E1629] uppercase whitespace-nowrap">
                MISSION
              </span>
          </div>

          <div className="w-full max-w-[1200px] flex flex-col gap-6">
            <p className="font-poppins font-medium text-[24px] leading-relaxed text-center text-[#0E1629]">
              ProCounsel acts as a comprehensive bridge between students and education counsellors, 
              empowering students to make informed decisions about their academic and career journey. 
              We believe every student deserves access to expert guidance when navigating the 
              complex landscape of higher education in India.
            </p>
            <p className="font-poppins font-medium text-[24px] leading-relaxed text-center text-[#0E1629]">
              Our platform democratizes access to quality education counselling, making it easier 
              for students to connect with verified professionals who can guide them through 
              college admissions, course selections, and career planning.
            </p>
          </div>
          
        </div>
      </section>

      {/* What we do */}
      <section className="w-full max-w-[1440px] mx-auto pt-10 pb-20 px-[60px] flex flex-col items-center">
        <div className="w-full max-w-[1260px] flex flex-col items-center gap-8">
          <div className="self-start box-border flex items-center w-[149px] h-[29px] gap-2 bg-white border border-gray-100 rounded-[6px] px-3 py-1 shadow-sm">
            <div className="w-4 h-4 bg-[#0E1629] shrink-0" />
              <span className="font-poppins font-semibold text-[14px] leading-none tracking-[0.07em] text-[#0E1629] uppercase whitespace-nowrap">
                What We Do
              </span>
          </div>

          <div className="flex flex-row justify-center w-full gap-10">
            
            <div className="w-[580px] h-[450px] bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="font-poppins font-semibold text-[28px] leading-[100%] text-[#2F43F2]">
                For Students
              </h3>
              <ul className="flex flex-col gap-4 list-disc pl-5">
                {[
                  "Explore comprehensive information about colleges, courses, and exams available across India",
                  "Browse detailed counsellor profiles with experience, specializations, and availability",
                  "Book personalized appointment sessions with expert counsellors",
                  "Subscribe to counsellors for ongoing support throughout your admission process",
                  "Communicate directly with subscribed counsellors through our secure chat platform"
                ].map((item, index) => (
                  <li key={index} className="font-poppins font-medium text-[18px] leading-[150%] text-[#6B7280]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-[580px] h-[450px] bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="font-poppins font-semibold text-[28px] leading-[100%] text-[#2F43F2]">
                For Counsellors
              </h3>
              <ul className="flex flex-col gap-4 list-disc pl-5">
                {[
                  "Create comprehensive profiles showcasing expertise and experience",
                  "Manage availability and appointment scheduling efficiently",
                  "Connect with motivated students seeking guidance",
                  "Offer subscription-based ongoing support services",
                  "Build lasting relationships with students throughout their academic journey"
                ].map((item, index) => (
                  <li key={index} className="font-poppins font-medium text-[18px] leading-[150%] text-[#6B7280]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="relative w-full pb-10 mx-auto bg-[#F8FAFC]">
        <div className="relative w-full h-[180px]">
          <div className="absolute top-10 left-[60px] box-border flex items-center w-[123px] h-[29px] gap-2 bg-white border border-gray-100 rounded-[6px] px-3 py-1 shadow-sm">
            <div className="w-4 h-4 bg-[#0E1629] shrink-0" />
            <span className="font-poppins font-semibold text-[14px] leading-none tracking-[0.07em] text-[#0E1629] uppercase whitespace-nowrap">
              FEATURES
            </span>
          </div>

          <h2 className="absolute top-10 left-[565px] w-[682px] h-[108px] font-poppins font-medium text-[24px] leading-[150%] text-[#0E1629]">
            Discover curated programs across mental wellness, assessments, admissions, and upskilling led by experienced professionals, built around your needs.
          </h2>
        </div>

        <div className="w-full flex flex-row">
          
          <div className="relative flex-1 h-[380px] bg-[#C6DDF0]/25">
            <img 
              src="/feature1.svg" 
              alt="ProCoins" 
              className="absolute top-6 left-6 w-[60px] h-[60px]" 
            />
            <div className="absolute top-[212px] left-6 flex flex-col gap-3">
              <h3 className="w-[288px] h-[42px] font-poppins font-semibold text-[28px] leading-none text-[#0E1629]">
                ProCoins System
              </h3>
              <p className="w-[410px] font-poppins font-medium text-[18px] leading-[150%] text-[#6B7280]">
                Secure virtual currency (₹1 = 1 ProCoin) for seamless transactions, powered by Razorpay for safe and reliable payments.
              </p>
            </div>
          </div>

          <div className="relative flex-1 h-[380px] bg-[#FA660F]/25">
            <img 
              src="/feature2.svg" 
              alt="Secure Platform" 
              className="absolute top-6 left-6 w-[60px] h-[60px]" 
            />
            <div className="absolute top-[212px] left-6 flex flex-col gap-3">
              <h3 className="w-[288px] h-[42px] font-poppins font-semibold text-[28px] leading-[150%] text-[#0E1629]">
                Secure Platform
              </h3>
              <p className="w-[410px] font-poppins font-medium text-[18px] leading-[150%] text-[#6B7280]">
                Your privacy and data security are our top priorities. We maintain strict confidentiality and secure communication channels.
              </p>
            </div>
          </div>

          <div className="relative flex-1 h-[380px] bg-[#2F43F2]/25">
            <img 
              src="/feature3.svg" 
              alt="Database" 
              className="absolute top-6 left-6 w-[60px] h-[60px]" 
            />
            <div className="absolute top-[212px] left-6 flex flex-col gap-3">
              <h3 className="w-[400px] h-[42px] font-poppins font-semibold text-[28px] leading-none text-[#0E1629]">
                Comprehensive Database
              </h3>
              <p className="w-[410px] font-poppins font-medium text-[18px] leading-[150%] text-[#6B7280]">
                Access detailed information about colleges, courses, exams, and admission processes across India in one centralized platform.
              </p>
            </div>
          </div>

        </div>
      </section>

      </div>
  );
}