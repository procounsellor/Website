import Footer from "@/components/layout/Footer";
import RevampHeader from "@/components/Revamp/RevampHeader";

import { Outlet } from "react-router-dom";

export default function RevampLayout(){
    return <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-50 bg-[#C6DDF040]">
            <RevampHeader/>
        </div>
        <div className="flex-1">
            <Outlet />
        </div>
        <Footer/>
    </div>
}