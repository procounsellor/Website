import Blogs from "@/components/Revamp/admissions/Blogs";
import { useNavigate } from "react-router-dom";

export default function BlogsPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(0deg, rgba(198, 221, 240, 0.25), rgba(198, 221, 240, 0.25))",
      }}
    >
      <div className="w-full border-b border-[#E3E8F4] bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 xl:px-12 pt-3 pb-3 flex items-center justify-between gap-3">
          <p className="text-[0.875rem] text-(--text-muted) font-medium">
            <button
              type="button"
              onClick={() => navigate("/admissions")}
              className="hover:underline cursor-pointer"
            >
              Admission
            </button>
            <span className="mx-1">{">"}</span>{" "}
            <span className="text-(--text-main)">Blogs</span>
          </p>
          <button
            type="button"
            onClick={() => navigate("/admissions/blog-authors")}
            className="text-[0.875rem] font-medium text-[#0E1629] underline cursor-pointer"
          >
            View authors
          </button>
        </div>
      </div>

      <Blogs variant="full" />
    </div>
  );
}
