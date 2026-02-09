import Lottie from "lottie-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { buttonHoverScale, buttonTapScale, buttonTransition } from "@/components/common/PageTransition";

const tabs = [
    {id:1, name:'Admission', animationPath: '/admission.json', iconPath: '/Admissions.png', path: '/'},
    {id:2, name:'Courses', animationPath: '/courses.json', iconPath: '/Courses.svg', path: '/'},
    {id:3, name:'Community', animationPath: '/community.json', iconPath: '/Community.png', path: '/community'},
    {id:4, name:'ProBuddies', animationPath: '/probuddy.json', iconPath: '/ProBuddy.png', path: '/pro-buddies'},
    {id:5, name:'About us', animationPath: '/admission.json', iconPath: '/Admissions.png', path: '/revamp-about'}
]


export default function RevampHeader(){
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(1);
    
    // Sync active tab with current route
    useEffect(() => {
        const currentTab = tabs.find(tab => tab.path === location.pathname);
        if (currentTab) {
            setActiveTab(currentTab.id);
        }
    }, [location.pathname]);

    return <div className="bg-[#C6DDF040] w-full h-40 px-[60px] py-4.5 flex flex-col gap-3">

        <div className="flex justify-between">
            <div className="flex items-center gap-2">

                <img src="/logo.svg" alt="procounsel_logo" className="h-10.5 w-10.5" />

                <h1 className="text-[#232323] font-semibold text-[1.25rem]">ProCounsel</h1>

            </div>


            <motion.button 
                whileHover={{ scale: buttonHoverScale }}
                whileTap={{ scale: buttonTapScale }}
                transition={buttonTransition}
                className="bg-(--btn-primary) py-2 px-4 text-white text-xs font-medium rounded-[12px] border border-(--btn-primary) hover:cursor-pointer"
            >
                Login/Sign Up
            </motion.button>
        </div>




        <div className="flex gap-[35px] px-2.5 pb-6 justify-center">

            {tabs.map((tab)=>(
                <motion.div 
                    key={tab.id} 
                    onClick={() => {
                        setActiveTab(tab.id);
                        navigate(tab.path);
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.1 }}
                    className={`flex flex-row items-center justify-center gap-3 w-[236px] h-[60px] rounded-[16px] py-2 px-5 transition-all cursor-pointer ${
                        activeTab === tab.id ? 'bg-(--text-main)' : 'bg-white'
                    }`}
                >
                    <div className="w-[44px] h-[44px] flex items-center justify-center flex-shrink-0">
                        {activeTab === tab.id ? (
                            <Lottie 
                                loop={true}
                                autoplay={true}
                                path={tab.animationPath}
                                style={{ width: '100%', height: '100%' }}
                            />
                        ) : (
                            <img 
                                src={tab.iconPath} 
                                alt={tab.name}
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                    <h1 className={`font-poppins font-medium text-[18px] leading-[100%] ${
                        activeTab === tab.id ? 'text-white' : 'text-(--text-main)'
                    }`}>{tab.name}</h1>
                </motion.div>
            ))}


        </div>

    </div>
}