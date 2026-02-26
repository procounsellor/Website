import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";

interface ComingSoonFallbackProps {
  title: string;
  message: string;
}

export default function ComingSoonFallback({ title, message }: ComingSoonFallbackProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#13097D]/10 rounded-full blur-xl"></div>
            <div className="relative bg-gradient-to-br from-[#13097D] to-[#1a0fa8] p-6 rounded-full">
              <Clock className="h-12 w-12 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-bold text-[#242645] mb-4">
          {title}
        </h1>

        {/* Message */}
        <p className="text-base md:text-lg text-[#8C8CA1] mb-8 leading-relaxed">
          {message}
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#13097D]/30"></div>
          <div className="h-2 w-2 rounded-full bg-[#13097D]/50"></div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#13097D]/30"></div>
        </div>

        {/* Go Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#13097D] text-white font-semibold rounded-lg hover:bg-[#13097D]/90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-5 w-5" />
          Go Back
        </button>

        {/* Additional Info */}
        <p className="mt-8 text-sm text-[#8C8CA1]">
          Want to be notified when this page is ready?{" "}
          <a href="/contact" className="text-[#13097D] hover:underline font-medium">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
