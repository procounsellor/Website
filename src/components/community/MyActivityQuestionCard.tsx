import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Heart } from 'lucide-react';
import type { CommunityDashboardItem } from '@/types/community';
import { formatTimeAgo } from '@/utils/time';
import { useAuthStore } from '@/store/AuthStore';
import { bookmarkQuestion, likeAnswer } from '@/api/community';
import { toast } from 'react-hot-toast';

interface MyActivityQuestionCardProps {
  question: CommunityDashboardItem;
}

const MyActivityQuestionCard: React.FC<MyActivityQuestionCardProps> = ({ question }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(question.questionBookmarkedByMe || false);
  const navigate = useNavigate();
  const { user, userId } = useAuthStore();
  const token = localStorage.getItem('jwt');

  const [isLiked, setIsLiked] = useState(question.answerLikedByMe || false);
  const [likesCount, setLikesCount] = useState(question.likesCountOnAnswer || 0);

  useEffect(() => {
    setIsBookmarked(question.questionBookmarkedByMe || false);
    setIsLiked(question.answerLikedByMe || false);
    setLikesCount(question.likesCountOnAnswer || 0);
  }, [question]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId || !token) return;
    const previousState = isBookmarked;
    setIsBookmarked(!previousState);

    try {
      const response = await bookmarkQuestion(
        userId,
        question.questionId,
        user?.role || 'user',
        token
      );
      
      if (response.status === 'Success') {
        setIsBookmarked(response.isBookmarked);
        toast.success(response.message);
      } else {
        setIsBookmarked(previousState);
      }
    } catch (error) {
      console.error(error);
      setIsBookmarked(previousState);
      toast.error("Failed to bookmark");
    }
  };

  const userImage = question.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(question.fullName)}`;
  
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON') {
      e.stopPropagation();
      return;
    }
    if (question.questionId) {
      navigate(`/community/question/${question.questionId}`);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!question.topAnswerId) {
      toast.error("No answer available to like");
      return;
    }
    if (!userId || !token) {
      toast.error("Please login to like answers");
      return;
    }

    const previousLikedState = isLiked;
    const previousCount = likesCount;

    setIsLiked(!previousLikedState);
    setLikesCount(previousLikedState ? previousCount - 1 : previousCount + 1);

    try {
      const response = await likeAnswer(
        userId,
        question.topAnswerId,
        user?.role || 'user',
        token
      );

      if (response.status === 'Success') {
        setIsLiked(response.isLiked);
      } else {
        setIsLiked(previousLikedState);
        setLikesCount(previousCount);
      }
    } catch (error) {
      console.error(error);
      setIsLiked(previousLikedState);
      setLikesCount(previousCount);
      toast.error("Failed to update like");
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="w-full max-w-[860px] mx-auto p-5 rounded-lg cursor-pointer bg-[#F5F6FF] border-b-2 border-white"
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <img
            src={userImage}
            alt={question.fullName}
            className="w-[42px] h-[42px] rounded-full object-cover"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-[#242645]">
                {question.fullName}
              </span>
              {question.questionTimestamp?.seconds && (
                <span className="text-sm text-[#8C8CA1] ml-6">
                  {formatTimeAgo(question.questionTimestamp.seconds)}
                </span>
              )}
            </div>
            <span className="text-sm text-[#242645]">
              {question.interestedCourse || 'Student'}
            </span>
          </div>
        </div>
        <button 
          onClick={handleBookmark}
          className={`transition-colors ${isBookmarked ? 'text-[#655E95]' : 'text-gray-500 hover:text-indigo-600'}`}
        >
          <Bookmark size={24} fill={isBookmarked ? "#655E95" : "none"} />
        </button>
      </div>

      <p className="mt-[30px] text-xl font-semibold text-[#242645] leading-[26px]">
        {question.question}
      </p>

      {question.topAnswer && (
        <div className="mt-4">
          <p
            className={`text-base text-[#242645] leading-[26px] ${
              !isExpanded ? 'line-clamp-3' : ''
            }`}
          >
            {question.topAnswer}
          </p>
          
          {!isExpanded && question.topAnswer.length > 100 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="font-semibold text-[#242645] underline cursor-pointer"
            >
              Read more
            </button>
          )}

          {question.answerPhotoUrl && (
            <img
              src={question.answerPhotoUrl}
              alt="Answer visual"
              className="mt-4 w-full h-auto max-h-[400px] rounded-lg object-cover"
            />
          )}

          {isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="mt-1 font-semibold text-[#242645] underline"
            >
              Show less
            </button>
          )}
        </div>
      )}

      {!question.topAnswer && question.question && question.question.length > 150 && (
        <div className="mt-4">
          <p
            className={`text-base text-[#242645] leading-[26px] ${
              !isExpanded ? 'line-clamp-3' : ''
            }`}
          >
            {question.question}
          </p>
          
          {!isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="font-semibold text-[#242645] underline cursor-pointer"
            >
              Read more
            </button>
          )}

          {isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="mt-1 font-semibold text-[#242645] underline"
            >
              Show less
            </button>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300">
        <div className="flex items-center gap-6 text-gray-600">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
            disabled={!question.topAnswerId}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            <span className="text-sm">{likesCount}</span>
          </button>
          <button className="flex items-center gap-2 hover:text-indigo-600">
            <img src="/msg_comm.svg" alt="comment" />
            <span className="text-sm">{question.commentCountOnAnswer || 0}</span>
          </button>
          <div className="flex items-center gap-2">
            <img src="/bulb_comm.svg" alt="answers" />
            <span className="text-sm">{question.answerCount || 0} Answers</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <img src="/eye_comm.svg" alt="views" />
          <span className="text-sm">{question.questionViews || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default MyActivityQuestionCard;

