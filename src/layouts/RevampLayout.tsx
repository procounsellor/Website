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
import EnquiryPopup from "@/components/Revamp/shared/EnquiryPopup";

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
        if (!isAuthenticated) {
            return;
        }

        if (role === 'proBuddy') {
            const isAllowedPath =
                location.pathname.startsWith('/community') ||
                location.pathname === '/pro-buddies/dashboard';

            if (!isAllowedPath) {
                navigate('/community', { replace: true });
                return;
            }

            if (user && !user.verified && location.pathname !== '/pro-buddies/dashboard') {
                navigate('/pro-buddies/dashboard', { replace: true });
            }

            return;
        }

        if (role === 'counselor') {
            const isAllowedPath =
                location.pathname.startsWith('/community') ||
                location.pathname === '/counsellor-dashboard';

            if (!isAllowedPath) {
                navigate('/community', { replace: true });
            }
        }
    }, [isAuthenticated, role, user, location.pathname, navigate]);

    const isRestrictedRole =
        isAuthenticated && (role === 'proBuddy' || role === 'counselor');

    return <div className="flex flex-col min-h-screen relative">
        <RevampHeader />
        <RevampBreadcrumbs />
        <div className="flex-1">
            <Outlet />
        </div>
        {!isRestrictedRole && <Footer />}
        {!isRestrictedRole && <EnquiryPopup />}
        
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

        {!isRestrictedRole && (
            <button
                onClick={toggleChatbot}
                className="fixed right-0 md:right-6 bottom-1 md:bottom-6 z-50 flex h-32 w-32 cursor-pointer items-center justify-center transition-transform duration-300 hover:scale-110"
                aria-label="Toggle Chatbot"
            >
                {chatbotAnimation ? (
                    <Lottie animationData={chatbotAnimation} loop autoplay className="h-full w-full" />
                ) : (
                    <div className="h-16 w-16 rounded-full bg-[#0E1629]" />
                )}
            </button>
        )}

        {!isRestrictedRole && isChatbotOpen && <Chatbot />}
    </div>
}
