import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import { Routes, Route } from "react-router-dom";

export default function AppRoutes(){
    return(
         <Routes>
         <Route element={<MainLayout/>}>
            <Route path="/" element={<Home/>}/>
         </Route>
          </Routes>
    );
}