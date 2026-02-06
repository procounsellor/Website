import Footer from "@/components/layout/Footer";
import RevampHeader from "@/components/Revamp/RevampHeader";

import { Outlet } from "react-router-dom";

export default function RevampLayout(){
    return <div>
        <RevampHeader/>
        <Outlet />
        <Footer/>
    </div>
}