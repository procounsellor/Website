import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  useBlogDetail,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} from "@/hooks/useBlogs";

function millisToDatetimeLocal(ms: number | undefined): string {
  if (ms == null || Number.isNaN(Number(ms))) {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }
  const d = new Date(ms);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function parseDateInputToMillis(value: string): number {
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? Date.now() : t;
}

export default function BlogEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: blog, isLoading, isError, error, refetch } = useBlogDetail(id);

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [publisherName, setPublisherName] = useState("");
  const [description, setDescription] = useState("");
  const [publishedOn, setPublishedOn] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateMutation = useUpdateBlogMutation();
  const deleteMutation = useDeleteBlogMutation();

  useEffect(() => {
    if (!blog) return;
    setCategory(blog.category ?? "");
    setTitle(blog.title ?? "");
    setPublisherName(blog.author ?? "");
    setDescription(blog.description ?? "");
    setPublishedOn(millisToDatetimeLocal(blog.publishedOnMillis));
    setPhoto(null);
  }, [blog]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    const ttl = title.trim();
    const desc = description.trim();
    const pub = publisherName.trim();
    const cat = category.trim();
    if (!ttl || !desc || !pub) {
      toast.error("Title, author name, and description are required.");
      return;
    }
    updateMutation.mutate(
      {
        blogId: id,
        blogData: {
          title: ttl,
          description: desc,
          publisherName: pub,
          category: cat || undefined,
          publishedOnMillis: parseDateInputToMillis(publishedOn),
        },
        photo,
      },
      {
        onSuccess: () => {
          toast.success("Blog updated.");
          navigate(`/admissions/blogs/${id}`);
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Could not update blog.");
        },
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!id) return;
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

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(0deg, rgba(198, 221, 240, 0.25), rgba(198, 221, 240, 0.25))",
      }}
    >
      <div className="w-full border-b border-[#E3E8F4] bg-white">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[60px] pt-3 pb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.875rem] text-(--text-muted) font-medium">
            <button
              type="button"
              onClick={() => navigate("/admissions/blogs")}
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
            <span className="text-(--text-main)">Edit</span>
          </p>
          <button
            type="button"
            onClick={() => (id ? navigate(`/admissions/blogs/${id}`) : navigate("/admissions/blogs"))}
            className="text-[0.875rem] font-medium text-[#0E1629] underline cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="max-w-[720px] mx-auto px-5 md:px-[60px] py-8">
        <h1 className="text-[1.5rem] sm:text-[2rem] font-semibold text-[#0E1629] mb-6">
          Edit blog
        </h1>

        {isLoading && (
          <p className="text-(--text-muted) text-[0.875rem] mb-4">Loading…</p>
        )}
        {isError && (
          <div className="space-y-3 mb-6">
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
          <p className="text-(--text-muted) text-[0.875rem]">This blog could not be found.</p>
        )}

        {blog && (
          <form
            onSubmit={handleSave}
            className="rounded-[16px] bg-white border border-[#E3E8F4] p-5 sm:p-8 space-y-5 shadow-sm"
          >
            <div>
              <label htmlFor="edit-blog-category" className="block text-[0.875rem] font-medium text-[#0E1629] mb-1.5">
                Category
              </label>
              <input
                id="edit-blog-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-[rgba(14,22,41,0.2)] px-3 py-2 text-[0.875rem] text-[#0E1629] outline-none focus:border-[#0E1629]"
              />
            </div>
            <div>
              <label htmlFor="edit-blog-title" className="block text-[0.875rem] font-medium text-[#0E1629] mb-1.5">
                Title
              </label>
              <input
                id="edit-blog-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-[rgba(14,22,41,0.2)] px-3 py-2 text-[0.875rem] text-[#0E1629] outline-none focus:border-[#0E1629]"
              />
            </div>
            <div>
              <label htmlFor="edit-blog-author" className="block text-[0.875rem] font-medium text-[#0E1629] mb-1.5">
                Author name
              </label>
              <input
                id="edit-blog-author"
                value={publisherName}
                onChange={(e) => setPublisherName(e.target.value)}
                className="w-full rounded-lg border border-[rgba(14,22,41,0.2)] px-3 py-2 text-[0.875rem] text-[#0E1629] outline-none focus:border-[#0E1629]"
              />
            </div>
            <div>
              <label htmlFor="edit-blog-published" className="block text-[0.875rem] font-medium text-[#0E1629] mb-1.5">
                Publish date
              </label>
              <input
                id="edit-blog-published"
                type="datetime-local"
                value={publishedOn}
                onChange={(e) => setPublishedOn(e.target.value)}
                className="w-full rounded-lg border border-[rgba(14,22,41,0.2)] px-3 py-2 text-[0.875rem] text-[#0E1629] outline-none focus:border-[#0E1629]"
              />
            </div>
            <div>
              <label htmlFor="edit-blog-desc" className="block text-[0.875rem] font-medium text-[#0E1629] mb-1.5">
                Description / body
              </label>
              <textarea
                id="edit-blog-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={10}
                className="w-full rounded-lg border border-[rgba(14,22,41,0.2)] px-3 py-2 text-[0.875rem] text-[#0E1629] outline-none focus:border-[#0E1629] resize-y min-h-[160px]"
              />
            </div>
            <div>
              <label htmlFor="edit-blog-photo" className="block text-[0.875rem] font-medium text-[#0E1629] mb-1.5">
                Replace cover image (optional)
              </label>
              <input
                id="edit-blog-photo"
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                className="w-full text-[0.875rem] text-[#0E1629]"
              />
            </div>

            <div className="pt-2 flex flex-wrap gap-3 justify-between items-center">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={updateMutation.isPending || deleteMutation.isPending}
                className="text-[0.875rem] font-medium text-red-600 hover:text-red-700 underline cursor-pointer disabled:opacity-50"
              >
                Delete blog
              </button>
              <div className="flex flex-wrap gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => navigate(`/admissions/blogs/${id}`)}
                  disabled={updateMutation.isPending}
                  className="px-4 py-2.5 rounded-lg border border-[rgba(14,22,41,0.2)] text-[0.875rem] font-medium text-[#0E1629] hover:bg-[#F3F7FF] cursor-pointer disabled:opacity-50"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0E1629] text-white text-[0.875rem] font-medium hover:opacity-95 cursor-pointer disabled:opacity-60"
                >
                  {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {updateMutation.isPending ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </form>
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
