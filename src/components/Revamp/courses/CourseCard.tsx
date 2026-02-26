import { useState } from "react";

export default function CourseCard(){
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative w-[308px] h-[331px] cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <svg
                className="absolute"
                xmlns="http://www.w3.org/2000/svg" width="308" height="331" viewBox="0 0 308 331" fill="none"
            >
                <path d="M296.154 0C302.696 4.54258e-06 308 5.26132 308 11.7515V256.325C308 262.953 302.627 268.325 296 268.325H257.257C251.199 268.325 246.091 272.84 245.347 278.852L240.199 320.473C239.456 326.485 234.348 331 228.29 331H11.8462C5.30371 331 8.34774e-08 325.739 0 319.249V11.7515C2.09886e-06 5.26132 5.30371 2.36593e-07 11.8462 0H296.154Z" fill="white"/>
            </svg>

            <div className="absolute flex flex-col w-full h-full z-10 p-3">
                    <img src="/banner.jpg" alt="banner_image" className="w-full -h-[167px] rounded-[8px]" />
                <h1 className="font-medium mt-2.5 text-[1rem] text-(--text-main)">Lorem ipsum dolor sit amet</h1>
               
                <p className="text-(--text-muted) font-medium text-[0.875rem] mt-auto mb-[6px]">By Sarah Jhonson</p>
            </div>

            <div className="absolute bottom-0 right-[-1px] overflow-hidden">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="61"
                    height="57"
                    viewBox="0 0 61 57"
                    fill="none"
                    className="transition-all duration-300"
                >
                    <path
                        d="M5.0628 7.03103C5.55256 3.01727 8.96036 0 13.0039 0H52.9656C57.3838 0 60.9656 3.58172 60.9656 8V49C60.9656 53.4183 57.3839 57 52.9656 57H8.00107C3.1985 57 -0.521724 52.7982 0.0599715 48.031L5.0628 7.03103Z"
                        fill={isHovered ? "white" : "#0E1629"}
                        className="transition-colors duration-300"
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20px] h-[20px]">
                    {/* Arrow going out to right - white arrow on dark bg (default) */}
                    <img
                        src="/arrow.svg"
                        alt="arrow"
                        className={`absolute inset-0 w-full h-full transition-all duration-600 ${
                            isHovered
                                ? 'translate-x-[30px] opacity-0'
                                : 'translate-x-0 opacity-100'
                        }`}
                        style={{ filter: 'brightness(0) invert(1)' }}
                    />
                    {/* Arrow coming in from left - dark arrow on white bg (hover) */}
                    <img
                        src="/arrow.svg"
                        alt="arrow"
                        className={`absolute inset-0 w-full h-full transition-all duration-600 ${
                            isHovered
                                ? 'translate-x-0 opacity-100'
                                : '-translate-x-[30px] opacity-0'
                        }`}
                        style={{ filter: 'brightness(0)' }}
                    />
                </div>
            </div>
        </div>
    );
}