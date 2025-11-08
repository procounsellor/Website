import { useState } from 'react';
import { EllipsisVertical, Plus, Search, PanelLeftClose, ArrowLeft, PanelRightClose } from "lucide-react";
import ChatOptionsMenu from './ChatOptionsMenu';
import { useChatStore } from "@/store/ChatStore";

type ChatItem = {
  id: string;
  title: string;
  timestamp?: string | number | Date;
};

type Props = {
  setIsSidebarOpen: (v: boolean) => void;
  handleNewChat: () => void;
  isSidebarOpen: boolean;
  chatHistory: ChatItem[];
  currentChatId: string | null;
  handleSelectChat: (id: string) => void;
  handleDeleteChat: (id: string) => void;
};

const IconOnlyButton = ({ onClick, children, ariaLabel }: { onClick?: () => void, children: React.ReactNode, ariaLabel: string }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className="p-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
  >
    {children}
  </button>
);


export default function Sidebar({
  handleNewChat,
  isSidebarOpen,
  setIsSidebarOpen,
  chatHistory,
  currentChatId,
  handleSelectChat,
  handleDeleteChat,
}: Props) {
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const handleRename = (chatId: string) => {
    console.log("Renaming chat:", chatId);
    setMenuOpenFor(null);
  };
  const handleBookmark = (chatId: string) => {
    console.log("Bookmarking chat:", chatId);
    setMenuOpenFor(null);
  };
  const handleDelete = (chatId: string) => {
    handleDeleteChat(chatId);
    setMenuOpenFor(null);
  };
    const {toggleChatbot } = useChatStore();

  return (
    <div
      className={`bg-[#232323] h-full border-t border-r border-[#A0A0A099] transition-all duration-300 ease-in-out`}
      style={{ width: isSidebarOpen ? '264px' : '80px' }}
    >
      {isSidebarOpen ? (
        <div className="w-full h-full p-8 flex flex-col">
          <div className="flex-grow overflow-y-auto scrollbar-hide">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1 text-white font-semibold text-sm mt-3"
              >
                <Plus size={24} />
                <span>New Chat</span>
              </button>
              <button onClick={() => setIsSidebarOpen(false)} className="text-white">
                <PanelLeftClose size={24} />
              </button>
            </div>
            <div className="mt-7">
              <div className="flex items-center justify-between p-4">
                <p className="font-semibold text-sm text-white">
                  RECENT SEARCHES
                </p>
                <Search size={18} className="text-white/60" />
              </div>
              <div className="mt-6 space-y-2">
                {chatHistory.map((chat) => (
                  <div key={chat.id} className="relative">
                    <div onClick={() => handleSelectChat(chat.id)} className={`group w-full rounded-lg py-[6px] px-4 cursor-pointer transition-colors ${currentChatId === chat.id ? "bg-white/[.25]" : "hover:bg-white/[.25]"}`}>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium truncate ${currentChatId === chat.id ? "text-white" : "text-white/60"} group-hover:text-white`}>
                          {chat.title}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenFor(menuOpenFor === chat.id ? null : chat.id);
                          }}
                          className={`transition-opacity ${currentChatId === chat.id || menuOpenFor === chat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                          aria-label="More options"
                        >
                          <EllipsisVertical size={16} className="text-white"/>
                        </button>
                      </div>
                    </div>
                    {menuOpenFor === chat.id && (
                      <ChatOptionsMenu
                        onClose={() => setMenuOpenFor(null)}
                        onRename={() => handleRename(chat.id)}
                        onBookmark={() => handleBookmark(chat.id)}
                        onDelete={() => handleDelete(chat.id)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <button  onClick={toggleChatbot} className="w-full flex items-center gap-3 p-[11px] rounded-xl">
                <ArrowLeft size={20} className="text-white" />
                <span className="font-medium text-sm text-white">Back to Home</span>
            </button>
          </div>
        </div>
      ) : (
        // collapsed view
        <div className="w-full h-full flex flex-col items-center justify-between py-8">
          <div className="flex flex-col items-center space-y-4">
            <IconOnlyButton onClick={() => setIsSidebarOpen(true)} ariaLabel="Expand sidebar">
              <PanelRightClose size={22} />
            </IconOnlyButton>
            <IconOnlyButton onClick={handleNewChat} ariaLabel="New chat">
              <Plus size={22} />
            </IconOnlyButton>
            <IconOnlyButton ariaLabel="Search">
              <Search size={22} />
            </IconOnlyButton>
          </div>
          <div>
            <IconOnlyButton onClick={toggleChatbot} ariaLabel="Back to home">
              <ArrowLeft size={22} />
            </IconOnlyButton>
          </div>
        </div>
      )}
    </div>
  );
}