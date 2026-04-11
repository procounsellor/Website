import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useCreateBlogMutation } from "@/hooks/useBlogs";
import { useAuthStore } from "@/store/AuthStore";

function startOfTodayMillis(): number {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d.getTime();
}

function parseDateInputToMillis(value: string): number {
  if (!value) return startOfTodayMillis();
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? startOfTodayMillis() : t;
}

export default function BlogCreatePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const defaultAuthor = useMemo(() => {
    if (!user) return "";
    const parts = [user.firstName, user.lastName].filter(Boolean);
    return parts.join(" ").trim();
  }, [user]);

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [publisherName, setPublisherName] = useState("");

  useEffect(() => {
    if (defaultAuthor) {
      setPublisherName((prev) => (prev.trim() === "" ? defaultAuthor : prev));
    }
  }, [defaultAuthor]);
  const [description, setDescription] = useState("");
  const [publishedOn, setPublishedOn] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [photo, setPhoto] = useState<File | null>(null);

  const createMutation = useCreateBlogMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = category.trim();
    const ttl = title.trim();
    const pub = publisherName.trim();
    const desc = description.trim();
    if (!cat || !ttl || !pub || !desc) {
      toast.error("Please fill in category, title, author name, and description.");
      return;
    }
    createMutation.mutate(
      {
        blogData: {
          category: cat,
          title: ttl,
          publisherName: pub,
          description: desc,
          publishedOnMillis: parseDateInputToMillis(publishedOn),
        },
        photo,
      },
      {
        onSuccess: (data) => {
          toast.success("Blog published.");
          const rawId = data.id;
          const nextId = rawId != null && String(rawId).length ? String(rawId) : null;
          navigate(nextId ? `/admissions/blogs/${nextId}` : "/admissions/blogs");
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Could not create blog.");
        },
      }
    );
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
            <span className="text-(--text-main)">New blog</span>
          </p>
          <button
            type="button"
            onClick={() => navigate("/admissions/blogs")}
            className="text-[0.875rem] font-medium text-[#0E1629] underline cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="max-w-[720px] mx-auto px-5 md:px-[60px] py-8">
        <h1 className="text-[1.5rem] sm:text-[2rem] font-semibold text-[#0E1629] mb-6">
          Create blog
        </h1>

        <form
          onSubmit={handleSubmit}
          className="rounded-[16px] bg-white border border-[#E3E8F4] p-5 sm:p-8 space-y-5 shadow-sm"
        >
          <div>
            <label htmlFor="blog-category" className="block text-[0.875rem] font-medium text-[#0E1629] mb-1.5">
              Category
            </label>
            <input
              id="blog-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-[rgba(14,22,41,0.2)] px-3 py-2 text-[0.875rem] text-[#0E1629] outline-none focus:border-[#0E1629]"
              placeholder="e.g. Admissions"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="blog-title" className="block text-[0.875rem] font-medium text-[#0E1629] mb-1.5">
              Title
            </label>
            <input
              id="blog-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-[rgba(14,22,41,0.2)] px-3 py-2 text-[0.875rem] text-[#0E1629] outline-none focus:border-[#0E1629]"
              placeholder="Article title"
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="blog-author" className="block text-[0.875rem] font-medium text-[#0E1629] mb-1.5">
              Author name
            </label>
            <input
              id="blog-author"
              value={publisherName}
              onChange={(e) => setPublisherName(e.target.value)}
              className="w-full rounded-lg border border-[rgba(14,22,41,0.2)] px-3 py-2 text-[0.875rem] text-[#0E1629] outline-none focus:border-[#0E1629]"
              placeholder="Displayed as author"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="blog-published" className="block text-[0.875rem] font-medium text-[#0E1629] mb-1.5">
              Publish date
            </label>
            <input
              id="blog-published"
              type="datetime-local"
              value={publishedOn}
              onChange={(e) => setPublishedOn(e.target.value)}
              className="w-full rounded-lg border border-[rgba(14,22,41,0.2)] px-3 py-2 text-[0.875rem] text-[#0E1629] outline-none focus:border-[#0E1629]"
            />
          </div>
          <div>
            <label htmlFor="blog-desc" className="block text-[0.875rem] font-medium text-[#0E1629] mb-1.5">
              Description / body
            </label>
            <textarea
              id="blog-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              className="w-full rounded-lg border border-[rgba(14,22,41,0.2)] px-3 py-2 text-[0.875rem] text-[#0E1629] outline-none focus:border-[#0E1629] resize-y min-h-[160px]"
              placeholder="Article content. Use blank lines between paragraphs."
            />
          </div>
          <div>
            <label htmlFor="blog-photo" className="block text-[0.875rem] font-medium text-[#0E1629] mb-1.5">
              Cover image (optional)
            </label>
            <input
              id="blog-photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              className="w-full text-[0.875rem] text-[#0E1629]"
            />
          </div>

          <div className="pt-2 flex flex-wrap gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate("/admissions/blogs")}
              disabled={createMutation.isPending}
              className="px-4 py-2.5 rounded-lg border border-[rgba(14,22,41,0.2)] text-[0.875rem] font-medium text-[#0E1629] hover:bg-[#F3F7FF] cursor-pointer disabled:opacity-50"
            >
              Back to blogs
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0E1629] text-white text-[0.875rem] font-medium hover:opacity-95 cursor-pointer disabled:opacity-60"
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {createMutation.isPending ? "Publishing…" : "Publish blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
