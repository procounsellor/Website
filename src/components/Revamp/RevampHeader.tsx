const tabs = [
    {id:1, name:'Admission', icon:"/admission.png"},
    {id:2, name:'Explore Courses', icon:'something'},
    {id:3, name:'Community', icon:'/community.png'},
    {id:4, name:'ProBuddies', icon:'/buddy.png'},
    {id:5, name:'About us', icon:'something'}
]


export default function RevampHeader(){
    return <div className="bg-white w-full h-40 px-[60px] py-4.5 flex flex-col gap-3">

        <div className="flex justify-between">
            <div className="flex items-center gap-2">

                <img src="/logo.svg" alt="procounsel_logo" className="h-10.5 w-10.5" />

                <h1 className="text-[#232323] font-semibold text-[1.25rem]">ProCounsel</h1>

            </div>


            <button className="bg-(--btn-primary) py-2.5 px-4 text-white font-medium rounded-[8px] border border-(--btn-primary) hover:cursor-pointer">
                Login/Sign Up
            </button>
        </div>




        <div className="flex gap-15 px-2.5 pb-6 justify-center">

            {tabs.map((tab)=>(
                <div key={tab.id} className="flex items-center p-4">
                    <div className="flex items-center justify-center max-h-[60px] max-w-[60px]"><img src={tab.icon} alt={tab.name} className="h-20 w-20"/></div>
                    <h1 className="text-[#0E1629] font-medium text-[1.125rem]">{tab.name}</h1>
                </div>
            ))}


        </div>

    </div>
}