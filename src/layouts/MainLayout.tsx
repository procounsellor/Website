import { Header } from "@/components";
import Footer from "@/components/layout/Footer";
import { Outlet } from "react-router-dom";
import { LoginCard } from "@/components/cards/LoginCard";
import OnboardingCard from "@/components/cards/OnboardingCard";
import { useAuthStore } from "@/store/AuthStore";
import { Toaster } from "react-hot-toast";
import { useChatStore } from "@/store/ChatStore";
import Chatbot from "@/components/chatbot/Chatbot";
import { MessageSquare } from "lucide-react";
import { useVoiceChatStore } from "@/store/VoiceChatStore";
import VoiceChat from "@/components/chatbot/VoiceChat";
export default function MainLayout(){
  const { isLoginToggle, isAuthenticated, userExist } = useAuthStore();
    const { isChatbotOpen, toggleChatbot } = useChatStore();
   const { isVoiceChatOpen} = useVoiceChatStore();
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
           <button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 bg-[#FA660F] text-white w-16 h-16 flex items-center justify-center rounded-full shadow-lg z-50 hover:bg-orange-600 transition-all duration-300 transform hover:scale-110"
        aria-label="Toggle Chatbot"
      >
        <MessageSquare size={32} />
      </button>

      {isChatbotOpen && <Chatbot />}
      {/* <button
        onClick={toggleVoiceChat}
        
      >
        <Mic size={32} />
      </button> */}

      {/* Render the voice chat UI when open */}
      {isVoiceChatOpen && <VoiceChat />}

        </div>
    );
}