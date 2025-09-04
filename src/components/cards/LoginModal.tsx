import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
const slideData = [
  {
    image: '/login1.png',
    title: 'For Students. With Counsellors.',
    description: 'We personalize the platform for you. Just tell us who you are and what you\'re here to achieve.'
  },
  {
    image: '/login2.png',
    title: 'Find Your Perfect Path.',
    description: 'Explore thousands of courses and careers, all tailored to your unique strengths and interests.'
  },
  {
    image: '/login3.png',
    title: 'Connect With Experts.',
    description: 'Schedule one-on-one sessions with top counsellors to get personalized guidance.'
  }
];

const LoginModal = () => {
  const [phone, setPhone] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slideData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-none md:backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl flex w-full max-w-5xl md:max-h-[90vh] relative overflow-hidden">
        <button className="absolute top-4 right-4 z-10 p-1.5 rounded-full transition-colors duration-200 hover:bg-black group">
            <X className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-white" />
        </button>

        {/* Left Column */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-12 bg-[#F5F7FA]">
          {/* New Logo Structure */}
            <div className="flex items-center mb-8">
                <img src="/favicon.png" alt="ProCounsel Logo Icon" className="h-15" />
                <div>
                    <p className="font-bold text-lg text-black">ProCounsel</p>
                    <p className="text-xs text-black">By CatalystAI</p>
                </div>
            </div>
            <div className="flex items-baseline mb-6">
                <h1 className="text-3xl font-semibold text-[#13097D] whitespace-nowrap">Log in or Sign up</h1>
                <a href="#" className="text-sm underline text-gray-500 hover:underline ml-auto whitespace-nowrap">Need Help?</a>
            </div>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 sm:py-3 mb-12 sm:mb-24 focus-within:border-[#FA660F] focus-within:ring-1 focus-within:ring-[#FA660F] w-full">
            <div className="flex items-center cursor-pointer">
                <img src="/india.png" alt="India Flag" className="h-5 w-5 mr-2" />
                <span className="text-black mr-1">+91</span>
                <ChevronDown className="h-8 w-9 text-black" />
            </div>

            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <input
                type="tel"
                placeholder="Enter your phone number"
                className="flex-1 min-w-0 pl-3 border-none focus:ring-0 focus:outline-none text-gray-800 text-sm sm:text-base"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

          </div>
          <button className="w-full bg-[#FA660F] text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
            Continue
          </button>
          <p className="text-xs text-gray-500 mt-4 text-center">
            By continuing, you agree to Procounsel's <a href="#" className="underline text-black">Terms & Condition</a> and <a href="#" className="underline text-black">Privacy Policy</a>
          </p>
        </div>

        {/* Right Column */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center p-12 text-center">
          <img src={slideData[activeIndex].image} alt="Illustration" className="w-full max-w-sm mb-8" />
          <h2 className="text-2xl font-bold text-[#13097D] mb-2">{slideData[activeIndex].title}</h2>
          <p className="text-gray-600 mb-8">{slideData[activeIndex].description}</p>
          <div className="flex gap-2">
            {slideData.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'w-6 bg-[#13097D]' : 'w-2 bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;