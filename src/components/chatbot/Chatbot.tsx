import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User2, LogOut, LayoutDashboard, Sparkles,  Square, Menu, Loader2 } from "lucide-react";
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
  const { 
    messages, 
    toggleChatbot, 
    sendMessage, 
    loading, 
    clearMessages, 
    stopGenerating, 
    startNewChat,
    chatSessions,
    loadChatSessions,
    loadChatHistoryBySessionId,
    currentSessionId,
    setCurrentSessionId,
    incrementVisitorMessageCount,
    resetVisitorMessageCount,
    isLoginOpenFromChatbot,
    setLoginOpenFromChatbot,
    isLoadingHistory
  } = useChatStore();
  const { toggleLogin, isAuthenticated, logout, userId, role, isLoginToggle } = useAuthStore();

  // UI state
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Changed to false for mobile-first
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [visibleCounselorsPerMessage, setVisibleCounselorsPerMessage] = useState<Record<number, number>>({});
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize sidebar state based on screen size
  useEffect(() => {
    const initializeSidebar = () => {
      const isMobile = window.innerWidth < 768;
      setIsSidebarOpen(!isMobile); // Open on desktop, closed on mobile
    };

    initializeSidebar();
    window.addEventListener('resize', initializeSidebar);
    return () => window.removeEventListener('resize', initializeSidebar);
  }, []);

  // Load chat sessions when authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      // Load user's saved chat sessions from backend
      loadChatSessions(userId);
      
      // Reset visitor message count when user logs in
      resetVisitorMessageCount();
      
      console.log('✅ User authenticated - loaded chat sessions for userId:', userId);
    }
  }, [isAuthenticated, userId, loadChatSessions, resetVisitorMessageCount]);

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

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Check if visitor has reached message limit
    if (!isAuthenticated) {
      const newCount = incrementVisitorMessageCount();
      if (newCount >= 3) {
        setShowLoginPrompt(true);
        return;
      }
    }

    // Store the input message before clearing
    const messageToSend = input.trim();
    
    // Clear input immediately
    setInput("");

    // send the message via store with user information
    await sendMessage(messageToSend, userId, role);
  };

  const handleNewChat = () => {
    // Always clear and start new chat, even if no messages
    clearMessages();
    startNewChat(); // This creates a new sessionId and sets it
  };

  const handleSelectChat = (sessionId: string) => {
    loadChatHistoryBySessionId(sessionId);
  };

  const handleDeleteChat = (sessionId: string) => {
    // TODO: Implement delete API call when available
    console.log("Delete session:", sessionId);
  };

  const handleLogout = () => {
    // Reset chat state before logging out
    useChatStore.getState().resetChatState();
    
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

  // Handle login state changes to manage z-index
  useEffect(() => {
    if (isLoginToggle && isLoginOpenFromChatbot) {
      // Login is open from chatbot context
      console.log("Login opened from chatbot");
    } else if (!isLoginToggle && isLoginOpenFromChatbot) {
      // Login was closed, reset the flag
      setLoginOpenFromChatbot(false);
    }
  }, [isLoginToggle, isLoginOpenFromChatbot, setLoginOpenFromChatbot]);

  // Handler for opening login from chatbot
  const handleLoginFromChatbot = () => {
    setLoginOpenFromChatbot(true);
    toggleLogin();
  };

  // Calculate z-index dynamically - lower when login is open from chatbot
  const chatbotZIndex = isLoginToggle && isLoginOpenFromChatbot ? "z-[40]" : "z-[100]";

  return (
    <div className={`fixed inset-0 ${chatbotZIndex} flex flex-col bg-[#232323]`}>
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-6">
          <div className="bg-[#2a2a2a] rounded-2xl p-6 max-w-sm border border-[#A0A0A099] shadow-2xl">
            <div className="text-center">
              <div className="inline-block p-4 bg-[#FF660F]/20 rounded-full mb-4">
                <User2 className="h-10 w-10 text-[#FF660F]" />
              </div>
              <h3 className="text-white font-semibold text-xl mb-2">Login to Continue</h3>
              <p className="text-gray-400 text-sm mb-6">
                You've reached the message limit for visitors. Please login to continue chatting and access your chat history.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowLoginPrompt(false);
                    handleLoginFromChatbot();
                  }}
                  className="w-full bg-[#FF660F] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#e55a0a] transition-colors"
                >
                  Login / Sign Up
                </button>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="w-full text-gray-400 font-medium py-2 px-6 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="h-14 md:h-20 bg-[#232323] border-b border-[#FFFFFF40] shadow-[0_2px_4px_0_rgba(255,255,255,0.06)] w-full">
        <div className="flex h-full items-center justify-between px-5 lg:px-20">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 text-white" />
            </button>

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
                <Button 
                  variant={"outline"} 
                  className="w-full lg:w-[164px] flex items-center justify-center h-6 md:h-11 border rounded-[12px] bg-[#232323] font-semibold text-white border-[#858585] text-[10px] md:text-lg hover:bg-[#FF660F] hover:text-white hover:border-[#FF660F] transition-all duration-200" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLoginFromChatbot();
                  }}
                >
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
          chatSessions={chatSessions}
          currentSessionId={currentSessionId}
          handleSelectChat={handleSelectChat}
          handleDeleteChat={handleDeleteChat}
          setIsSidebarOpen={setIsSidebarOpen}
          isAuthenticated={isAuthenticated}
          onLoginClick={handleLoginFromChatbot}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 && !loading ? (
            <div className="flex flex-col h-full items-center justify-center">
              <div className="w-full max-w-4xl mx-auto px-4">
                {/* Welcome Section - Responsive */}
                <div className="flex flex-col items-center justify-center gap-3 md:gap-5 mb-8 md:mb-12">
                  <h1 className="text-white font-semibold text-2xl md:text-[32px] text-center">Procounsel GPT</h1>
                  <p className="flex flex-col text-white/50 text-base md:text-2xl font-medium text-center px-2">
                    Your personal guide to college and exams in India.
                    <span className="mt-1">How can I help you today?</span>
                  </p>
                </div>

                {/* Input Box - Centered */}
                <div className="mb-6 md:mb-8">
                  <ChatInput input={input} setInput={setInput} handleKeyPress={handleKeyPress} handleSend={handleSend} loading={loading} />
                </div>

                {/* Feature Cards - Responsive Grid - Centered */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  <div className="border border-[#7B7B7B] rounded-[12px] py-3 md:py-2.5 px-3 md:px-4 flex gap-3 md:gap-4 items-center hover:bg-white/5 transition-colors cursor-pointer">
                    <img src="/book.svg" alt="Courses" className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    <p className="text-[13px] md:text-[14px] font-medium text-white">Access premium learning courses.</p>
                  </div>
                  <div className="border border-[#7B7B7B] rounded-[12px] py-3 md:py-2.5 px-3 md:px-4 flex gap-3 md:gap-4 items-center hover:bg-white/5 transition-colors cursor-pointer">
                    <img src="/cap.svg" alt="Colleges" className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    <p className="text-[13px] md:text-[14px] font-medium text-white">Discover top colleges.</p>
                  </div>
                  <div className="border border-[#7B7B7B] rounded-[12px] py-3 md:py-2.5 px-3 md:px-4 flex gap-3 md:gap-4 items-center hover:bg-white/5 transition-colors cursor-pointer">
                    <img src="/person.svg" alt="Counselors" className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                    <p className="text-[13px] md:text-[14px] font-medium text-white">Consult expert counselors.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto bg-[#232323] mt-2 px-3 md:px-6 py-4 md:py-6 scrollbar-hide">
                <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
                  {isLoadingHistory ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 text-[#FF660F] animate-spin" />
                    </div>
                  ) : (
                    <>
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
                      <div key={index} className="space-y-3 md:space-y-4">
                        
                        {msg.isUser ? (
                          <ChatMessage text={msg.text} isUser={true} />
                        ) : (
                          // This is the bot message bubble
                          <div className="rounded-2xl px-2 md:px-4 text-white max-w-full overflow-x-auto">
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
                                  return <p className="mb-2 last:mb-0 text-sm md:text-base" {...props} />;
                                },
                                ol: ({node, ...props}) => <ol className="list-decimal list-inside ml-2 md:ml-4 space-y-1 md:space-y-2 text-sm md:text-base" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-inside ml-2 md:ml-4 space-y-1 md:space-y-2 text-sm md:text-base" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                              }}
                            />
                          </div>
                        )}
                        
                        {msg.followup && !msg.isUser && (
                          <p className="text-gray-400 text-xs md:text-sm italic max-w-4xl mx-auto pl-4 md:pl-12 pr-3 md:pr-6 -mt-2">
                            {msg.followup}
                          </p>
                        )}

                        {/* Counselor cards - Progressive Loading with See More */}
                        {msg.counsellors && msg.counsellors.length > 0 && (() => {
                          const visibleCount = visibleCounselorsPerMessage[index] || 3;
                          const counsellors = msg.counsellors as any[];
                          const visibleCounsellors = counsellors.slice(0, visibleCount);
                          const hasMore = counsellors.length > visibleCount;

                          return (
                            <div className="mt-3 md:mt-4 space-y-2 md:space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                                {visibleCounsellors.map((c, idx) => (
                                  <Link 
                                    className="w-full animate-in fade-in-50 slide-in-from-bottom-4 duration-500" 
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                    to="/counselors/profile" 
                                    state={{ id: c.counsellorId }} 
                                    key={c.counsellorId} 
                                    onClick={toggleChatbot}
                                  >
                                    <ChatbotCounselorCard counselor={c} />
                                  </Link>
                                ))}
                              </div>
                              
                              {hasMore && (
                                <div className="flex justify-center pt-2">
                                  <button
                                    onClick={() => {
                                      setVisibleCounselorsPerMessage(prev => ({
                                        ...prev,
                                        [index]: (prev[index] || 3) + 3
                                      }));
                                    }}
                                    className="px-4 md:px-6 py-2 md:py-2.5 bg-[#2a2a2a] hover:bg-[#FF660F] text-white text-sm md:text-base font-medium rounded-lg border border-[#404040] hover:border-[#FF660F] transition-all duration-300 shadow-sm hover:shadow-md"
                                  >
                                    See More ({counsellors.length - visibleCount} remaining)
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                        
                      </div>
                    );
                  })}

                      {loading && <TypingIndicator />}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>
              </div>

              {/* Footer with ChatInput and stop button when loading - Responsive */}
              <div className="pb-3 md:pb-6 lg:pb-[3.75rem] px-3 md:px-4 bg-transparent">
                <div className="max-w-4xl mx-auto">
                  {loading && (
                    <div className="flex justify-center mb-2 md:mb-3">
                      <button onClick={stopGenerating} className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-200 bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-sm hover:bg-[#3b3b3b] transition-all">
                        <Square className="h-3 w-3 md:h-4 md:w-4" />
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
