import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import RevampHeader from "@/components/Revamp/RevampHeader";
import RevampBreadcrumbs from "@/components/Revamp/RevampBreadcrumbs";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LoginCard } from "@/components/cards/LoginCard";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/AuthStore";
import { useChatStore } from "@/store/ChatStore";
import Chatbot from "@/components/chatbot/Chatbot";
import Lottie from "lottie-react";

export default function RevampLayout() {
    const { isLoginToggle, role, user, isAuthenticated } = useAuthStore();
    const { isChatbotOpen, toggleChatbot } = useChatStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [chatbotAnimation, setChatbotAnimation] = useState<object | null>(null);

    useEffect(() => {
        let isMounted = true;

        fetch("/chatbot.json")
            .then((response) => response.json())
            .then((data) => {
                if (isMounted) {
                    setChatbotAnimation(data);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setChatbotAnimation(null);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (isAuthenticated && role === 'proBuddy' && user && !user.verified) {
            if (location.pathname !== '/pro-buddies/dashboard') {
                navigate('/pro-buddies/dashboard', { replace: true });
            }
        }
    }, [isAuthenticated, role, user, location.pathname, navigate]);

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

        <button
            onClick={toggleChatbot}
            className="fixed right-3 md:right-6 bottom-3 md:bottom-6 z-50 flex h-32 w-32~ cursor-pointer items-center justify-center transition-transform duration-300 hover:scale-110"
            aria-label="Toggle Chatbot"
        >
            {chatbotAnimation ? (
                <Lottie animationData={chatbotAnimation} loop autoplay className="h-full w-full" />
            ) : (
                <div className="h-16 w-16 rounded-full bg-[#0E1629]" />
            )}
        </button>

        {isChatbotOpen && <Chatbot />}
    </div>
}