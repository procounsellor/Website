import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useBlogDetail, useDeleteBlogMutation } from "@/hooks/useBlogs";
import { formatPublishedHeading } from "@/api/blogs";
import { useAuthStore } from "@/store/AuthStore";

function splitDescriptionToBlocks(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const parts = trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [trimmed];
}

export default function BlogDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const role = useAuthStore((s) => s.role);
  const isCounselor = role === "counselor";
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteBlogMutation();

  const { data: blog, isLoading, isError, error, refetch } = useBlogDetail(
    id === "new" ? undefined : id
  );

  const handleConfirmDelete = () => {
    if (!id || id === "new") return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Blog deleted.");
        setShowDeleteConfirm(false);
        navigate("/admissions/blogs");
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Could not delete blog.");
      },
    });
  };

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
        {id === "new" ? (
          <div className="max-w-lg rounded-[16px] border border-[#E3E8F4] bg-white p-6 shadow-sm">
            <p className="text-[0.875rem] text-(--text-muted) mb-4">
              To write a new article, open the create form (counsellor accounts only).
            </p>
            <button
              type="button"
              onClick={() => navigate("/admissions/blogs/new")}
              className="rounded-lg bg-[#0E1629] px-4 py-2 text-[0.875rem] font-medium text-white hover:opacity-95 cursor-pointer"
            >
              Go to create blog
            </button>
          </div>
        ) : (
          <>
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

                {isCounselor && (
                  <div className="mt-10 pt-6 border-t border-[#E3E8F4]">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-[0.875rem] font-medium text-red-600 hover:text-red-700 underline cursor-pointer"
                    >
                      Delete this blog
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {showDeleteConfirm && blog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-semibold text-[#0E1629] mb-3">Delete blog</h2>
            <p className="text-[0.875rem] text-[#6B7280] mb-6">
              Delete &quot;{blog.title}&quot;? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end flex-wrap">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-lg border border-gray-200 text-[#0E1629] hover:bg-gray-50 text-[0.875rem] font-medium cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-[0.875rem] font-medium hover:bg-red-700 cursor-pointer disabled:opacity-60"
              >
                {deleteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
