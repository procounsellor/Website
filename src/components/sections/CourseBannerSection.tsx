import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '@/store/AuthStore';
import toast from 'react-hot-toast';

const COURSE_EXPLORE_PATH = "/gurucool"; 
const AADITYA_IMAGE_PATH = "./aaditya-banner.png"; 
const SUBSCRIBER_AVATARS_PATH = "./subscribers.png";

const CourseBannerSection: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, toggleLogin } = useAuthStore();

    const handleExploreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault(); 
        navigate(COURSE_EXPLORE_PATH);
    };
    
    const handleLiveSessionClick = () => {
        if (isAuthenticated) {
            navigate('/live-sessions');
        } else {
            toast.error("Please log in to explore live sessions.", { duration: 3000 });
            const onSuccess = () => navigate('/live-sessions');
            toggleLogin(onSuccess);
        }
    };


    return (
        <section className="bg-white py-8 md:py-16">
            <div className="container mx-auto px-4 md:px-38">
                <div className="relative overflow-hidden rounded-xl p-6 md:p-12 lg:p-16" 
                    style={{ background: 'linear-gradient(176.34deg, #634557 4.61%, #DCC1CA 90.05%)' }}>
                    <div className="z-10 relative">
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-4">
                            Explore Our Comprehensive Range of Courses By :
                            <br />
                            <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                                Aaditya [COEP]
                            </span>
                        </h2>

                        <div className="flex items-center space-x-3 mb-4 md:mb-8">
                            <img
                                src={SUBSCRIBER_AVATARS_PATH}
                                alt="52.5K subscribers"
                                className="h-9 sm:h-10 w-auto object-contain"
                            />
                            <p className="text-base sm:text-lg font-semibold text-white">
                                52.5K subscribers
                            </p>
                        </div>                   

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <a 
                                href={COURSE_EXPLORE_PATH}
                                onClick={handleExploreClick}
                                className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg shadow-sm bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
                                style={{ color: '#B68D9D' }} 
                            >
                                Explore Courses Now  
                                <ArrowUpRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#B68D9D' }} />
                            </a>
                            
                            <button
                                onClick={handleLiveSessionClick}
                                className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg shadow-sm transition cursor-pointer duration-150 ease-in-out"
                                style={{ background: 'white', color: '#B68D9D' }} 
                            >
                                Explore Live Sessions
                                <ArrowUpRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#B68D9D' }} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="absolute top-0 right-0 h-full w-1/4 hidden md:block z-0">                        
                        <div 
                            className="absolute rounded-full z-[-1]"
                            style={{
                                top: '-20%',
                                right: '-80%', 
                                width: '200%', 
                                height: '140%',
                                backgroundColor: '#DCC1CA', 
                                opacity: 0.15,
                            }}
                        />
                        <div 
                            className="absolute rounded-full z-[-1]"
                            style={{
                                top: '10%',
                                right: '-30%', 
                                width: '100%', 
                                height: '100%',
                                backgroundColor: '#DCC1CA',
                                opacity: 0.25,
                            }}
                        />
                        <img
                            src={AADITYA_IMAGE_PATH}
                            alt="Aaditya [COEP] Counselor"
                            className="absolute bottom-0 right-0 h-full object-cover z-10"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CourseBannerSection;