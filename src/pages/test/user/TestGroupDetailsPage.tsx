import { useParams } from "react-router-dom";
import { BookOpen, Clock, FileText } from "lucide-react";

export default function TestGroupDetailsPage() {
  const { testGroupId } = useParams();

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-20 md:pt-24 pb-6 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          {/* Icon */}
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[#242645] mb-3">
            Coming Soon!
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            We're working hard to bring you the complete test group details page with test series, reviews, and more.
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-900">Test Series</p>
              <p className="text-xs text-blue-600 mt-1">Browse & purchase</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-900">Details</p>
              <p className="text-xs text-purple-600 mt-1">Full information</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-900">Reviews</p>
              <p className="text-xs text-green-600 mt-1">User feedback</p>
            </div>
          </div>

          {/* Debug Info */}
          {testGroupId && (
            <p className="text-xs text-gray-400 mt-8">
              Test Group ID: {testGroupId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
