import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Star, Users, Bookmark, Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { getAllTestGroupsForUser, buyTestGroup, bookmarkTestGroup } from "@/api/testGroup";
import type { TestGroup } from "@/types/testGroup";

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

  useEffect(() => {
    if (userId && counsellorId && userRole !== "counselor") {
      fetchTestGroups();
    } else {
      setLoading(false);
    }
  }, [userId, counsellorId, userRole]);

  const fetchTestGroups = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await getAllTestGroupsForUser(userId, counsellorId);
      if (response.status && response.data) {
        setTestGroups(response.data);
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
    
    if (!userId) {
      toast.error("Please login to purchase");
      return;
    }

    try {
      const response = await buyTestGroup(userId, counsellorId, testGroupId, price, null);
      if (response.status) {
        toast.success("Test group purchased successfully!");
        setPurchasedIds(prev => new Set(prev).add(testGroupId));
      } else {
        toast.error(response.message || "Failed to purchase test group");
      }
    } catch (error) {
      console.error("Failed to buy test group:", error);
      toast.error("Failed to purchase test group");
    }
  };

  const handleBookmark = async (testGroupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      toast.error("Please login to bookmark");
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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#EFEFEF]">
        <h2 className="text-lg font-semibold text-[#242645] mb-4">Test Series</h2>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#13097D]" />
        </div>
      </div>
    );
  }

  if (testGroups.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#EFEFEF]">
        <h2 className="text-lg font-semibold text-[#242645] mb-4">Test Series</h2>
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No test series available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#EFEFEF]">
      <h2 className="text-lg font-semibold text-[#242645] mb-4">Test Series</h2>
      <div className="grid grid-cols-1 gap-4">
        {testGroups.map((group) => (
          <div
            key={group.testGroupId}
            onClick={() => handleCardClick(group.testGroupId)}
            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            {/* Banner */}
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
              {group.bannerImagUrl ? (
                <img
                  src={group.bannerImagUrl}
                  alt={group.testGroupName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white opacity-50" />
                </div>
              )}
              
              {/* Bookmark Button */}
              <button
                onClick={(e) => handleBookmark(group.testGroupId, e)}
                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                title={bookmarkedIds.has(group.testGroupId) ? "Remove bookmark" : "Bookmark"}
              >
                <Bookmark
                  size={16}
                  className={bookmarkedIds.has(group.testGroupId) ? "fill-yellow-500 text-yellow-500" : "text-gray-600"}
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-base font-bold text-[#242645] mb-2 line-clamp-2 group-hover:text-[--btn-primary] transition-colors">
                {group.testGroupName}
              </h3>
              
              {group.testGroupDescription && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {group.testGroupDescription}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <BookOpen size={14} />
                  <span>{group.attachedTestIds?.length || 0} Tests</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{group.soldCount || 0} Students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500" />
                  <span>{group.rating ? group.rating.toFixed(1) : "New"}</span>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#072EB1] to-[#03134B]">
                    {group.priceType === "FREE" ? "Free" : `₹${group.price}`}
                  </span>
                </div>

                {purchasedIds.has(group.testGroupId) ? (
                  <span className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium">
                    Purchased
                  </span>
                ) : (
                  <button
                    onClick={(e) => handleBuyTestGroup(group.testGroupId, group.price, e)}
                    className="flex items-center gap-2 px-4 py-2 bg-[--btn-primary] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                  >
                    <ShoppingCart size={16} />
                    {group.priceType === "FREE" ? "Enroll" : "Buy Now"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
