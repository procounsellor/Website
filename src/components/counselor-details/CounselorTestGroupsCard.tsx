import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Star, Users, Bookmark, Loader2, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { getAllTestGroupsOfCounsellorForUser, getPublicTestGroupsByCounsellor, buyTestGroup, bookmarkTestGroup } from "@/api/testGroup";
import type { TestGroup } from "@/types/testGroup";
import { useAuthStore } from "@/store/AuthStore";

interface CounselorTestGroupsCardProps {
  counsellorId: string;
  userId: string | null;
  userRole: string;
}

export function CounselorTestGroupsCard({ counsellorId, userId, userRole }: CounselorTestGroupsCardProps) {
  const navigate = useNavigate();
  const [testGroups, setTestGroups] = useState<TestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);

  const { toggleLogin, setPendingAction } = useAuthStore();

  useEffect(() => {
    if (counsellorId && userRole !== "counselor") {
      fetchTestGroups();
    } else {
      setLoading(false);
    }
  }, [userId, counsellorId, userRole]);

  const fetchTestGroups = async () => {
    try {
      setLoading(true);
      let response;

      if (userId) {
        // Logged in - use authenticated endpoint
        response = await getAllTestGroupsOfCounsellorForUser(userId, counsellorId);
      } else {
        // Not logged in - use public endpoint
        response = await getPublicTestGroupsByCounsellor(counsellorId);
      }

      if (response.status && response.data) {
        setTestGroups(response.data);

        // Initialize bookmarked and purchased states from API response (only for logged-in users)
        if (userId) {
          const bookmarked = new Set<string>();
          const purchased = new Set<string>();
          response.data.forEach((group: any) => {
            if (group.bookmarked) bookmarked.add(group.testGroupId);
            if (group.brought || group.bought) purchased.add(group.testGroupId);
          });
          setBookmarkedIds(bookmarked);
          setPurchasedIds(purchased);
        }
      }
    } catch (error) {
      console.error("Failed to fetch test groups:", error);
      toast.error("Failed to load test groups");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTestGroup = async (testGroupId: string, price: number, e: React.MouseEvent) => {
    e.stopPropagation();

    const executePurchase = async () => {
      const currentUserId = userId || localStorage.getItem("phone") || "";

      if (!currentUserId) {
        toast.error("Please login to purchase");
        return;
      }

      try {
        const response = await buyTestGroup(currentUserId, counsellorId, testGroupId, price, null);
        if (response.status) {
          toast.success("Test group purchased successfully!");
          setPurchasedIds(prev => new Set(prev).add(testGroupId));
          fetchTestGroups(); // Refresh to get updated data
        } else {
          toast.error(response.message || "Failed to purchase test group");
        }
      } catch (error) {
        console.error("Failed to buy test group:", error);
        toast.error("Failed to purchase test group");
      }
    };

    // Check authentication
    if (!userId) {
      console.log('User not authenticated, triggering login with callback');
      setPendingAction(() => executePurchase);
      toggleLogin();
      return;
    }

    await executePurchase();
  };

  const handleBookmark = async (testGroupId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Check authentication
    if (!userId) {
      console.log('User not authenticated for bookmark, triggering login');
      toast.error("Please login to bookmark");
      toggleLogin();
      return;
    }

    try {
      const response = await bookmarkTestGroup(userId, testGroupId);
      if (response.status) {
        const isBookmarked = bookmarkedIds.has(testGroupId);
        if (isBookmarked) {
          const newSet = new Set(bookmarkedIds);
          newSet.delete(testGroupId);
          setBookmarkedIds(newSet);
          toast.success("Removed from bookmarks");
        } else {
          setBookmarkedIds(prev => new Set(prev).add(testGroupId));
          toast.success("Added to bookmarks");
        }
      }
    } catch (error) {
      console.error("Failed to bookmark:", error);
      toast.error("Failed to bookmark test group");
    }
  };

  const handleCardClick = (testGroupId: string) => {
    navigate(`/test-group/${testGroupId}`);
  };

  if (userRole === "counselor") {
    return null;
  }

  // Hide the section if no test groups after loading
  if (!loading && testGroups.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 md:p-6 border border-[#EFEFEF]">
        <h2 className="text-base md:text-lg font-semibold text-[#242645] mb-4">Test Series</h2>
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#13097D]" />
        </div>
      </div>
    );
  }

  const displayedGroups = isExpanded ? testGroups : testGroups.slice(0, 2);

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 border border-[#EFEFEF]">
      <h2 className="text-base md:text-lg font-semibold text-[#242645] mb-4">Test Series</h2>
      <div className="flex flex-col gap-3">
        {displayedGroups.map((group) => (
          <div
            key={group.testGroupId}
            onClick={() => handleCardClick(group.testGroupId)}
            className="flex border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group bg-white"
          >
            {/* Small Image Left - Responsive sized */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600">
              {group.bannerImagUrl ? (
                <img
                  src={group.bannerImagUrl}
                  alt={group.testGroupName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-white opacity-50" />
                </div>
              )}

              {/* Bookmark Button */}
              <button
                onClick={(e) => handleBookmark(group.testGroupId, e)}
                className="absolute top-1 right-1 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors cursor-pointer shadow-sm"
                title={bookmarkedIds.has(group.testGroupId) ? "Remove bookmark" : "Bookmark"}
              >
                <Bookmark
                  size={12}
                  className={bookmarkedIds.has(group.testGroupId) ? "fill-yellow-500 text-yellow-500" : "text-gray-600"}
                />
              </button>
            </div>

            {/* Content Right */}
            <div className="flex-1 p-2 md:p-3 flex flex-col justify-between min-w-0">
              <div>
                <h3 className="text-xs md:text-sm font-bold text-[#242645] mb-1 line-clamp-2 leading-tight group-hover:text-[--btn-primary] transition-colors">
                  {group.testGroupName}
                </h3>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500 mb-1">
                  <div className="flex items-center gap-0.5">
                    <BookOpen size={10} />
                    <span>{group.attachedTestIds?.length || 0} Tests</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Users size={10} />
                    <span>{group.soldCount || 0} Students</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star size={10} className="text-yellow-500" />
                    <span>{group.rating ? group.rating.toFixed(1) : "New"}</span>
                  </div>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm md:text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#072EB1] to-[#03134B]">
                  {group.priceType === "FREE" ? "Free" : `₹${group.price}`}
                </span>

                {purchasedIds.has(group.testGroupId) ? (
                  <span className="px-2 py-1 bg-green-50 text-green-600 rounded-md text-[10px] md:text-xs font-medium border border-green-100 flex items-center gap-1">
                    <CheckCircle2 size={10} /> Purchased
                  </span>
                ) : (
                  <button
                    onClick={(e) => handleBuyTestGroup(group.testGroupId, group.price, e)}
                    className="px-3 py-1.5 bg-[--btn-primary] text-white rounded-md hover:opacity-90 transition-opacity text-[10px] md:text-xs font-medium cursor-pointer"
                  >
                    {group.priceType === "FREE" ? "Enroll" : "Buy"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {testGroups.length > 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 mt-1 cursor-pointer py-1"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp size={14} />
              </>
            ) : (
              <>
                See More <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
