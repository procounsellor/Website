import Header from "@/components/Header";
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
            <p>This is procounsel @2025</p>
           </footer>

        </div>
    );
}