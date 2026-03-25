import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { buttonHoverScale, buttonTapScale, buttonTransition } from "@/components/common/PageTransition";

const tabs = [
    { id: 1, name: 'Admission', iconPath: '/Admissions.png', path: '/admissions' },
    { id: 2, name: 'Courses', iconPath: '/Courses.svg', path: '/revamp-courses' },
    { id: 3, name: 'Community', iconPath: '/Community.png', path: '/community' },
    { id: 4, name: 'ProBuddies', iconPath: '/ProBuddy.png', path: '/pro-buddies' },
    //{ id: 5, name: 'About us', iconPath: '/Admissions.png', path: '/revamp-about' }
];

export default function RevampHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(1);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const currentTab = tabs.find(tab => tab.path === location.pathname);
        if (currentTab) {
            setActiveTab(currentTab.id);
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
        
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <motion.header 
            initial={false}
            animate={{ 
                height: isMobile 
                    ? (isScrolled ? 56 : 98) 
                    : (isScrolled ? 100 : 184) 
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="sticky top-0 z-50 w-full bg-[#C6DDF0]/75 flex flex-col items-center relative border-b border-gray-100 backdrop-blur-md overflow-hidden"
        >
            

            <motion.div 
                initial={false}
                animate={{ marginTop: isScrolled ? "20px" : "24px" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:flex relative w-full max-w-[1320px] h-[60px] px-[60px] justify-between items-center z-10"
            >
                <div 
                    className="flex items-center gap-2 cursor-pointer w-[170px] h-[43px]" 
                    onClick={() => navigate('/admissions')}
                >
                    <img src="/logo.svg" alt="procounsel_logo" className="h-[43px] w-[43px] object-contain" />
                    <h1 className="text-[#232323] font-semibold text-[1.25rem]">ProCounsel</h1>
                </div>

                <AnimatePresence>
                    {!isScrolled && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[12px] h-full"
                        >
                            {tabs.map((tab) => (
                                <div
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        navigate(tab.path);
                                    }}
                                    className={`flex flex-row items-center justify-center gap-2 h-full py-[8px] cursor-pointer transition-all ${
                                        activeTab === tab.id ? 'border-b-[1px] border-[#000000]' : 'border-b-[1px] border-transparent'
                                    }`}
                                >
                                    <img
                                        src={tab.iconPath}
                                        alt={tab.name}
                                        className="w-[44px] h-[44px] object-contain"
                                    />
                                    <span className="font-poppins font-medium text-[18px] text-[#232323]">
                                        {tab.name}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: buttonHoverScale }}
                    whileTap={{ scale: buttonTapScale }}
                    transition={buttonTransition}
                    className="w-[123px] h-[34px] bg-[#2F43F2] border border-[#2F43F2] rounded-[8px] flex items-center justify-center gap-[10px] px-[16px] py-[8px] cursor-pointer"
                >
                    <span className="font-poppins font-medium text-[12px] leading-[100%] text-white text-nowrap">
                        Login / Sign Up
                    </span>
                </motion.button>
            </motion.div>

            <motion.div 
                initial={false}
                animate={{ 
                    top: isScrolled ? 24 : 108,
                    left: "50%",
                    x: "-50%" 
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:flex absolute w-[456px] h-[52px] bg-[#FFFFFF] rounded-[12px] items-center pl-[12px] pr-[12px] shadow-sm border border-gray-50 z-20"
            >
                <input 
                    type="text" 
                    placeholder="Search for colleges" 
                    className="w-full h-full bg-transparent outline-none font-poppins font-medium text-[16px] leading-[100%] text-[#232323] placeholder:text-[#6B7280]"
                />
                <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#6B7280] flex-shrink-0 ml-2"
                >
                    <path d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </motion.div>


            
            <div className="flex md:hidden w-full flex-col px-[12px] pt-[8px]">
                
                <AnimatePresence>
                    {!isScrolled && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -10, marginBottom: 0 }}
                            animate={{ opacity: 1, height: '22px', y: 0, marginBottom: '12px' }}
                            exit={{ opacity: 0, height: 0, y: -10, marginBottom: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex w-full justify-between items-center"
                        >
                            {tabs.map((tab) => (
                                <div
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        navigate(tab.path);
                                    }}
                                    className={`flex flex-row items-center justify-center gap-[2px] h-[22px] pb-[2px] cursor-pointer transition-all ${
                                        activeTab === tab.id ? 'border-b-[1.5px] border-[#000000]' : 'border-b-[1.5px] border-transparent'
                                    }`}
                                >
                                    <img
                                        src={tab.iconPath}
                                        alt={tab.name}
                                        className="w-[16px] h-[16px] object-contain shrink-0"
                                    />
                                    <span className="font-poppins font-medium text-[11px] sm:text-[12px] leading-[100%] text-[#232323] whitespace-nowrap">
                                        {tab.name}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex w-full items-center gap-[12px]">
                    <div className="flex-1 h-[40px] bg-[#FFFFFF] rounded-[12px] border border-gray-50 flex items-center px-[12px] shadow-sm">
                        
                        <img 
                            src="/logo.svg" 
                            alt="procounsel_logo" 
                            className="w-[12.5px] h-[15px] object-contain mr-[8px] shrink-0" 
                        />

                        <input 
                            type="text" 
                            placeholder="Search states" 
                            className="w-full h-full bg-transparent outline-none font-poppins font-medium text-[12px] leading-[100%] text-[#232323] placeholder:text-[#232323]"
                        />
                        <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-[#6B7280] flex-shrink-0 ml-2"
                        >
                            <path d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>

                    <motion.button
                        whileHover={{ scale: buttonHoverScale }}
                        whileTap={{ scale: buttonTapScale }}
                        transition={buttonTransition}
                        className="h-[30px] bg-[#2F43F2] border border-[#2F43F2] rounded-[8px] flex items-center justify-center px-[16px] cursor-pointer shrink-0"
                    >
                        <span className="font-poppins font-medium text-[12px] leading-[100%] text-white text-nowrap">
                            Login / Sign Up
                        </span>
                    </motion.button>
                </div>

            </div>

        </motion.header>
    );
}