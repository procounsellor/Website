import Footer from "@/components/layout/Footer";
import RevampHeader from "@/components/Revamp/RevampHeader";
import PageTransition from "@/components/common/PageTransition";

import { Outlet, useLocation } from "react-router-dom";

export default function RevampLayout(){
    const location = useLocation();
    
    return <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-50 bg-[#C6DDF040]">
            <RevampHeader/>
        </div>
        <div className="flex-1">
            <PageTransition transitionKey={location.pathname}>
                <Outlet />
            </PageTransition>
        </div>
        <Footer/>
    </div>
}