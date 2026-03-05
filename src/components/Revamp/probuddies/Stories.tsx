import StoriesCard from "./StoriesCard";

export default function Stories(){
    return (
        <div className=" w-full h-[557px] py-10 pb-[95px] px-[60px] flex flex-col items-center gap-8">

            <h1 className="text-(--text-main) font-bold text-2xl">Success Stories</h1>

            <div className="flex gap-10 items-end justify-center">
                <StoriesCard active={false}/>
                <StoriesCard active={true}/>
                <StoriesCard active={false}/>

            </div>

        </div>
    );
}