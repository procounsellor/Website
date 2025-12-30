import { useState, useRef, useEffect } from 'react';
import { EllipsisVertical, Search, ArrowLeft, X, Lock, Loader2, Bookmark, AlertTriangle } from "lucide-react"; 
import ChatOptionsMenu from './ChatOptionsMenu';
import { useChatStore } from "@/store/ChatStore";
import { useAuthStore } from "@/store/AuthStore";
import type { ChatSession } from "@/api/chatbot";
import toast from 'react-hot-toast';

type Props = {
  setIsSidebarOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  handleNewChat: () => void;
  isSidebarOpen: boolean;
  chatSessions: ChatSession[];
  currentSessionId: string | null;
  handleSelectChat: (sessionId: string) => void;
  handleDeleteChat: (sessionId: string) => void;
  isAuthenticated: boolean;
  onLoginClick: () => void;
};

// --- HELPER COMPONENT FOR TOOLTIPS ---
const Tooltip = ({ text, position = "right", shortcut }: { text: string, position?: "right" | "bottom", shortcut?: string }) => {
  const baseClasses = "absolute px-2 py-1 bg-[#2a2a2a] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 border border-[#404040] shadow-xl flex items-center gap-2";
  
  const positionClasses = position === "right" 
    ? "left-full ml-2 top-1/2 -translate-y-1/2" 
    : "top-full mt-2 left-1/2 -translate-x-1/2"; 

  return (
    <span className={`${baseClasses} ${positionClasses}`}>
      {text}
      {shortcut && <span className="text-white/40 text-[10px] uppercase tracking-wider font-mono bg-white/10 px-1 rounded">{shortcut}</span>}
    </span>
  );
};

const IconOnlyButton = ({ onClick, children, ariaLabel, shortcut }: { onClick?: () => void, children: React.ReactNode, ariaLabel: string, shortcut?: string }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className="group relative p-2.5 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
  >
    {children}
    <Tooltip text={ariaLabel} position="right" shortcut={shortcut} />
  </button>
);

export default function Sidebar({
  handleNewChat,
  isSidebarOpen,
  setIsSidebarOpen,
  chatSessions = [],
  currentSessionId,
  handleSelectChat,
  isAuthenticated,
  onLoginClick,
}: Props) {
  const { userId } = useAuthStore();
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [searchPopupOpen, setSearchPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for Rename
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // State for Delete Confirmation Modal
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  // REMOVED: Unused showTutorial state
  const [isMobile, setIsMobile] = useState(false);
  
  const searchPopupRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { 
    renameChatSession, 
    deleteChatSession, 
    bookmarkChatSession,
    toggleChatbot, 
    isLoadingSessions 
  } = useChatStore();

  // --- Global Keyboard Shortcuts ---
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewChat();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isAuthenticated) {
           setSearchPopupOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isAuthenticated, setIsSidebarOpen, handleNewChat]);

  // Rename Logic
  const handleRenameStart = (chat: ChatSession) => {
    setEditingSessionId(chat.sessionId);
    setEditTitle(chat.title);
    setMenuOpenFor(null);
  };

  const handleRenameSave = async () => {
    if (editingSessionId && userId && editTitle.trim() !== "") {
       await renameChatSession(editingSessionId, editTitle, userId);
       setEditingSessionId(null);
    } else {
       setEditingSessionId(null);
    }
  };

  const handleRenameCancel = () => {
    setEditingSessionId(null);
    setEditTitle("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRenameSave();
    if (e.key === 'Escape') handleRenameCancel();
  };

  useEffect(() => {
    if (editingSessionId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingSessionId]);

  const handleBookmark = async (chat: ChatSession) => {
    if (userId) {
        const newStatus = !chat.isBookmarked;
        await bookmarkChatSession(chat.sessionId, userId, newStatus);
        toast.success(newStatus ? "Chat bookmarked" : "Bookmark removed");
    }
    setMenuOpenFor(null);
  };

  // --- NEW: Delete Logic ---
  const initiateDelete = (chatId: string) => {
    // Instead of window.confirm, we open our custom modal
    setDeleteConfirmationId(chatId);
    setMenuOpenFor(null);
  };

  const confirmDelete = async () => {
    if (deleteConfirmationId && userId) {
        await deleteChatSession(deleteConfirmationId, userId);
        toast.success("Conversation deleted");
    }
    setDeleteConfirmationId(null);
  };

  // Mobile Logic (Tutorial logic removed because showTutorial state was removed)
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Removed unused tutorial check logic here
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredChats = (chatSessions || []).filter(chat => 
    chat?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchPopupRef.current && !searchPopupRef.current.contains(event.target as Node)) {
        setSearchPopupOpen(false);
        setSearchQuery("");
      }
    };
    if (searchPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchPopupOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* --- NEW: Delete Confirmation Modal --- */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirmationId(null)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-[#1e1e1e] border border-[#333] rounded-2xl w-full max-w-sm p-6 shadow-2xl transform transition-all scale-100 opacity-100">
            <div className="flex flex-col items-center text-center">
              {/* Warning Icon Circle */}
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">Delete Conversation?</h3>
              <p className="text-white/60 text-sm mb-6">
                This action cannot be undone. This chat history will be permanently removed.
              </p>
              
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteConfirmationId(null)}
                  className="flex-1 px-4 py-2 rounded-xl text-white/80 hover:bg-white/5 hover:text-white font-medium text-sm transition-colors border border-transparent hover:border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors shadow-lg cursor-pointer shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div
        ref={sidebarRef}
        className={`bg-[#232323] h-full border-t border-r border-[#A0A0A099] transition-all duration-300 ease-in-out relative ${
          isMobile ? 'fixed left-0 top-0 z-160' : ''
        } ${isMobile && !isSidebarOpen ? 'hidden' : ''}`}
        style={{ width: isMobile && isSidebarOpen ? '264px' : isSidebarOpen ? '264px' : '60px' }}
      >
      {isSidebarOpen ? (
        // === EXPANDED VIEW ===
        <div className="w-full h-full p-4 flex flex-col">
          <div className="grow overflow-y-auto scrollbar-hide">
            <div className="flex items-center justify-between mb-6">
              
              {/* NEW CHAT BUTTON */}
              <button
                onClick={() => {
                  handleNewChat();
                  if (isMobile) setIsSidebarOpen(false);
                }}
                className="group relative flex items-center gap-2 text-white font-semibold text-sm hover:bg-white/10 px-3 py-2 rounded-lg transition-colors cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="icon" aria-hidden="true"><path d="M2.6687 11.333V8.66699C2.6687 7.74455 2.66841 7.01205 2.71655 6.42285C2.76533 5.82612 2.86699 5.31731 3.10425 4.85156L3.25854 4.57617C3.64272 3.94975 4.19392 3.43995 4.85229 3.10449L5.02905 3.02149C5.44666 2.84233 5.90133 2.75849 6.42358 2.71582C7.01272 2.66769 7.74445 2.66797 8.66675 2.66797H9.16675C9.53393 2.66797 9.83165 2.96586 9.83179 3.33301C9.83179 3.70028 9.53402 3.99805 9.16675 3.99805H8.66675C7.7226 3.99805 7.05438 3.99834 6.53198 4.04102C6.14611 4.07254 5.87277 4.12568 5.65601 4.20313L5.45581 4.28906C5.01645 4.51293 4.64872 4.85345 4.39233 5.27149L4.28979 5.45508C4.16388 5.7022 4.08381 6.01663 4.04175 6.53125C3.99906 7.05373 3.99878 7.7226 3.99878 8.66699V11.333C3.99878 12.2774 3.99906 12.9463 4.04175 13.4688C4.08381 13.9833 4.16389 14.2978 4.28979 14.5449L4.39233 14.7285C4.64871 15.1465 5.01648 15.4871 5.45581 15.7109L5.65601 15.7969C5.87276 15.8743 6.14614 15.9265 6.53198 15.958C7.05439 16.0007 7.72256 16.002 8.66675 16.002H11.3337C12.2779 16.002 12.9461 16.0007 13.4685 15.958C13.9829 15.916 14.2976 15.8367 14.5447 15.7109L14.7292 15.6074C15.147 15.3511 15.4879 14.9841 15.7117 14.5449L15.7976 14.3447C15.8751 14.128 15.9272 13.8546 15.9587 13.4688C16.0014 12.9463 16.0017 12.2774 16.0017 11.333V10.833C16.0018 10.466 16.2997 10.1681 16.6667 10.168C17.0339 10.168 17.3316 10.4659 17.3318 10.833V11.333C17.3318 12.2555 17.3331 12.9879 17.2849 13.5771C17.2422 14.0993 17.1584 14.5541 16.9792 14.9717L16.8962 15.1484C16.5609 15.8066 16.0507 16.3571 15.4246 16.7412L15.1492 16.8955C14.6833 17.1329 14.1739 17.2354 13.5769 17.2842C12.9878 17.3323 12.256 17.332 11.3337 17.332H8.66675C7.74446 17.332 7.01271 17.3323 6.42358 17.2842C5.90135 17.2415 5.44665 17.1577 5.02905 16.9785L4.85229 16.8955C4.19396 16.5601 3.64271 16.0502 3.25854 15.4238L3.10425 15.1484C2.86697 14.6827 2.76534 14.1739 2.71655 13.5771C2.66841 12.9879 2.6687 12.2555 2.6687 11.333ZM13.4646 3.11328C14.4201 2.334 15.8288 2.38969 16.7195 3.28027L16.8865 3.46485C17.6141 4.35685 17.6143 5.64423 16.8865 6.53613L16.7195 6.7207L11.6726 11.7686C11.1373 12.3039 10.4624 12.6746 9.72827 12.8408L9.41089 12.8994L7.59351 13.1582C7.38637 13.1877 7.17701 13.1187 7.02905 12.9707C6.88112 12.8227 6.81199 12.6134 6.84155 12.4063L7.10132 10.5898L7.15991 10.2715C7.3262 9.53749 7.69692 8.86241 8.23218 8.32715L13.2791 3.28027L13.4646 3.11328ZM15.7791 4.2207C15.3753 3.81702 14.7366 3.79124 14.3035 4.14453L14.2195 4.2207L9.17261 9.26856C8.81541 9.62578 8.56774 10.0756 8.45679 10.5654L8.41772 10.7773L8.28296 11.7158L9.22241 11.582L9.43433 11.543C9.92426 11.432 10.3749 11.1844 10.7322 10.8271L15.7791 5.78027L15.8552 5.69629C16.185 5.29194 16.1852 4.708 15.8552 4.30371L15.7791 4.2207Z"></path></svg>
                <span>New Chat</span>
                <Tooltip text="New Chat" position="bottom" shortcut="Alt + N" />
              </button>

              {/* CLOSE BUTTON */}
              <button 
                onClick={() => setIsSidebarOpen(false)} 
                className="group relative text-white hover:bg-white/10 p-2 rounded-lg transition-colors cursor-pointer"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" data-rtl-flip="" className="icon max-md:hidden"><path d="M6.83496 3.99992C6.38353 4.00411 6.01421 4.0122 5.69824 4.03801C5.31232 4.06954 5.03904 4.12266 4.82227 4.20012L4.62207 4.28606C4.18264 4.50996 3.81498 4.85035 3.55859 5.26848L3.45605 5.45207C3.33013 5.69922 3.25006 6.01354 3.20801 6.52824C3.16533 7.05065 3.16504 7.71885 3.16504 8.66301V11.3271C3.16504 12.2712 3.16533 12.9394 3.20801 13.4618C3.25006 13.9766 3.33013 14.2909 3.45605 14.538L3.55859 14.7216C3.81498 15.1397 4.18266 15.4801 4.62207 15.704L4.82227 15.79C5.03904 15.8674 5.31234 15.9205 5.69824 15.9521C6.01398 15.9779 6.383 15.986 6.83398 15.9902L6.83496 3.99992ZM18.165 11.3271C18.165 12.2493 18.1653 12.9811 18.1172 13.5702C18.0745 14.0924 17.9916 14.5472 17.8125 14.9648L17.7295 15.1415C17.394 15.8 16.8834 16.3511 16.2568 16.7353L15.9814 16.8896C15.5157 17.1268 15.0069 17.2285 14.4102 17.2773C13.821 17.3254 13.0893 17.3251 12.167 17.3251H7.83301C6.91071 17.3251 6.17898 17.3254 5.58984 17.2773C5.06757 17.2346 4.61294 17.1508 4.19531 16.9716L4.01855 16.8896C3.36014 16.5541 2.80898 16.0434 2.4248 15.4169L2.27051 15.1415C2.03328 14.6758 1.93158 14.167 1.88281 13.5702C1.83468 12.9811 1.83496 12.2493 1.83496 11.3271V8.66301C1.83496 7.74072 1.83468 7.00898 1.88281 6.41985C1.93157 5.82309 2.03329 5.31432 2.27051 4.84856L2.4248 4.57317C2.80898 3.94666 3.36012 3.436 4.01855 3.10051L4.19531 3.0175C4.61285 2.83843 5.06771 2.75548 5.58984 2.71281C6.17898 2.66468 6.91071 2.66496 7.83301 2.66496H12.167C13.0893 2.66496 13.821 2.66468 14.4102 2.71281C15.0069 2.76157 15.5157 2.86329 15.9814 3.10051L16.2568 3.25481C16.8833 3.63898 17.394 4.19012 17.7295 4.84856L17.8125 5.02531C17.9916 5.44285 18.0745 5.89771 18.1172 6.41985C18.1653 7.00898 18.165 7.74072 18.165 8.66301V11.3271ZM8.16406 15.995H12.167C13.1112 15.995 13.7794 15.9947 14.3018 15.9521C14.8164 15.91 15.1308 15.8299 15.3779 15.704L15.5615 15.6015C15.9797 15.3451 16.32 14.9774 16.5439 14.538L16.6299 14.3378C16.7074 14.121 16.7605 13.8478 16.792 13.4618C16.8347 12.9394 16.835 12.2712 16.835 11.3271V8.66301C16.835 7.71885 16.8347 7.05065 16.792 6.52824C16.7605 6.14232 16.7073 5.86904 16.6299 5.65227L16.5439 5.45207C16.32 5.01264 15.9796 4.64498 15.5615 4.3886L15.3779 4.28606C15.1308 4.16013 14.8165 4.08006 14.3018 4.03801C13.7794 3.99533 13.1112 3.99504 12.167 3.99504H8.16406C8.16407 3.99667 8.16504 3.99829 8.16504 3.99992L8.16406 15.995Z"></path></svg>
                <Tooltip text="Close Sidebar" position="bottom" shortcut="Ctrl + B" />
              </button>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between px-2 mb-3">
                <p className="font-semibold text-[14px] text-[#AFAFAF] tracking-wider">
                  Chats
                </p>
                {isAuthenticated && (
                  <button 
                    onClick={() => setSearchPopupOpen(true)}
                    className="group relative hover:bg-white/10 p-1.5 rounded-md transition-colors cursor-pointer"
                    aria-label="Search chats"
                  >
                    <Search size={18} className="text-white/60" />
                    <Tooltip text="Search chats" position="bottom" shortcut="Ctrl + K" />
                  </button>
                )}
              </div>
              
              {!isAuthenticated ? (
                // Login Prompt
                <div className="relative px-3 py-4">
                  <div className="absolute inset-0 backdrop-blur-sm bg-white/5 rounded-lg flex items-center justify-center">
                    <div className="text-center z-10">
                      <Lock className="h-8 w-8 text-[#FF660F] mx-auto mb-2" />
                      <p className="text-white text-sm font-medium mb-2">Login for Chat History</p>
                      <p className="text-gray-400 text-xs mb-3">Sign in to save and access your chat conversations</p>
                      <button
                        onClick={() => {
                          setIsSidebarOpen(false);
                          onLoginClick();
                        }}
                        className="px-4 py-2 bg-[#FF660F] text-white text-xs font-semibold rounded-lg hover:bg-[#e55a0a] transition-colors cursor-pointer"
                      >
                        Login / Sign Up
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 blur-sm pointer-events-none">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white/5 rounded-lg py-2 px-3">
                        <div className="h-4 bg-white/10 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : isLoadingSessions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 text-[#FF660F] animate-spin" />
                </div>
              ) : (
                <div className="space-y-1">
                  {chatSessions && chatSessions.length === 0 && !currentSessionId && (
                    <div className="px-3 py-8 text-center text-gray-400 text-sm">
                      No chat history yet.<br />Start a new conversation!
                    </div>
                  )}
                  
                  {chatSessions.map((chat) => (
                    <div key={chat.sessionId} className="relative">
                      <div onClick={() => handleSelectChat(chat.sessionId)} className={`group w-full rounded-lg py-2 px-3 cursor-pointer transition-colors ${currentSessionId === chat.sessionId ? "bg-white/[.15]" : "hover:bg-white/[.08]"}`}>
                        <div className="flex items-center justify-between">
                          {editingSessionId === chat.sessionId ? (
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={handleKeyDown}
                              onBlur={handleRenameSave}
                              onClick={(e) => e.stopPropagation()} 
                              className="text-[14px] font-medium text-white bg-transparent border-b border-[#FF660F] focus:outline-none w-full mr-2"
                            />
                          ) : (
                            <div className="flex items-center gap-2 overflow-hidden">
                              <p className="text-[14px] font-medium truncate text-white">
                                {chat.title}
                              </p>
                              {chat.isBookmarked && (
                                <Bookmark 
                                  size={14} 
                                  className="text-[#FF660F] shrink-0" 
                                  fill="currentColor" 
                                />
                              )}
                            </div>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenFor(menuOpenFor === chat.sessionId ? null : chat.sessionId);
                            }}
                            className={`transition-opacity cursor-pointer ${menuOpenFor === chat.sessionId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            aria-label="More options"
                          >
                            <EllipsisVertical size={16} className="text-white"/>
                          </button>
                        </div>
                      </div>
                      {menuOpenFor === chat.sessionId && (
                        <ChatOptionsMenu
                          onClose={() => setMenuOpenFor(null)}
                          onRename={() => handleRenameStart(chat)}
                          onBookmark={() => handleBookmark(chat)}
                          // Call the new Modal logic here
                          onDelete={() => initiateDelete(chat.sessionId)}
                          isBookmarked={chat.isBookmarked || false}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <button  onClick={toggleChatbot} className="w-full flex items-center gap-3 p-[11px] rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                <ArrowLeft size={20} className="text-white" />
                <span className="font-semibold text-sm text-white transition-colors">Back to home</span>
            </button>
          </div>
        </div>
      ) : (
        // === COLLAPSED VIEW ===
        <>
          <div className="w-full h-full flex flex-col items-center justify-between py-6">
            <div className="flex flex-col items-center space-y-2">
              <IconOnlyButton onClick={() => setIsSidebarOpen(true)} ariaLabel="Expand sidebar" shortcut="Ctrl + B">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" data-rtl-flip="" className="icon max-md:hidden"><path d="M6.83496 3.99992C6.38353 4.00411 6.01421 4.0122 5.69824 4.03801C5.31232 4.06954 5.03904 4.12266 4.82227 4.20012L4.62207 4.28606C4.18264 4.50996 3.81498 4.85035 3.55859 5.26848L3.45605 5.45207C3.33013 5.69922 3.25006 6.01354 3.20801 6.52824C3.16533 7.05065 3.16504 7.71885 3.16504 8.66301V11.3271C3.16504 12.2712 3.16533 12.9394 3.20801 13.4618C3.25006 13.9766 3.33013 14.2909 3.45605 14.538L3.55859 14.7216C3.81498 15.1397 4.18266 15.4801 4.62207 15.704L4.82227 15.79C5.03904 15.8674 5.31234 15.9205 5.69824 15.9521C6.01398 15.9779 6.383 15.986 6.83398 15.9902L6.83496 3.99992ZM18.165 11.3271C18.165 12.2493 18.1653 12.9811 18.1172 13.5702C18.0745 14.0924 17.9916 14.5472 17.8125 14.9648L17.7295 15.1415C17.394 15.8 16.8834 16.3511 16.2568 16.7353L15.9814 16.8896C15.5157 17.1268 15.0069 17.2285 14.4102 17.2773C13.821 17.3254 13.0893 17.3251 12.167 17.3251H7.83301C6.91071 17.3251 6.17898 17.3254 5.58984 17.2773C5.06757 17.2346 4.61294 17.1508 4.19531 16.9716L4.01855 16.8896C3.36014 16.5541 2.80898 16.0434 2.4248 15.4169L2.27051 15.1415C2.03328 14.6758 1.93158 14.167 1.88281 13.5702C1.83468 12.9811 1.83496 12.2493 1.83496 11.3271V8.66301C1.83496 7.74072 1.83468 7.00898 1.88281 6.41985C1.93157 5.82309 2.03329 5.31432 2.27051 4.84856L2.4248 4.57317C2.80898 3.94666 3.36012 3.436 4.01855 3.10051L4.19531 3.0175C4.61285 2.83843 5.06771 2.75548 5.58984 2.71281C6.17898 2.66468 6.91071 2.66496 7.83301 2.66496H12.167C13.0893 2.66496 13.821 2.66468 14.4102 2.71281C15.0069 2.76157 15.5157 2.86329 15.9814 3.10051L16.2568 3.25481C16.8833 3.63898 17.394 4.19012 17.7295 4.84856L17.8125 5.02531C17.9916 5.44285 18.0745 5.89771 18.1172 6.41985C18.1653 7.00898 18.165 7.74072 18.165 8.66301V11.3271ZM8.16406 15.995H12.167C13.1112 15.995 13.7794 15.9947 14.3018 15.9521C14.8164 15.91 15.1308 15.8299 15.3779 15.704L15.5615 15.6015C15.9797 15.3451 16.32 14.9774 16.5439 14.538L16.6299 14.3378C16.7074 14.121 16.7605 13.8478 16.792 13.4618C16.8347 12.9394 16.835 12.2712 16.835 11.3271V8.66301C16.835 7.71885 16.8347 7.05065 16.792 6.52824C16.7605 6.14232 16.7073 5.86904 16.6299 5.65227L16.5439 5.45207C16.32 5.01264 15.9796 4.64498 15.5615 4.3886L15.3779 4.28606C15.1308 4.16013 14.8165 4.08006 14.3018 4.03801C13.7794 3.99533 13.1112 3.99504 12.167 3.99504H8.16406C8.16407 3.99667 8.16504 3.99829 8.16504 3.99992L8.16406 15.995Z"></path></svg>
              </IconOnlyButton>
              <IconOnlyButton onClick={handleNewChat} ariaLabel="New chat" shortcut="Alt + N">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="icon" aria-hidden="true"><path d="M2.6687 11.333V8.66699C2.6687 7.74455 2.66841 7.01205 2.71655 6.42285C2.76533 5.82612 2.86699 5.31731 3.10425 4.85156L3.25854 4.57617C3.64272 3.94975 4.19392 3.43995 4.85229 3.10449L5.02905 3.02149C5.44666 2.84233 5.90133 2.75849 6.42358 2.71582C7.01272 2.66769 7.74445 2.66797 8.66675 2.66797H9.16675C9.53393 2.66797 9.83165 2.96586 9.83179 3.33301C9.83179 3.70028 9.53402 3.99805 9.16675 3.99805H8.66675C7.7226 3.99805 7.05438 3.99834 6.53198 4.04102C6.14611 4.07254 5.87277 4.12568 5.65601 4.20313L5.45581 4.28906C5.01645 4.51293 4.64872 4.85345 4.39233 5.27149L4.28979 5.45508C4.16388 5.7022 4.08381 6.01663 4.04175 6.53125C3.99906 7.05373 3.99878 7.7226 3.99878 8.66699V11.333C3.99878 12.2774 3.99906 12.9463 4.04175 13.4688C4.08381 13.9833 4.16389 14.2978 4.28979 14.5449C4.32174 14.6074 4.35515 14.6688 4.39233 14.7285C4.64871 15.1465 5.01648 15.4871 5.45581 15.7109L5.65601 15.7969C5.87276 15.8743 6.14614 15.9265 6.53198 15.958C7.05439 16.0007 7.72256 16.002 8.66675 16.002H11.3337C12.2779 16.002 12.9461 16.0007 13.4685 15.958C13.9829 15.916 14.2976 15.8367 14.5447 15.7109L14.7292 15.6074C15.147 15.3511 15.4879 14.9841 15.7117 14.5449L15.7976 14.3447C15.8751 14.128 15.9272 13.8546 15.9587 13.4688C16.0014 12.9463 16.0017 12.2774 16.0017 11.333V10.833C16.0018 10.466 16.2997 10.1681 16.6667 10.168C17.0339 10.168 17.3316 10.4659 17.3318 10.833V11.333C17.3318 12.2555 17.3331 12.9879 17.2849 13.5771C17.2422 14.0993 17.1584 14.5541 16.9792 14.9717L16.8962 15.1484C16.5609 15.8066 16.0507 16.3571 15.4246 16.7412L15.1492 16.8955C14.6833 17.1329 14.1739 17.2354 13.5769 17.2842C12.9878 17.3323 12.256 17.332 11.3337 17.332H8.66675C7.74446 17.332 7.01271 17.3323 6.42358 17.2842C5.90135 17.2415 5.44665 17.1577 5.02905 16.9785L4.85229 16.8955C4.19396 16.5601 3.64271 16.0502 3.25854 15.4238L3.10425 15.1484C2.86697 14.6827 2.76534 14.1739 2.71655 13.5771C2.66841 12.9879 2.6687 12.2555 2.6687 11.333ZM13.4646 3.11328C14.4201 2.334 15.8288 2.38969 16.7195 3.28027L16.8865 3.46485C17.6141 4.35685 17.6143 5.64423 16.8865 6.53613L16.7195 6.7207L11.6726 11.7686C11.1373 12.3039 10.4624 12.6746 9.72827 12.8408L9.41089 12.8994L7.59351 13.1582C7.38637 13.1877 7.17701 13.1187 7.02905 12.9707C6.88112 12.8227 6.81199 12.6134 6.84155 12.4063L7.10132 10.5898L7.15991 10.2715C7.3262 9.53749 7.69692 8.86241 8.23218 8.32715L13.2791 3.28027L13.4646 3.11328ZM15.7791 4.2207C15.3753 3.81702 14.7366 3.79124 14.3035 4.14453L14.2195 4.2207L9.17261 9.26856C8.81541 9.62578 8.56774 10.0756 8.45679 10.5654L8.41772 10.7773L8.28296 11.7158L9.22241 11.582L9.43433 11.543C9.92426 11.432 10.3749 11.1844 10.7322 10.8271L15.7791 5.78027L15.8552 5.69629C16.185 5.29194 16.1852 4.708 15.8552 4.30371L15.7791 4.2207Z"></path></svg>
              </IconOnlyButton>
              <IconOnlyButton onClick={() => setSearchPopupOpen(true)} ariaLabel="Search" shortcut="Ctrl + K">
                <Search size={20} />
              </IconOnlyButton>
            </div>
            <div>
              <IconOnlyButton onClick={toggleChatbot} ariaLabel="Back to home">
                <ArrowLeft size={20} />
              </IconOnlyButton>
            </div>
          </div>
        </>
      )}

      {/* Search Popup */}
      {searchPopupOpen && (
        <div 
          ref={searchPopupRef}
          className="absolute left-full top-4 ml-2 w-80 max-h-[500px] bg-[#2a2a2a] border border-[#A0A0A099] rounded-lg shadow-2xl flex flex-col z-50"
        >
              <div className="p-4 border-b border-[#A0A0A099]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm">Search Chats</h3>
                  <button 
                    onClick={() => {
                      setSearchPopupOpen(false);
                      setSearchQuery("");
                    }}
                    className="text-white/60 hover:text-white hover:bg-white/10 p-1 rounded transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chats..."
                    className="w-full bg-[#232323] text-white text-sm px-9 py-2 rounded-lg border border-[#A0A0A099] focus:outline-none focus:border-white/40 placeholder:text-white/40"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
                {filteredChats.length > 0 ? (
                  <div className="space-y-1">
                    {filteredChats.map((chat) => (
                      <div
                        key={chat.sessionId}
                        onClick={() => {
                          handleSelectChat(chat.sessionId);
                          setSearchPopupOpen(false);
                          setSearchQuery("");
                        }}
                        className={`group w-full rounded-lg py-2 px-3 cursor-pointer transition-colors ${
                          currentSessionId === chat.sessionId ? "bg-white/15" : "hover:bg-white/8"
                        }`}
                      >
                        <p className="text-[14px] font-medium truncate text-white">
                          {chat.title}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-white/40">
                    <Search size={40} className="mb-2 opacity-30" />
                    <p className="text-sm">
                      {searchQuery ? "No chats found" : "Start typing to search..."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
      </div>
    </>
  );
}