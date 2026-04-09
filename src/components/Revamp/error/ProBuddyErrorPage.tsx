export default function ProBuddyProfileError({ onRetry }: { onRetry: () => void }) {
    return (
        <div
            className="w-full min-h-screen"
            style={{
                background:
                    'linear-gradient(0deg, rgba(198, 221, 240, 0.25), rgba(198, 221, 240, 0.25)), #FFFFFF',
            }}
        >
            <div className="max-w-[1440px] mx-auto">
                <div className="px-4 md:px-16 pt-6 md:pt-10 pb-6 md:pb-10">
                    <div className="flex flex-col xl:flex-row gap-6 items-start">
                        <div className="bg-white rounded-[8px] md:rounded-[16px] p-[16px] md:p-[24px] w-[350px] mx-auto md:w-full xl:max-w-[716px] min-h-[438px] font-['Poppins'] flex flex-col justify-center items-start">
                            <p className="font-semibold text-[#0e1629] text-[18px] md:text-[28px] leading-[1.25]">
                                We could not load this ProBuddy profile
                            </p>
                            <p className="mt-3 font-normal text-[#6b7280] text-[13px] md:text-[16px] leading-[20px] md:leading-[26px] max-w-[560px]">
                                Please check your internet connection and try again. If the issue continues, this profile might be temporarily unavailable.
                            </p>
                            <button
                                onClick={onRetry}
                                className="mt-5 bg-[#0e1629] rounded-[12px] px-4 py-2.5 font-medium text-[14px] md:text-[16px] text-white"
                            >
                                Retry
                            </button>
                        </div>

                        <div className="w-full xl:w-auto xl:sticky xl:top-4">
                            <div className="bg-white rounded-[8px] md:rounded-[16px] p-[12px] w-[350px] mx-auto md:w-full xl:w-[580px] h-[161px] md:h-[170px] flex items-center justify-center">
                                <p className="font-medium text-[#6b7280] text-[14px] md:text-[16px]">
                                    Booking options will appear after loading
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 md:mt-10 md:px-16 pb-6 md:pb-10 bg-[#F0F6FB] md:bg-transparent">
                    <div className="px-5 md:px-0 py-6 md:py-0">
                        <div className="bg-white rounded-[16px] border border-[#efefef] p-5 md:p-8 font-['Poppins']">
                            <p className="font-semibold text-[#0e1629] text-[16px] md:text-[24px] leading-normal">
                                This section is unavailable right now
                            </p>
                            <p className="mt-2 font-normal text-[#6b7280] text-[13px] md:text-[16px] leading-[20px] md:leading-[24px]">
                                Try reloading to fetch ratings, insights, and mentoring details.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-16">
                <div className="bg-white rounded-[16px] border border-[#efefef] p-5 font-['Poppins']">
                    <p className="font-semibold text-[#0e1629] text-[15px] md:text-[18px]">
                        Reviews are temporarily unavailable
                    </p>
                </div>
            </div>

            <div className="h-8 md:h-10" />

            <div className="bg-white">
                <div className="max-w-[1440px] mx-auto md:border-t md:border-[#E5E7EB]">
                    <div className="py-8 md:py-16 text-center px-4 font-['Poppins']">
                        <p className="font-semibold text-[#0e1629] text-[18px] md:text-2xl leading-snug">
                            Ready to Make Your College Decision?
                        </p>
                        <p className="mt-3 font-normal text-[#6b7280] text-[14px] md:text-base leading-normal">
                            Profile data is currently unavailable. Retry to continue.
                        </p>
                        <button
                            onClick={onRetry}
                            className="mt-6 bg-[#2f43f2] rounded-[12px] px-4 py-2.5 w-full max-w-[357px] font-medium text-base text-white"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}