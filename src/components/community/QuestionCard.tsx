import React from 'react';
import { Bookmark, Pencil } from 'lucide-react';
import type { CommunityQuestion } from '@/types/community';
import { useAuthStore } from '@/store/AuthStore';
import { formatTimeAgo } from '@/utils/time';

interface QuestionCardProps {
  question: CommunityQuestion;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { user } = useAuthStore();
  const loggedInUserName = user?.firstName || 'User';
  const loggedInUserImage =
    user?.photoSmall || `https://ui-avatars.com/api/?name=${encodeURIComponent(loggedInUserName)}`;

  const askerName = 'ProCounsel Member';
  const askerCourse = 'Engineering Student';
  const askerImageFromApi = undefined; 
  const askerImage =
    askerImageFromApi || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(askerName)}`;

  const handleWriteAnswerClick = () => {
    console.log('Writing answer for questionId:', question.questionId);
  };

  return (
    <div className="w-full max-w-[860px] mx-auto p-5 rounded-lg bg-[#F5F5F7] border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <img
            src={askerImage}
            alt="User"
            className="w-[42px] h-[42px] rounded-full object-cover"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-[#242645]">
                {askerName}
              </span>
              <span className="text-sm text-[#8C8CA1] ml-6">
                {formatTimeAgo(question.timestamp.seconds)}
              </span>
            </div>
            <span className="text-sm text-[#242645]">{askerCourse}</span>
          </div>
        </div>
        <button className="text-gray-500 hover:text-indigo-600">
          <Bookmark size={24} />
        </button>
      </div>

      <p className="mt-[30px] text-xl font-semibold text-[#242645] leading-[26px]">
        {question.question}
      </p>

      <div className="mt-4 flex flex-col items-center gap-5 pt-4">
        <img
          src={loggedInUserImage}
          alt="Logged in user"
          className="w-[42px] h-[42px] rounded-full object-cover"
        />
        <div className="text-center">
          <p className="text-lg font-semibold text-[#242645]">
            {loggedInUserName}, wanna answer?
          </p>
          <p className="text-base text-[#242645] mt-1">
            People will be glad to see your answer
          </p>
        </div>

        <button
          onClick={handleWriteAnswerClick}
          className="h-[36px] flex items-center justify-center gap-2
                     rounded-xl border border-[#655E95] 
                     py-1.5 px-4
                     text-base font-medium text-[#655E95]
                     hover:bg-indigo-50"
        >
          <Pencil size={18} />
          <span>Write an answer</span>
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;