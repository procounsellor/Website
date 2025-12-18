import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageCircleQuestionMark , SquarePen, History } from "lucide-react";
import AskQuestionModal from "@/components/community/AskQuestionModal";
import { useAuthStore } from "@/store/AuthStore";

export default function CommunityActions() {
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const navigate = useNavigate();

  const { user, toggleLogin } = useAuthStore();

  const handleAskClick = () => {
    if (!user) {
      toggleLogin();
      return;
    }
    setIsAskModalOpen(true);
  };

  const handleAnswerClick = () => {
    if (!user) {
      toggleLogin();
      return;
    }
    navigate('/community/answer');
  };

  const handleActivityClick = () => {
    if (!user) {
      toggleLogin();
      return;
    }
    navigate('/community/my-activity');
  };

  const ActionButton: React.FC<{
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    count?: number;
  }> = ({ icon: Icon, label, onClick, count }) => {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 font-semibold text-[#2F43F2] transition-colors duration-200 hover:text-indigo-900"
      >
        <Icon size={20} />
        <span className="text-sm leading-[18px]">{label}</span>
        {count && (
          <span className="ml-1 px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
            {count}
          </span>
        )}
      </button>
    );
  };

  const Separator = () => (
    <div className="w-px h-[31px] bg-[#13097D33]" />
  );

  return (
    <>
      <div className="max-w-[900px] w-full mx-auto mt-15 bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Search size={24} className="text-[#343C6A] shrink-0" />
            <input
              type="text"
              placeholder="Search questions"
              className="w-full bg-[#F5F5F7] rounded-md p-3 text-sm placeholder-[#2F43F2] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#13097D] focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-center gap-10 pl-1">
            <div className="flex items-center gap-[60px]">
              <ActionButton
                icon={MessageCircleQuestionMark }
                label="Ask"
                onClick={handleAskClick}
              />
              <Separator />
              <ActionButton
                icon={SquarePen}
                label="Answer"
                onClick={handleAnswerClick}
              />
              <Separator />
              <ActionButton
                icon={History}
                label="My Activity"
                onClick={handleActivityClick}
                // count={24} 
              />
            </div>
          </div>
        </div>
      </div>

      <AskQuestionModal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
      />
    </>
  );
}