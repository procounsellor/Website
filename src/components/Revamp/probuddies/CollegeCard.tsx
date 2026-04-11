import { useState } from "react";

export default function Card() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            <div
                className="relative w-50 h-68.75 cursor-pointer md:hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <svg
                    className="absolute inset-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 275"
                    fill="none"
                >
                    <path
                        d="M192.308 0C196.556 3.77405e-06 200 4.37119 200 9.76331V215.991C200 222.619 194.627 227.991 188 227.991L166.064 227.991C160.478 227.991 155.631 231.846 154.372 237.288L147.802 265.703C146.543 271.146 141.696 275 136.11 275H7.69231C3.44397 275 5.42061e-08 270.629 0 265.237V9.76331C1.36289e-06 4.37119 3.44396 1.96565e-07 7.69231 0H192.308Z"
                        fill="white"
                    />
                </svg>

                <div className="absolute inset-0 z-10 flex flex-col p-3">
                    <div className="h-37.75 w-full overflow-hidden rounded-xl bg-[#F5F5F5]">
                        <img src="/college.jpg" alt="college_image" className="h-full w-full object-cover" />
                    </div>

                   <div className="flex flex-col gap-2 justify-between mt-3">
                     <h1 className="text-sm font-medium text-(--text-main)">
                        Lorem ipsum dolor sit amet consectetur.
                    </h1>
                    <p className=" flex flex-col text-xs font-medium text-(--text-muted)">
                        24 Courses
                        <span>Greater Noida</span>
                    </p>
                   </div>
                </div>

                <div className="absolute bottom-0 right-0 overflow-hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="76"
                        height="41"
                        viewBox="0 0 76 41"
                        fill="none"
                        className="transition-colors duration-300"
                    >
                        <path
                            d="M35.8427 6.23929C36.6658 2.5911 39.9067 0 43.6466 0H68C72.4183 0 76 3.58172 76 8V33C76 37.4183 72.4183 41 68 41H38.0061C32.8774 41 29.0735 36.2421 30.2022 31.2393L35.8427 6.23929Z"
                            fill={isHovered ? "white" : "#0E1629"}
                        />
                    </svg>

                    <div className="absolute right-3.25 top-1/2 h-5 w-5 -translate-y-1/2 overflow-hidden">
                        <img
                            src="/arrow.svg"
                            alt="arrow"
                            className={`absolute inset-0 h-full w-full transition-all duration-500 ${isHovered ? "translate-x-7.5 opacity-0" : "translate-x-0 opacity-100"}`}
                            style={{ filter: "brightness(0) invert(1)" }}
                        />
                        <img
                            src="/arrow.svg"
                            alt="arrow"
                            className={`absolute inset-0 h-full w-full transition-all duration-500 ${isHovered ? "translate-x-0 opacity-100" : "-translate-x-7.5 opacity-0"}`}
                            style={{ filter: "brightness(0)" }}
                        />
                    </div>
                </div>
            </div>

            <div
                className="relative hidden h-82.75 w-77 cursor-pointer md:block"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <svg
                    className="absolute inset-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="308"
                    height="331"
                    viewBox="0 0 308 331"
                    fill="none"
                >
                    <path d="M296.154 0C302.696 4.54258e-06 308 5.26132 308 11.7515V256.325C308 262.953 302.627 268.325 296 268.325H257.257C251.199 268.325 246.091 272.84 245.347 278.852L240.199 320.473C239.456 326.485 234.348 331 228.29 331H11.8462C5.30371 331 8.34774e-08 325.739 0 319.249V11.7515C2.09886e-06 5.26132 5.30371 2.36593e-07 11.8462 0H296.154Z" fill="white" />
                </svg>

                <div className="absolute z-10 flex h-full w-full flex-col p-3">
                    <img src="/college.jpg" alt="college_image" className="h-41.75 w-full rounded-xl object-cover" />
                    <h1 className="mt-2.5 text-[1rem] font-medium text-(--text-main)">Lorem ipsum dolor sit amet consectetur.</h1>
                    <p className="mt-auto mb-1.5 text-[0.875rem] font-medium text-(--text-muted)">24 Courses | Hyderabad</p>
                </div>

                <div className="absolute -right-px bottom-0 overflow-hidden">
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
                    <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2">
                        <img
                            src="/arrow.svg"
                            alt="arrow"
                            className={`absolute inset-0 h-full w-full transition-all duration-500 ${isHovered ? "translate-x-7.5 opacity-0" : "translate-x-0 opacity-100"}`}
                            style={{ filter: "brightness(0) invert(1)" }}
                        />
                        <img
                            src="/arrow.svg"
                            alt="arrow"
                            className={`absolute inset-0 h-full w-full transition-all duration-500 ${isHovered ? "translate-x-0 opacity-100" : "-translate-x-7.5 opacity-0"}`}
                            style={{ filter: "brightness(0)" }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export function CollegeListingCard() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            <div
                className="relative h-66.5 w-42.25 cursor-pointer md:hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <svg
                    className="absolute inset-0 h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    width="169"
                    height="266"
                    viewBox="0 0 169 266"
                    fill="none"
                >
                    <path
                        d="M162.5 0C166.09 3.65054e-06 169 4.22813 169 9.44379V209C169 215.627 163.627 221 157 221H137.838C132.117 221 127.192 225.038 126.071 230.647L120.929 256.353C119.808 261.962 114.883 266 109.162 266H6.5C2.91015 266 4.58041e-08 261.772 0 256.556V9.44379C1.15165e-06 4.22813 2.91015 1.90132e-07 6.5 0H162.5Z"
                        fill="white"
                    />
                </svg>

                <div className="absolute inset-0 z-10 flex flex-col p-3">
                    <div className="h-37.75 w-full overflow-hidden rounded-xl bg-[#F5F5F5]">
                        <img src="/college.jpg" alt="college_image" className="h-full w-full object-cover" />
                    </div>

                    <div className="mt-3 flex flex-col justify-between gap-2">
                        <h1 className="text-sm font-medium text-(--text-main)">
                            Lorem ipsum dolor sit amet consectetur.
                        </h1>
                        <p className="flex flex-col text-xs font-medium text-(--text-muted)">
                            24 Courses
                            <span>Greater Noida</span>
                        </p>
                    </div>
                </div>

                <div className="absolute -right-px bottom-[1.5px] h-10 w-10.75 overflow-hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="43"
                        height="40"
                        viewBox="0 0 43 40"
                        preserveAspectRatio="none"
                        fill="none"
                        className="h-10 w-10.75 transition-colors duration-300"
                    >
                        <path
                            d="M4.95793 6.43108C5.7058 2.69168 8.98912 0 12.8026 0H34.2441C38.6623 0 42.2441 3.58172 42.2441 8V32C42.2441 36.4183 38.6623 40 34.2441 40H8.00258C2.95421 40 -0.832141 35.3814 0.157926 30.4311L4.95793 6.43108Z"
                            fill={isHovered ? "white" : "#0E1629"}
                        />
                    </svg>

                    <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 overflow-hidden">
                        <img
                            src="/arrow.svg"
                            alt="arrow"
                            className={`absolute inset-0 h-full w-full transition-all duration-500 ${isHovered ? "translate-x-7.5 opacity-0" : "translate-x-0 opacity-100"}`}
                            style={{ filter: "brightness(0) invert(1)" }}
                        />
                        <img
                            src="/arrow.svg"
                            alt="arrow"
                            className={`absolute inset-0 h-full w-full transition-all duration-500 ${isHovered ? "translate-x-0 opacity-100" : "-translate-x-7.5 opacity-0"}`}
                            style={{ filter: "brightness(0)" }}
                        />
                    </div>
                </div>
            </div>

            <div
                className="relative hidden h-82.75 w-77 cursor-pointer md:block"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <svg
                    className="absolute inset-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="308"
                    height="331"
                    viewBox="0 0 308 331"
                    fill="none"
                >
                    <path d="M296.154 0C302.696 4.54258e-06 308 5.26132 308 11.7515V256.325C308 262.953 302.627 268.325 296 268.325H257.257C251.199 268.325 246.091 272.84 245.347 278.852L240.199 320.473C239.456 326.485 234.348 331 228.29 331H11.8462C5.30371 331 8.34774e-08 325.739 0 319.249V11.7515C2.09886e-06 5.26132 5.30371 2.36593e-07 11.8462 0H296.154Z" fill="white" />
                </svg>

                <div className="absolute z-10 flex h-full w-full flex-col p-3">
                    <img src="/college.jpg" alt="college_image" className="h-41.75 w-full rounded-xl object-cover" />
                    <h1 className="mt-2.5 text-[1rem] font-medium text-(--text-main)">Lorem ipsum dolor sit amet consectetur.</h1>
                    <p className="mb-1.5 mt-auto text-[0.875rem] font-medium text-(--text-muted)">24 Courses | Hyderabad</p>
                </div>

                <div className="absolute -right-px bottom-0 overflow-hidden">
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
                    <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2">
                        <img
                            src="/arrow.svg"
                            alt="arrow"
                            className={`absolute inset-0 h-full w-full transition-all duration-500 ${isHovered ? "translate-x-7.5 opacity-0" : "translate-x-0 opacity-100"}`}
                            style={{ filter: "brightness(0) invert(1)" }}
                        />
                        <img
                            src="/arrow.svg"
                            alt="arrow"
                            className={`absolute inset-0 h-full w-full transition-all duration-500 ${isHovered ? "translate-x-0 opacity-100" : "-translate-x-7.5 opacity-0"}`}
                            style={{ filter: "brightness(0)" }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}