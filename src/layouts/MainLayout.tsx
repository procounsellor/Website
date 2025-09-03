import { Header } from "@/components";
import Footer from "@/components/layout/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout(){
    return (
        <div>
           <nav>
             <Header/>
           </nav>

           <main>
            <Outlet/>
           </main>

           <footer>
            <Footer/>
           </footer>

        </div>
    );
}