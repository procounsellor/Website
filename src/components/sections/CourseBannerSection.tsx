import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '@/store/AuthStore';
import toast from 'react-hot-toast';

const COURSE_EXPLORE_PATH = "/gurucool";
const AADITYA_IMAGE_PATH = "./aaditya-banner.png";
const SUBSCRIBER_AVATARS_PATH = "./subscribers.png";

// Banner slide configurations
const bannerSlides = [
    {
        id: 'aaditya',
        gradient: 'linear-gradient(176.34deg, #634557 4.61%, #DCC1CA 90.05%)',
        decorativeColor: '#DCC1CA',
        buttonTextColor: '#B68D9D',
    },
    {
        id: 'gyandhan',
        gradient: 'linear-gradient(180deg, #9B7DFE 0%, #866FCF 43.5%, #4D3D8A 100%)',
        decorativeColor: '#9B7DFE',
        buttonTextColor: '#6B4FCF',
        title: 'GyanDhan Loan Assistance',
        subtitle: 'Plan your education journey with clarity and confidence.',
        buttonText: 'Check your loan eligibility',
        link: 'https://www.gyandhan.com/loaneligs?campaign_partner=Catalystai+Technology+Private+Limited',
        image: '/gyandhan.svg',
        logo: '/gyandhanlogo.svg',
        isExternal: true,
    },
    {
        id: 'scaler',
        gradient: 'linear-gradient(180deg, #477DF1 0%, #0138AF 100%)',
        decorativeColor: '#477DF1',
        buttonTextColor: '#0138AF',
        title: 'Scaler Academy',
        subtitle: 'Become Future Ready Software Developer with AI Skills',
        buttonText: 'Apply Now',
        link: 'https://bit.ly/PRO50_',
        image: '/scaler.svg',
        logo: '/scalerlogo.svg',
        isExternal: true,
    },
];

const CourseBannerSection: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, toggleLogin } = useAuthStore();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-rotation logic
    const startAutoRotate = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            if (!isPaused) {
                setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
            }
        }, 5000);
    }, [isPaused]);

    useEffect(() => {
        startAutoRotate();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [startAutoRotate]);

    // Handle dot click
    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        startAutoRotate();
    };

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

    const handleBannerButtonClick = (link: string) => {
        if (link.startsWith('http')) {
            window.open(link, '_blank');
        } else {
            navigate(link);
        }
    };

    const currentBanner = bannerSlides[currentSlide];

    // Render Aaditya banner (original)
    const renderAadityaBanner = () => (
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
                    className="inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg shadow-sm bg-white hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
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
    );

    // Render promotional banners (GyanDhan / Scaler style)
    const renderPromoBanner = (slide: typeof bannerSlides[1]) => (
        <>
            {/* Logo in top-right corner */}
            {slide.logo && (
                <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
                    <img
                        src={slide.logo}
                        alt={`${slide.title} logo`}
                        className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto"
                    />
                </div>
            )}

            {/* Content */}
            <div className="z-10 relative pr-24 sm:pr-28 md:pr-0">
                <h2 className="text-sm sm:text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 md:mb-4">
                    {slide.title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-4 sm:mb-6 md:mb-8 max-w-[180px] sm:max-w-xs md:max-w-lg">
                    {slide.subtitle}
                </p>

                <button
                    onClick={() => handleBannerButtonClick(slide.link || '/')}
                    className="inline-flex items-center justify-center px-3 py-1.5 sm:px-5 sm:py-2.5 md:px-8 md:py-4 text-xs sm:text-sm md:text-base lg:text-lg font-semibold rounded-full shadow-lg bg-white hover:bg-gray-50 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
                    style={{ color: slide.buttonTextColor }}
                >
                    {slide.buttonText}
                    <ArrowUpRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" style={{ color: slide.buttonTextColor }} />
                </button>
            </div>

            {/* Illustration image */}
            {slide.image && (
                <div className="absolute bottom-0 right-0 sm:right-2 md:right-6 h-full flex items-end justify-end z-10 pointer-events-none">
                    <img
                        src={slide.image}
                        alt={`${slide.title} illustration`}
                        className="h-24 sm:h-32 md:h-44 lg:h-56 xl:h-64 w-auto object-contain"
                    />
                </div>
            )}
        </>
    );

    return (
        <section className="bg-white py-8 md:py-16">
            <div className="container mx-auto px-4 md:px-38">
                <div
                    className="relative overflow-hidden rounded-xl p-6 md:p-12 lg:p-16 transition-all duration-700 ease-in-out"
                    style={{ background: currentBanner.gradient }}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Content */}
                    <div className="transition-opacity duration-500">
                        {currentBanner.id === 'aaditya'
                            ? renderAadityaBanner()
                            : renderPromoBanner(currentBanner as typeof bannerSlides[1])
                        }
                    </div>

                    {/* Decorative elements for Aaditya banner */}
                    {currentBanner.id === 'aaditya' && (
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
                    )}


                </div>

                {/* Navigation Dots - Outside the card */}
                <div className="flex justify-center mt-6 gap-2">
                    {bannerSlides.map((slide, index) => (
                        <button
                            key={slide.id}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 hover:cursor-pointer ${index === currentSlide
                                ? 'w-6 bg-[#13097D]'
                                : 'w-2 bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CourseBannerSection;