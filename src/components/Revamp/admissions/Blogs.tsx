import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SeeAllButton } from "../components/LeftRightButton";
import BlogCard from "./BlogCard";
import BlogsPageCard from "./BlogsPageCard";

type BlogsVariant = "section" | "full";

interface BlogsProps {
  variant?: BlogsVariant;
}

const baseBlog = {
  title:
    "Product Management Masterclass, you will learn with head of product Customer Plateform",
  author: "Sarah Jhonson",
  readTime: "10 mins read",
  tag: "Design",
  publishedOn: "Published on: 26 Feb 26",
  imageUrl: "/blogCard.jpg",
};

export default function Blogs({ variant = "section" }: BlogsProps) {
  const navigate = useNavigate();

  const categories = ["All", "Lorem", "Lorem ipsum", "Dolor", "Sit amet"];
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);

  const blogs = useMemo(
    () =>
      Array.from({ length: variant === "full" ? 8 : 2 }).map((_, index) => ({
        ...baseBlog,
        id: index,
      })),
    [variant]
  );

  if (variant === "full") {
    return (
      <div className="bg-[#F3F7FF] w-full">
        <div className="max-w-[1440px] mx-auto px-[60px] py-10">
          <div className="flex gap-[40px] justify-evenly mb-8 overflow-x-auto">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-[5px] min-w-[160px] text-[0.875rem] font-medium whitespace-nowrap transition-all duration-300 ${
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {blogs.map((blog) => (
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
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-[1440px] mx-auto px-[60px] py-10 gap-y-8">
        <div>
          <div className="w-fit flex items-center justify-center rounded-[6px] gap-2 bg-white py-1 px-3">
            <div className="bg-[#0E1629] h-4 w-4" />

            <p className="text-(--text-main) font-semibold text-[0.875rem]">
              Blogs
            </p>
          </div>

          <h2 className="mt-5 max-w-[554px] text-(--text-muted) font-medium text-[1.25rem]">
            Lorem ipsum dolor sit amet consectetur. Senectus arcu cras at risus
            a tortor ut quam in.
          </h2>
        </div>

        <div className="flex flex-col gap-10.5">
          <div className="flex flex-wrap gap-9">
            {blogs.slice(0, 2).map((blog) => (
              <BlogCard
                key={blog.id}
                title={blog.title}
                author={blog.author}
                readTime={blog.readTime}
                imageUrl={blog.imageUrl}
              />
            ))}
          </div>

          <div className="flex items-center justify-end">
            <SeeAllButton onClick={() => navigate("/admissions/blogs")} />
          </div>
        </div>
      </div>
    </div>
  );
}

