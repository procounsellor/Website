export default function StoriesCard({ active }: { active: boolean }) {
  return (
    <div
      className={`relative shrink-0 w-[290px] h-[181px] md:w-auto md:h-auto ${active ? "md:min-h-[362px]" : "md:min-h-[317px]"} ${active ? "md:max-w-[498px]" : "md:max-w-[370px]"}
    ${active ? "bg-[#0E1629] md:bg-(--text-main)" : "bg-white"} shadow-[0_0px_25px_0px_rgba(0,0,0,0.07)] rounded-[15px]
    md:py-9 md:px-4 flex flex-col md:gap-[30px]
    `}
    >
      {/* --- MOBILE VIEW --- */}
      <div className="md:hidden flex flex-col p-[12px] w-full h-full">
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-[10px]">
            <img src={`${active ? "/2nd.png" : "/1st.png"}`} alt="person_icon" className="w-[36px] h-[36px] rounded-full object-cover"/>
            <div className="flex flex-col">
              <h1 className={`${active ? "text-white" : "text-[#0E1629]"} font-[Poppins] font-semibold text-[16px] leading-none`}>Leo</h1>
              <p className={`${active ? "text-white" : "text-[#6B7280]"} font-[Poppins] font-normal text-[12px] leading-none mt-1`}>Lead Designer</p>
            </div>
          </div>
          <img
             src={`${active ? "/2st.svg" : "/1st.svg"}`}
             alt="stars"
             className="w-[96px] h-[16px] object-contain mt-1"
          />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <h1 className={`${active ? "text-white" : "text-[#0E1629]"} font-[Poppins] font-medium text-[14px] leading-none text-left`}>It was a very good experience</h1>
          <p className={`${active ? "text-white" : "text-[#6B7280]"} font-[Poppins] font-normal text-[12px] leading-[1.3] text-left line-clamp-3`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.
          </p>
        </div>
      </div>

      <div className="hidden md:flex justify-between w-full">
        <div className="flex items-center gap-4">
          <img src={`${active ? "/2nd.png" : "/1st.png"}`} alt="person_icon" className={`${active ? "h-20 w-20" : "w-[75px] h-[75px]"} rounded-full`}/>

          <div className="flex flex-col">
            <h1 className={`${active ? "text-[30px] text-white": "text-[22.5px] text-(--text-main) " } font-semibold`}>Leo</h1>
            <p className={`${active ? "text-white text-[22px]" : "text-(--text-muted) text-[15px]"} font-normal`}>Lead Designer</p>
          </div>
        </div>

        <div className="flex items-end">
            <img src={`${active ? "/2st.svg" : "/1st.svg"}`} alt="stars" />
        </div>
      </div>

      <div className="hidden md:flex flex-col gap-4 items-center w-full">
        <h1 className={`${active ? "text-2xl text-white": "text-(--text-main) text-[22.5px]"} font-medium`}>It was a very good experience</h1>
        <p className={`text-center ${active ? "text-white text-[1rem]" : "text-sm text-(--text-muted)"} font-normal`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.</p>
      </div>
    </div>
  );
}