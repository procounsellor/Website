import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User2, LogOut, LayoutDashboard, Sparkles,  Square } from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import { Button } from "../ui";
import toast from "react-hot-toast";
import ChatInput from "./components/ChatInput";
import Sidear from "./components/Sidear";
import ChatMessage from "./components/ChatMessage";
import { ChatbotCounselorCard } from "./components/ChatbotCounselorCard";
import { useChatStore } from "@/store/ChatStore";
import { useAuthStore } from "@/store/AuthStore";
import ReactMarkdown from 'react-markdown';


// Small reusable UI pieces from the second file
const TypingIndicator = () => (
  <div className="flex items-end gap-2.5">
  
    <div className="rounded-2xl px-4 py-3  bg-[#2a2a2a]  shadow-sm">
      <div className=" flex items-center justify-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></span>
        <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></span>
        <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></span>
      </div>
    </div>
  </div>
);

const WelcomeMessage = () => (
  <div className="text-center p-8">
    <div className="inline-block p-3 bg-[#2a2a2a] rounded-full">
      <Sparkles className="h-8 w-8 text-[#FA660F]" />
    </div>
    <h2 className="mt-4 text-2xl font-semibold text-white">ProCounsel GPT</h2>
    <p className="mt-2 text-gray-400">Your personal guide to colleges and exams in India.<br />How can I help you today?</p>
  </div>
);

export default function Chatbot() {
  const navigate = useNavigate();
  const { messages, toggleChatbot, sendMessage, loading, loadMessages, clearMessages, stopGenerating, startNewChat } = useChatStore();
  const { toggleLogin, isAuthenticated, logout, userId, role } = useAuthStore();

  // UI state
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ id: string; title: string; timestamp: string }>>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved chat history
  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) setChatHistory(JSON.parse(saved));
  }, []);

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  // Persist messages for the current chat
  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      localStorage.setItem(`chat_${currentChatId}`, JSON.stringify(messages));
    }
  }, [messages, currentChatId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Create a new chat if none selected
    if (!currentChatId) {
      const newChatId = Date.now().toString();
      const newChat = {
        id: newChatId,
        title: input.slice(0, 30) + (input.length > 30 ? "..." : ""),
        timestamp: new Date().toISOString(),
      };
      const updated = [newChat, ...chatHistory];
      setChatHistory(updated);
      localStorage.setItem("chatHistory", JSON.stringify(updated));
      setCurrentChatId(newChatId);
    }

    // send the message via store with user information
    await sendMessage(input, userId, role);
    setInput("");
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      setCurrentChatId(null);
      clearMessages();
      startNewChat(); // ✨ Start a new session with new session ID
    }
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    const saved = localStorage.getItem(`chat_${chatId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      loadMessages(parsed);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    const updated = chatHistory.filter((c) => c.id !== chatId);
    setChatHistory(updated);
    localStorage.setItem("chatHistory", JSON.stringify(updated));
    localStorage.removeItem(`chat_${chatId}`);
    if (currentChatId === chatId) setCurrentChatId(null);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    toggleChatbot();
    navigate("/");
    toast.success("Logged out successfully!", { duration: 3000 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#232323]">
      {/* Header */}
      <header className="h-14 md:h-20 bg-[#232323] border-b border-[#FFFFFF40] shadow-[0_2px_4px_0_rgba(255,255,255,0.06)] w-full">
        <div className="flex h-full items-center justify-between px-5 lg:px-20">
          <div
            className="Logo flex cursor-pointer"
            onClick={() => {
              toggleChatbot();
              navigate("/");
            }}
          >
            <SmartImage src="/logo.svg" alt="procounsel_logo" className="h-7 w-7 md:w-11 md:h-12" width={44} height={44} priority />
            <div className="flex flex-col leading-tight pl-[9px]">
              <h1 className="text-white font-semibold text-sm md:text-xl">ProCounsel</h1>
              <span className="font-normal text-gray-400 text-[8px] md:text-[10px]">By CatalystAI</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="btn relative">
              {isAuthenticated ? (
                <>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Open user menu">
                    <User2 className="h-6 w-6 text-white" />
                  </button>

                  {isDropdownOpen && (
                    <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-48 bg-[#2a2a2a] rounded-lg shadow-xl z-50 py-1 border border-gray-700">
                      <button
                        onClick={() => {
                          navigate("/dashboard-student");
                          setIsDropdownOpen(false);
                          toggleChatbot();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        <LayoutDashboard size={16} />
                        <span>Profile</span>
                      </button>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20">
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Button variant={"outline"} className="w-full lg:w-[164px] flex items-center justify-center h-6 md:h-11 border rounded-[12px] bg-[#232323] font-semibold text-white border-[#858585] text-[10px] md:text-lg hover:bg-[#FF660F] hover:text-white hover:border-[#FF660F] transition-all duration-200" onClick={() => toggleLogin()}>
                  Login/Sign Up
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidear
          handleNewChat={handleNewChat}
          isSidebarOpen={isSidebarOpen}
          chatHistory={chatHistory}
          currentChatId={currentChatId}
          handleSelectChat={handleSelectChat}
          handleDeleteChat={handleDeleteChat}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 && !loading ? (
            <div>
              <div className="lg:mt-[11.75rem] flex flex-col items-center justify-center gap-5">
                <h1 className="text-white font-semibold text-[32px]">Procounsel GPT</h1>
                <p className="flex flex-col text-white/50 text-2xl font-medium text-center">Your personal guide to college and exams in India.<span>How can I help you today?</span></p>
              </div>

              <div className="lg:mt-[70px]">
                <ChatInput input={input} setInput={setInput} handleKeyPress={handleKeyPress} handleSend={handleSend} loading={loading} />

                <div className="flex justify-center lg:mt-4 gap-4">
                  <div className="border border-[#7B7B7B] rounded-[12px] py-2.5 px-4 flex gap-4 items-center">
                    <img src="/book.svg" alt="" />
                    <p className="text-[14px] font-medium text-white">Access premium learning courses.</p>
                  </div>
                  <div className="border border-[#7B7B7B] rounded-[12px] py-2.5 px-4 flex gap-4 items-center">
                    <img src="/cap.svg" alt="" />
                    <p className="text-[14px] font-medium text-white">Discover top colleges.</p>
                  </div>
                  <div className="border border-[#7B7B7B] rounded-[12px] py-2.5 px-4 flex gap-4 items-center">
                    <img src="/person.svg" alt="" />
                    <p className="text-[14px] font-medium text-white">Consult expert counselors.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto bg-[#232323] mt-2 p-6 scrollbar-hide">
                <div className="max-w-4xl mx-auto space-y-4">
                  {messages.length === 0 && !loading && <WelcomeMessage />}

                   {messages.map((msg: any, index: number) => {
                    
                    // --- START OF THE FIX ---
                    let formattedText = msg.text;
                    if (!msg.isUser) {
                      // This Regex finds "\n\n" ONLY IF it is followed by a number (like "1." or "2.")
                      // It replaces it with just "\n", which joins the list items.
                      formattedText = msg.text.replace(/\n\n(?=\d+\.)/g, '\n');
                    }
                    // --- END OF THE FIX ---

                    return (
                      <div key={index} className="space-y-4">
                        
                        {msg.isUser ? (
                          <ChatMessage text={msg.text} isUser={true} />
                        ) : (
                          // This is the bot message bubble
                          <div className="rounded-2xl px-4   text-white max-w-full overflow-x-auto">
                            <ReactMarkdown
                              // We pass the CLEANED "formattedText" variable here
                              children={formattedText}
                              components={{
                                // This logic from Solution 3 is still good to keep.
                                p: ({ node, ...props }) => {
                                  // @ts-ignore
                                  if (node.parent?.tagName === 'li') {
                                    return <span {...props} />;
                                  }
                                  return <p className="mb-2 last:mb-0" {...props} />;
                                },
                                ol: ({node, ...props}) => <ol className="list-decimal list-inside ml-4 space-y-2" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-inside ml-4 space-y-2" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                              }}
                            />
                          </div>
                        )}
                        
                        {msg.followup && !msg.isUser && (
                          <p className="text-gray-400 text-sm italic max-w-4xl mx-auto pl-12 pr-6 -mt-2">
                            {msg.followup}
                          </p>
                        )}

                        {/* ... (rest of your counselor card code) ... */}
                        {msg.counsellors && msg.counsellors.length > 0 && (
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in-50 duration-500">
                            {(msg.counsellors as any[]).map((c) => (
                              <Link className="w-fit" to="/counselors/profile" state={{ id: c.counsellorId }} key={c.counsellorId} onClick={toggleChatbot}>
                                <ChatbotCounselorCard counselor={c} />
                              </Link>
                            ))}
                          </div>
                        )}
                        
                      </div>
                    );
                  })}

                  {loading && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Footer with ChatInput and stop button when loading */}
              <div className="lg:mb-[3.75rem] p-4 bg-transparent">
                <div className="max-w-4xl mx-auto">
                  {loading && (
                    <div className="flex justify-center mb-3">
                      <button onClick={stopGenerating} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-sm hover:bg-[#3b3b3b] transition-all">
                        <Square className="h-4 w-4" />
                        Stop generating
                      </button>
                    </div>
                  )}

                  <ChatInput input={input} setInput={setInput} handleKeyPress={handleKeyPress} handleSend={handleSend} loading={loading} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
