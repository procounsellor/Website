import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useChatStore } from "@/store/ChatStore";
import ChatInput from "./components/ChatInput";
import ChatMessage from "./components/ChatMessage";
import { ChatbotCounselorCard } from "./components/ChatbotCounselorCard";
import { X, Sparkles } from "lucide-react";
import type { AllCounselor } from "@/types/academic";

const TypingIndicator = () => (
    <div className="flex items-end gap-2.5">
         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
        </div>
        <div className="px-4 py-3 rounded-2xl bg-gray-100 rounded-bl-none shadow-sm">
            <div className="flex items-center justify-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></span>
            </div>
        </div>
    </div>
);

const WelcomeMessage = () => (
    <div className="text-center p-8">
        <div className="inline-block p-4 bg-orange-100 rounded-full">
            <Sparkles className="h-8 w-8 text-[#FA660F]" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-800">ProCounsel GPT</h2>
        <p className="mt-2 text-gray-500">Your personal guide to colleges and exams in India. <br/> How can I help you today?</p>
    </div>
);

export default function Chatbot() {
  const { messages, loading, sendMessage, toggleChatbot } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-50 to-gray-100 z-[100] flex flex-col animate-in fade-in-20">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#FA660F]" />
            <h2 className="text-lg font-semibold text-gray-800">ProCounsel GPT</h2>
        </div>
        <button onClick={toggleChatbot} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close Chat">
          <X className="h-6 w-6 text-gray-600" />
        </button>
      </header>
      
      {/* THIS IS THE FIX: Added padding-bottom to make space for the footer */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-8 md:pb-8">
        <div className="max-w-3xl mx-auto w-full space-y-6">
            {messages.length === 0 && !loading && <WelcomeMessage />}
            {messages.map((msg, idx) => (
                <div key={idx}>
                <ChatMessage text={msg.text} isUser={msg.isUser} />
                {msg.counsellors && msg.counsellors.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in-50 duration-500">
                    {(msg.counsellors as AllCounselor[]).map((c) => (
                        <Link className="w-fit" to={`/counselors/${c.counsellorId}`} key={c.counsellorId} onClick={toggleChatbot}>
                            <ChatbotCounselorCard counselor={c} />
                        </Link>
                    ))}
                    </div>
                )}
                </div>
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
        </div>
      </main>
      
      {/* THIS IS THE FIX: The footer is now a fixed element at the bottom */}
      <footer className="p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={sendMessage} />
        </div>
      </footer>
    </div>
  );
}