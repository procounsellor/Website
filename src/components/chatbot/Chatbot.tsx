import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/store/ChatStore";
import {User2, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SmartImage from "@/components/ui/SmartImage";
import { useAuthStore } from "@/store/AuthStore";
import { Button } from "../ui";
import toast from "react-hot-toast";
import ChatInput from "./components/ChatInput";
import Sidear from "./components/Sidear";

export default function Chatbot() {
  const { messages, toggleChatbot, sendMessage, loading, loadMessages, clearMessages } = useChatStore();
  const { toggleLogin, isAuthenticated, logout } = useAuthStore();
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    Array<{ id: string; title: string; timestamp: Date }>
  >([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);


  // Handle dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      localStorage.setItem(
        `chat_${currentChatId}`,
        JSON.stringify(messages)
      );
    }
  }, [messages, currentChatId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // If no current chat, create a new one
    if (!currentChatId) {
      const newChatId = Date.now().toString();
      const newChat = {
        id: newChatId,
        title: input.slice(0, 30) + (input.length > 30 ? "..." : ""),
        timestamp: new Date(),
      };
      const updatedHistory = [newChat, ...chatHistory];
      setChatHistory(updatedHistory);
      setCurrentChatId(newChatId);
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
    }

    await sendMessage(input);
    setInput("");
  };

  const handleNewChat = () => {
    // Only clear if there are messages
    if (messages.length > 0) {
      setCurrentChatId(null);
      clearMessages();
    }
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    const savedMessages = localStorage.getItem(`chat_${chatId}`);
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      loadMessages(parsedMessages);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    const updatedHistory = chatHistory.filter((chat) => chat.id !== chatId);
    setChatHistory(updatedHistory);
    localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
    localStorage.removeItem(`chat_${chatId}`);
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    toggleChatbot();
    navigate('/');
    toast.success('Logged out successfully!', { duration: 3000 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex flex-col bg-[#232323]">
      {/* Header - Full Width at Top */}
      <header className="h-14 md:h-20 bg-[#232323] border-b border-[#FFFFFF40] shadow-[0_2px_4px_0_rgba(255,255,255,0.25)] w-full">
        <div className="flex h-full items-center justify-between px-5 lg:px-20">
          {/* Logo */}
          <div className="Logo flex cursor-pointer" onClick={() => {
            toggleChatbot();
            navigate('/');
          }}>
            <SmartImage
              src="/logo.svg"
              alt="procounsel_logo"
              className="h-7 w-7 md:w-11 md:h-12"
              width={44}
              height={44}
              priority
            />
            <div className="flex flex-col leading-tight pl-[9px]">
              <h1 className="text-white font-semibold text-sm md:text-xl">
                ProCounsel
              </h1>
              <span className="font-normal text-gray-400 text-[8px] md:text-[10px]">
                By CatalystAI
              </span>
            </div>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-3">
            
            <div className="btn relative">
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors" 
                    aria-label="Open user menu"
                  >
                    <User2 className="h-6 w-6 text-white" />
                  </button>
                                          
                  {isDropdownOpen && (
                    <div 
                      ref={dropdownRef}
                      className="absolute top-full right-0 mt-2 w-48 bg-[#2a2a2a] rounded-lg shadow-xl z-50 py-1 border border-gray-700"
                    >
                      <button
                        onClick={() => {
                          navigate('/dashboard/student');
                          setIsDropdownOpen(false);
                          toggleChatbot();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        <LayoutDashboard size={16} />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Button
                  variant={"outline"}
                  className="w-full lg:w-[164px] flex items-center justify-center h-6 md:h-11 border rounded-[12px] bg-[#232323] font-semibold text-white border-[#858585]
                   text-[10px] md:text-lg hover:bg-[#FF660F] hover:text-white transition-all duration-200"
                  onClick={toggleLogin}
                >
                  Login/Sign Up
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content Area - Sidebar and Main Chat */}
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
          {messages.length === 0 ? (
            // Landing Page - Centered Input
           <div>
            <div className="lg:mt-[11.75rem] flex flex-col items-center justify-center gap-5">
              <h1 className="text-white font-semibold text-[32px]">Procounsel GPT</h1>
              <p className="flex flex-col text-white/50 text-2xl font-medium text-center">Your personal guide to college and exams in India.<span>How can I help you today?</span></p>
            </div>
            <div className="lg:mt-[70px]">
               <ChatInput
            input={input}
            setInput={setInput}
            handleKeyPress={handleKeyPress}
            handleSend={handleSend}
            loading={loading}
            />
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
            // Chat View - Messages with Bottom Input
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto bg-[#232323] mt-2 p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-[.50rem] py-3 px-4 ${
                          message.isUser
                            ? "bg-[#6C6969] text-white"
                            : "text-gray-200"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.text}</p>
                        {message.followup && (
                          <p className="mt-2 text-sm text-gray-400 italic">
                            {message.followup}
                          </p>
                        )}
                        {message.counsellors && message.counsellors.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-sm font-semibold">
                              Recommended Counselors:
                            </p>
                            {message.counsellors.map((counsellor) => (
                              <div
                                key={counsellor.counsellorId}
                                className="bg-[#2a2a2a] p-2 rounded text-sm"
                              >
                                <p className="font-medium">
                                  {counsellor.firstName} {counsellor.lastName}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {counsellor.city} • ⭐ {counsellor.rating}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-[#2a2a2a] rounded-lg p-4">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="lg:mb-[3.75rem]">
                <ChatInput
                input={input}
                setInput={setInput}
                loading={loading}
                handleKeyPress={handleKeyPress}
                handleSend={handleSend}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}