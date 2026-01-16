import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BookOpen, Clock, FileText, Star, ShoppingCart, Bookmark, Lock, Loader2, Users, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  getTestGroupByIdForUser,
  buyTestGroup,
  bookmarkTestGroup,
  addReviewToTestGroup,
  updateReviewToTestGroup,
  // deleteReviewFromTestGroup,
} from "@/api/testGroup";

interface TestSeries {
  testSeriesId: string;
  counsellorId: string;
  testName: string;
  testDescription: string;
  bannerImagUrl: string | null;
  stream: string;
  durationInMinutes: number;
  pointsForCorrectAnswer: number;
  negativeMarkingEnabled: boolean;
  negativeMarks: number;
  listOfSection: Array<{
    sectionName: string;
    totalQuestionsSupposedToBeAdded: number;
    totalQuestionsAdded: number;
  }>;
}

interface Review {
  reviewId: string;
  userId: string;
  rating: number;
  reviewText: string;
  createdAt: { seconds: number; nanos: number };
}

interface TestGroupData {
  testGroup: {
    testGroupId: string;
    testGroupName: string;
    testGroupDescription: string | null;
    bannerImagUrl: string | null;
    priceType: string;
    price: number;
    rating: number | null;
    ratingCount: number | null;
    soldCount: number;
    published: boolean;
  };
  attachedTests: TestSeries[];
  reviews: Review[];
  bookmarked: boolean;
  bought: boolean;
}

export default function TestGroupDetailsPage() {
  const { testGroupId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<TestGroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [userReview, setUserReview] = useState<Review | null>(null);
  const userId = localStorage.getItem("phone") || "";

  useEffect(() => {
    if (testGroupId && userId) {
      fetchTestGroupDetails();
    }
  }, [testGroupId, userId]);

  const fetchTestGroupDetails = async () => {
    if (!userId || !testGroupId) return;
    
    try {
      setLoading(true);
      const response = await getTestGroupByIdForUser(userId, testGroupId);
      if (response.status && response.data) {
        setData(response.data);
        // Find user's own review
        const myReview = response.data.reviews.find((r: Review) => r.userId === userId);
        if (myReview) {
          setUserReview(myReview);
          setReviewRating(myReview.rating);
          setReviewText(myReview.reviewText);
        }
      }
    } catch (error) {
      console.error("Failed to fetch test group details:", error);
      toast.error("Failed to load test group details");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!testGroupId || !data) return;
    
    if (!userId) {
      toast.error("Please login to purchase");
      navigate("/");
      return;
    }
    
    // For free test groups, just enroll
    if (data.testGroup.priceType === "FREE" || data.testGroup.price === 0) {
      try {
        const counsellorId = data.attachedTests[0]?.counsellorId || '';
        
        if (!counsellorId) {
          toast.error("Unable to process enrollment");
          return;
        }
        
        const response = await buyTestGroup(
          userId,
          counsellorId,
          testGroupId,
          0,
          null
        );
        
        if (response.status) {
          toast.success("Successfully enrolled!");
          fetchTestGroupDetails();
        } else {
          toast.error(response.message || "Failed to enroll");
        }
      } catch (error) {
        console.error("Failed to enroll:", error);
        toast.error("Failed to enroll in test group");
      }
      return;
    }
    
    // For paid test groups
    const counsellorId = data.attachedTests[0]?.counsellorId || '';
    
    if (!counsellorId) {
      toast.error("Unable to process purchase");
      return;
    }
    
    try {
      const response = await buyTestGroup(
        userId,
        counsellorId,
        testGroupId,
        data.testGroup.price,
        null
      );
      
      if (response.status) {
        toast.success("Test group purchased successfully!");
        fetchTestGroupDetails();
      } else {
        if (response.message?.includes("insufficient")) {
          toast.error("Insufficient balance. Please recharge your wallet.");
          setTimeout(() => navigate("/recharge-wallet"), 1500);
        } else {
          toast.error(response.message || "Failed to purchase");
        }
      }
    } catch (error) {
      console.error("Failed to buy:", error);
      toast.error("Failed to purchase test group");
    }
  };

  const handleBookmark = async () => {
    if (!userId || !testGroupId) return;
    
    try {
      const response = await bookmarkTestGroup(userId, testGroupId);
      if (response.status) {
        setData(prev => prev ? { ...prev, bookmarked: response.bookmarked } : null);
        toast.success(response.bookmarked ? "Added to bookmarks" : "Removed from bookmarks");
      }
    } catch (error) {
      console.error("Failed to bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  const handleSubmitReview = async () => {
    if (!userId || !testGroupId) return;
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      if (userReview) {
        // Update existing review
        const response = await updateReviewToTestGroup(
          userId,
          userReview.reviewId,
          testGroupId,
          reviewRating,
          reviewText
        );
        if (response.status) {
          toast.success("Review updated successfully!");
          setShowReviewModal(false);
          fetchTestGroupDetails();
        }
      } else {
        // Add new review
        const response = await addReviewToTestGroup(
          userId,
          testGroupId,
          reviewRating,
          reviewText
        );
        if (response.status) {
          toast.success("Review added successfully!");
          setShowReviewModal(false);
          fetchTestGroupDetails();
        }
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review");
    }
  };

  const handleTestSeriesClick = (testSeriesId: string) => {
    if (data?.bought) {
      navigate(`/test-info/${testSeriesId}`);
    } else {
      toast.error("Please purchase this test group first");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Test group not found</p>
      </div>
    );
  }

  const { testGroup, attachedTests, reviews, bookmarked, bought } = data;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-20 md:pt-24 pb-6 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Banner */}
          <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600">
            {testGroup.bannerImagUrl ? (
              <img
                src={testGroup.bannerImagUrl}
                alt={testGroup.testGroupName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-24 h-24 text-white opacity-50" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#242645] mb-2">
                  {testGroup.testGroupName}
                </h1>
                {testGroup.testGroupDescription && (
                  <p className="text-gray-600 mb-4">{testGroup.testGroupDescription}</p>
                )}
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {testGroup.rating?.toFixed(1) || "N/A"}
                    </span>
                    <span>({testGroup.ratingCount || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{testGroup.soldCount} enrolled</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{attachedTests.length} test series</span>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-col items-end gap-3">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  {testGroup.priceType === "FREE" ? "Free" : `₹${testGroup.price}`}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleBookmark}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      bookmarked
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-white border-gray-200 text-gray-600 hover:border-blue-200"
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${bookmarked ? "fill-current" : ""}`} />
                  </button>
                  {!bought ? (
                    <button
                      onClick={handleBuy}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      {testGroup.priceType === "FREE" || testGroup.price === 0 ? (
                        <>
                          <BookOpen className="w-5 h-5" />
                          Enroll Free
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Buy Now
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="px-6 py-2 bg-green-50 text-green-600 rounded-lg border border-green-200 font-medium">
                      ✓ Purchased
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Series List */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#242645] mb-4">Test Series</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attachedTests.map((test) => {
              const totalQuestions = test.listOfSection.reduce(
                (sum, s) => sum + s.totalQuestionsSupposedToBeAdded,
                0
              );
              const totalAdded = test.listOfSection.reduce(
                (sum, s) => sum + s.totalQuestionsAdded,
                0
              );

              return (
                <div
                  key={test.testSeriesId}
                  onClick={() => handleTestSeriesClick(test.testSeriesId)}
                  className={`border rounded-xl overflow-hidden transition-all ${
                    bought
                      ? "hover:shadow-lg cursor-pointer border-gray-200"
                      : "border-gray-200 opacity-60 cursor-not-allowed"
                  }`}
                >
                  {/* Banner */}
                  <div className="relative h-32 bg-gradient-to-r from-blue-400 to-purple-500">
                    {test.bannerImagUrl ? (
                      <img
                        src={test.bannerImagUrl}
                        alt={test.testName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-12 h-12 text-white opacity-50" />
                      </div>
                    )}
                    {!bought && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-[#242645] mb-2 line-clamp-2">
                      {test.testName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {test.testDescription}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{test.durationInMinutes} mins</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{totalAdded}/{totalQuestions}Q</span>
                      </div>
                      <div>
                        <span className="font-medium">+{test.pointsForCorrectAnswer}</span>
                        {test.negativeMarkingEnabled && (
                          <span> / -{test.negativeMarks}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#242645]">Reviews</h2>
            {bought && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer"
              >
                {userReview ? "Edit Review" : "Write Review"}
              </button>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p>No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.reviewId} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt.seconds * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.reviewText}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">
                {userReview ? "Edit Review" : "Write Review"}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setReviewRating(rating)}
                      className="transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= reviewRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
