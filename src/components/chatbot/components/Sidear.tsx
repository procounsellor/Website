import {  EllipsisVertical, Plus, Search} from "lucide-react";

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

export default function ({
  handleNewChat,
  isSidebarOpen,
  chatHistory,
  currentChatId,
  handleSelectChat,
}: Props) {
  return (
    <div
      className={`bg-[#232323] border-t-0 lg:mt-1  w-[17.75rem] transition-all duration-50 ease-in-out overflow-hidden flex flex-col items-center ${
        isSidebarOpen ? "border-r border-[#E2E2E2]/60" : "border-r-0"
      }`}
    >

      {isSidebarOpen ? (
        <div className="w-[13.75rem] lg:py-11 flex flex-col overflow-y-auto px-4">

          <button
            onClick={handleNewChat}
            className="text-white  rounded-lg flex items-center gap-2 transition-colors lg:mb-7"
          >
            <Plus size={20} />
            <span>New Chat</span>
          </button>

          <div>
            <div className="w-[200px] flex items-center justify-between mb-[22px]">
              <p className="text-[14px] font-medium text-white">
                Recent Searches
              </p>
              <Search size={16} className="text-white/60" />
            </div>

            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`group w-[200px] rounded-[12px] hover:bg-[#FFFFFF40] py-1.5 mb-2 cursor-pointer transition-colors 
                   ${
                    currentChatId === chat.id 
                    ? "bg-[#FFFFFF14]"
                    :''
                    }
                  `}
              >
                <div
                  onClick={() => handleSelectChat(chat.id)}
                  
                  className={`flex items-center gap-6 px-4`}>
                  <div className="flex-1 justify-between min-w-0">
                    <p
                      className={`${
                        currentChatId === chat.id
                          ? "text-white"
                          : "text-white/60"
                      } text-sm truncate group-hover:text-white`}
                    >
                      {chat.title}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="ml-2 opacity-100 text-white cursor-pointer group-hover:opacity-100 transition-opacity"
                    aria-label="Delete chat"
                  >
                    <EllipsisVertical size={16}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
