import Lottie from "lottie-react";
import { useState } from "react";

const tabs = [
    {id:1, name:'Admission', animationPath: '/admission.json', iconPath: '/Admissions.png'},
    {id:2, name:'Courses', animationPath: '/courses.json', iconPath: '/Courses.svg'},
    {id:3, name:'Community', animationPath: '/community.json', iconPath: '/Community.png'},
    {id:4, name:'ProBuddies', animationPath: '/probuddy.json', iconPath: '/ProBuddy.png'},
    {id:5, name:'About us', animationPath: '/admission.json', iconPath: '/Admissions.png'}
]


export default function RevampHeader(){
    const [activeTab, setActiveTab] = useState(1);

    return <div className="bg-[#C6DDF040] w-full h-40 px-[60px] py-4.5 flex flex-col gap-3">

        <div className="flex justify-between">
            <div className="flex items-center gap-2">

                <img src="/logo.svg" alt="procounsel_logo" className="h-10.5 w-10.5" />

                <h1 className="text-[#232323] font-semibold text-[1.25rem]">ProCounsel</h1>

            </div>


            <button className="bg-(--btn-primary) py-2 px-4 text-white text-xs font-medium rounded-[12px] border border-(--btn-primary) hover:cursor-pointer">
                Login/Sign Up
            </button>
        </div>




        <div className="flex gap-[35px] px-2.5 pb-6 justify-center">

            {tabs.map((tab)=>(
                <div 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)}
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
                </div>
            ))}


        </div>

    </div>
}