import { Header } from "@/components";
import Footer from "@/components/layout/Footer";
import { Outlet } from "react-router-dom";
import { LoginCard } from "@/components/cards/LoginCard";
import OnboardingCard from "@/components/cards/OnboardingCard";
import { useAuthStore } from "@/store/AuthStore";
import { Toaster } from "react-hot-toast";

export default function MainLayout(){
  const { isLoginToggle, isAuthenticated, userExist } = useAuthStore();
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
           {isLoginToggle && <LoginCard/>}
           {isAuthenticated && userExist && isLoginToggle &&  <OnboardingCard/>}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
           />

        </div>
    );
}