import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SeeAllButton } from "../components/LeftRightButton";
import BlogCard from "./BlogCard";
import BlogsPageCard from "./BlogsPageCard";
import { useBlogsList } from "@/hooks/useBlogs";

type BlogsVariant = "section" | "full";

interface BlogsProps {
  variant?: BlogsVariant;
}

export default function Blogs({ variant = "section" }: BlogsProps) {
  const navigate = useNavigate();
  const { data: blogItems = [], isLoading, isError, error, refetch } =
    useBlogsList();

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(blogItems.map((b) => b.category).filter(Boolean))
    ).sort();
    return ["All", ...unique];
  }, [blogItems]);

  const [activeCategory, setActiveCategory] = useState("All");
  const safeCategory =
    categories.includes(activeCategory) ? activeCategory : "All";

  const filteredBlogs = useMemo(() => {
    const list = blogItems;
    if (safeCategory === "All") return list;
    return list.filter((b) => b.category === safeCategory);
  }, [blogItems, safeCategory]);

  const sectionBlogs = useMemo(() => blogItems.slice(0, 2), [blogItems]);

  if (variant === "full") {
    return (
      <div className="bg-[#F3F7FF] w-full">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[60px] py-6 sm:py-10">
          <div className="flex gap-3 sm:gap-6 md:gap-[40px] justify-start sm:justify-evenly mb-6 sm:mb-8 overflow-x-auto pb-1">
            {categories.map((category) => {
              const isActive = safeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-[5px] min-w-[160px] text-[0.875rem] font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#0E1629] text-white"
                      : "bg-white text-(--text-main) border border-[rgba(14,22,41,0.25)] hover:border-[#0E1629]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {isLoading && (
            <p className="text-center text-(--text-muted) py-12 text-[0.875rem]">
              Loading blogs…
            </p>
          )}
          {isError && (
            <div className="text-center py-12 space-y-3">
              <p className="text-red-600 text-[0.875rem]">
                {(error as Error)?.message ?? "Could not load blogs."}
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
          {!isLoading && !isError && filteredBlogs.length === 0 && (
            <p className="text-center text-(--text-muted) py-12 text-[0.875rem]">
              No blogs in this category yet.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {!isLoading &&
              !isError &&
              filteredBlogs.map((blog) => (
                <BlogsPageCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  author={blog.author}
                  publishedOn={blog.publishedOn}
                  tag={blog.tag}
                  imageUrl={blog.imageUrl}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#C6DDF040] w-full h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-[1440px] mx-auto px-4 md:px-[60px] py-6 md:py-10 gap-y-6 md:gap-y-8">
        <div>
          <div className="flex items-center justify-start gap-[8px] md:gap-2 bg-white px-[12px] md:px-3 py-[4px] md:py-1 rounded-[4px] md:rounded-[6px] w-[125px] md:w-fit shrink-0">
            <div className="w-[16px] h-[16px] min-w-[16px] min-h-[16px] md:w-4 md:h-4 bg-[#0E1629] shrink-0" />
            <p className="font-[Poppins] font-semibold text-[12px] md:text-[0.875rem] text-[#0E1629] md:text-(--text-main) uppercase md:capitalize tracking-[0.07em] md:tracking-normal leading-none md:leading-normal">
              BLOGS
            </p>
          </div>

          <h2 className="mt-3 md:mt-5 max-w-[350px] md:max-w-[554px] font-[Poppins] font-medium text-[12px] md:text-[1.25rem] text-[#0E1629] md:text-(--text-muted) leading-[1.4] md:leading-normal">
            Lorem ipsum dolor sit amet consectetur. Senectus arcu cras at risus
            a tortor ut quam in.
          </h2>
        </div>

        <div className="flex flex-col gap-6 md:gap-10.5">
          <div className="flex gap-[12px] md:gap-9 overflow-x-auto md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2 md:pb-0">
            
            {/* API States (From Current) */}
            {isLoading && (
              <p className="text-(--text-muted) text-[0.875rem] w-full">
                Loading blogs…
              </p>
            )}
            
            {isError && (
              <p className="text-red-600 text-[0.875rem] w-full">
                {(error as Error)?.message ?? "Could not load blogs."}
              </p>
            )}

            {/* Dynamic Map (From Current) + Layout Wrapper (From Incoming) */}
            {!isLoading &&
              !isError &&
              sectionBlogs.map((blog) => (
                <div key={blog.id} className="shrink-0">
                  <BlogCard
                    id={blog.id}
                    title={blog.title}
                    author={blog.author}
                    readTime={blog.readTime}
                    imageUrl={blog.imageUrl}
                  />
                </div>
              ))}

            {/* Empty State (From Current) */}
            {!isLoading && !isError && sectionBlogs.length === 0 && (
              <p className="text-(--text-muted) text-[0.875rem]">
                No blogs yet.
              </p>
            )}
          </div>

          {/* See All Button Section */}
          <div className="flex items-center justify-end mt-2 md:mt-0 w-full">
            <div className="scale-[0.85] md:scale-100 origin-center md:origin-right">
              <SeeAllButton onClick={() => navigate("/admissions/blogs")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}