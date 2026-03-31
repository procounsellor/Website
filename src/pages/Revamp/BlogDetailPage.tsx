import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBlogDetail } from "@/hooks/useBlogs";
import { formatPublishedHeading } from "@/api/blogs";

function splitDescriptionToBlocks(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const parts = trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [trimmed];
}

export default function BlogDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: blog, isLoading, isError, error, refetch } = useBlogDetail(id);

  const bodyBlocks = useMemo(
    () => (blog?.description ? splitDescriptionToBlocks(blog.description) : []),
    [blog?.description]
  );

  const publishedLabel = blog
    ? formatPublishedHeading(blog.publishedOnMillis)
    : "";
  const breadcrumbTitle =
    blog && blog.title.length > 42
      ? `${blog.title.slice(0, 42)}…`
      : blog?.title ?? "Blog";

  const mobileTitle =
    blog && blog.title.length > 28
      ? `${blog.title.slice(0, 28)}…`
      : blog?.title ?? "Blog";

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(0deg, rgba(198, 221, 240, 0.25), rgba(198, 221, 240, 0.25))",
      }}
    >
      {/* Mobile header */}
      <div className="sm:hidden w-full bg-white border-b border-[#E3E8F4]">
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-(--text-main) cursor-pointer text-[16px] font-semibold"
            aria-label="Go back"
          >
            {"<"}
          </button>
          <span className="text-[16px] font-semibold text-(--text-main) truncate">
            {isLoading ? "Loading…" : mobileTitle}
          </span>
        </div>
      </div>

      {/* Desktop breadcrumb */}
      <div className="hidden sm:block w-full border-b border-[#E3E8F4] bg-white">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[60px] pt-3 pb-3 text-[0.875rem] text-(--text-muted) font-medium">
          <button
            type="button"
            onClick={() => navigate("/admissions")}
            className="hover:underline cursor-pointer"
          >
            Admission
          </button>
          <span className="mx-1">{">"}</span>
          <button
            type="button"
            onClick={() => navigate("/admissions/blogs")}
            className="hover:underline cursor-pointer"
          >
            Blogs
          </button>
          <span className="mx-1">{">"}</span>
          <span className="text-(--text-main)">{breadcrumbTitle}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-[60px] py-6 sm:py-8">
        {isLoading && (
          <p className="text-(--text-muted) text-[0.875rem]">Loading article…</p>
        )}
        {isError && (
          <div className="space-y-3">
            <p className="text-red-600 text-[0.875rem]">
              {(error as Error)?.message ?? "Could not load this blog."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-[0.875rem] font-medium text-[#0E1629] underline cursor-pointer"
            >
              Try again
            </button>
          </div>
        )}
        {!isLoading && !isError && !blog && (
          <p className="text-(--text-muted) text-[0.875rem]">
            This blog could not be found.
          </p>
        )}
        {blog && (
          <>
            <h1 className="text-[24px] sm:text-[40px] font-semibold text-[#0E1629] leading-snug">
              {blog.title}
            </h1>
            <p className="mt-3 sm:mt-4 text-[14px] sm:text-[22px] text-[#0E1629] font-medium">
              By: {blog.author}
            </p>
            <p className="mt-1 text-[12px] sm:text-[18px] font-medium text-(--text-muted)">
              Published On: {publishedLabel}
            </p>

            <div className="mt-4 sm:mt-6 rounded-[16px] overflow-hidden bg-white">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-[180px] sm:h-[413px] object-cover"
              />
            </div>

            <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 text-[12px] sm:text-[18px] font-medium leading-relaxed text-[#6B7280]">
              {bodyBlocks.map((block, i) => (
                <p key={i} className="font-medium whitespace-pre-line">
                  {block}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
