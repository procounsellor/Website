import Footer from "@/components/layout/Footer";
import RevampHeader from "@/components/Revamp/RevampHeader";
import RevampBreadcrumbs from "@/components/Revamp/RevampBreadcrumbs";
import { Outlet } from "react-router-dom";
import { LoginCard } from "@/components/cards/LoginCard";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/AuthStore";

export default function RevampLayout() {
    const { isLoginToggle } = useAuthStore();

    return <div className="flex flex-col min-h-screen relative">
        <RevampHeader />
        <RevampBreadcrumbs />
        <div className="flex-1">
            <Outlet />
        </div>
        <Footer />
        
        {isLoginToggle && <LoginCard />}
        <Toaster 
            position="top-center"
            toastOptions={{
                duration: 3000,
                style: {
                    background: "#363636",
                    color: "#fff",
                },
            }}
        />
    </div>
}