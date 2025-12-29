import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Heart } from 'lucide-react';
import type { CommunityDashboardItem } from '@/types/community';
import { formatTimeAgo } from '@/utils/time';
import { useAuthStore } from '@/store/AuthStore';
import { bookmarkQuestion } from '@/api/community';
import { toast } from 'react-hot-toast';

interface DashboardCardProps {
  item: CommunityDashboardItem;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { user, userId } = useAuthStore();
  const token = localStorage.getItem('jwt');
  const [isBookmarked, setIsBookmarked] = useState(item.questionBookmarkedByMe || false);

  useEffect(() => {
    setIsBookmarked(item.questionBookmarkedByMe || false);
  }, [item]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId || !token) return;
    const previousState = isBookmarked;
    setIsBookmarked(!previousState);

    try {
      const response = await bookmarkQuestion(
        userId,
        item.questionId,
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

  const askerImage = item.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.fullName)}`;
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON') {
      e.stopPropagation();
      return;
    }
    navigate(`/community/question/${item.questionId}`);
  };

  return (
    <div 
        onClick={handleClick}
        className="w-full max-w-[860px] mx-auto p-5 rounded-lg cursor-pointer bg-[#F5F6FF] border-b-2 border-white">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <img
            src={askerImage}
            alt={item.fullName}
            className="w-[42px] h-[42px] rounded-full object-cover"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-[#242645]">
                {item.fullName}
              </span>
              <span className="text-sm text-[#8C8CA1] ml-6">
                {formatTimeAgo(item.questionTimestamp.seconds)}
              </span>
            </div>
            <span className="text-sm text-[#242645]">
              {item.interestedCourse || 'Student'}
            </span>
          </div>
        </div>
        <button 
            onClick={handleBookmark}
            className={`transition-colors cursor-pointer ${isBookmarked ? 'text-[#655E95]' : 'text-gray-500 hover:text-indigo-600'}`}
        >
          <Bookmark size={24} fill={isBookmarked ? "#655E95" : "none"} />
        </button>
      </div>

      <p className="mt-[30px] text-xl font-semibold text-[#242645] leading-[26px]">
        {item.question}
      </p>

      {item.topAnswer && (
        <div className="mt-4">
          <p
            className={`text-base text-[#242645] leading-[26px] ${
              !isExpanded ? 'line-clamp-3' : ''
            }`}
          >
            {item.topAnswer}
          </p>
          
          {!isExpanded && item.topAnswer.length > 100 && (
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

          {item.answerPhotoUrl && (
            <img
              src={item.answerPhotoUrl}
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

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300">
        <div className="flex items-center gap-6 text-gray-600">
          <button className="flex items-center cursor-pointer gap-2 hover:text-red-500">
            <Heart size={18} className='text-[#2F43F2] hover:text-red-500' />
            <span className="text-sm">{item.likesCountOnAnswer}</span>
          </button>
          <button className="flex items-center cursor-pointer gap-2 hover:text-indigo-600">
            <img src="/msg_comm.svg" alt="comments" />
            <span className="text-sm">{item.commentCountOnAnswer}</span>
          </button>
          <div className="flex items-center cursor-pointer gap-2">
            <img src="/bulb_comm.svg" alt="comment" />
            <span className="text-sm">{item.answerCount} Answers</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <img src="/eye_comm.svg" alt="views" />
          <span className="text-sm">{item.questionViews}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;