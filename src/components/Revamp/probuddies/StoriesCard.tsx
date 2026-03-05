export default function StoriesCard({ active }: { active: boolean }) {
  return (
    <div
      className={`${active ? "min-h-[362px]" : "min-h-[317px]"} ${active ? "max-w-[498px]" : "max-w-[370px]"}
    ${active ? "bg-(--text-main)" : "bg-white"} shadow-[0_0px_25px_0px_rgba(0,0,0,0.07)] rounded-[15px]
    py-9 px-4 flex flex-col gap-[30px]
    `}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <img src={`${active ? "/2nd.png" : "/1st.png"}`} alt="person_icon" className={`${active ? "h-20 w-20" : "w-[75px] h-[75px]"} rounded-full`}/>

          <div className="flex flex-col">
            <h1 className={`${active ? "text-[30px] text-white": "text-[22.5px] text-(--text-main) " } font-semibold`}>Leo</h1>
            <p className={`${active ? "text-white text-[22px]" : "text-(--text-muted) text-[15px]"} font-normal`}>Lead Designer</p>
          </div>
        </div>

        <div
        className="flex items-end"
        >
            <img
             src={`${active ? "/2st.svg" : "/1st.svg"}`} alt="stars" />
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <h1 className={`${active ? "text-2xl text-white": "text-(--text-main) text-[22.5px]"} font-medium`}>It was a very good experience</h1>
        <p className={`text-center ${active ? "text-white text-[1rem]" : "text-sm text-(--text-muted)"}  font-normal`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas. Suspendisse sed magna eget nibh in turpis. Consequat duis diam lacus arcu.</p>
      </div>
    </div>
  );
}
