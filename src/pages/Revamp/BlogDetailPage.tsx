import { useNavigate } from "react-router-dom";

const MOCK_BLOG = {
  title:
    "Product Management Masterclass, You Will Learn With Head Of Product Customer Platform",
  author: "Sarah Johnson",
  publishedOn: "14 Mar 2026",
  imageUrl: "/blogCard.jpg",
};

export default function BlogDetailPage() {
  const navigate = useNavigate();
  // const { id } = useParams<{ id: string }>();

  const blog = MOCK_BLOG;

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(0deg, rgba(198, 221, 240, 0.25), rgba(198, 221, 240, 0.25))",
      }}
    >
      {/* Breadcrumb */}
      <div className="w-full border-b border-[#E3E8F4] bg-white">
        <div className="max-w-[1440px] mx-auto px-[60px] pt-3 pb-3 text-[0.875rem] text-(--text-muted) font-medium">
          <button
            onClick={() => navigate("/admissions")}
            className="hover:underline"
          >
            Admission
          </button>
          <span className="mx-1">{">"}</span>
          <button
            onClick={() => navigate("/admissions/blogs")}
            className="hover:underline"
          >
            Blogs
          </button>
          <span className="mx-1">{">"}</span>
          <span className="text-(--text-main)">Name of the blog...</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-[60px] py-8">
        {/* Title & meta */}
        <h1 className="text-[40px] font-semibold text-[#0E1629] leading-snug">
          {blog.title}
        </h1>
        <p className="mt-4 text-[22px] text-[#0E1629] font-medium">
          By: {blog.author}
        </p>
        <p className="mt-1 text-[18px] font-medium text-(--text-muted)">
          Published On: {blog.publishedOn}
        </p>

        {/* Hero image */}
        <div className="mt-6 rounded-[16px] overflow-hidden bg-white">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-[413px] object-cover"
          />
        </div>
        <p className="mt-4 text-[18px] font-medium text-[#6B7280]">
          Lorem ipsum dolor sit amet consectetur. Vitae rhoncus viverra aenean
          rhoncus in quis aliquet orci enim elementum ipsum dolor sit amet
          consectetur.
        </p>

        {/* Content */}
        <div className="mt-6 space-y-6 text-[18px] font-medium leading-relaxed text-[#6B7280]">
          <p className="font-semibold text-[28px] text-[#0E1629]">
            Lorem Ipsum Dolor Sit Amet Consectetur. Turpis Elementum Dictum Nunc
            Nec Accumsan.
          </p>
          <p className="font-medium">
            Lorem ipsum dolor sit amet consectetur. Vitae rhoncus viverra
            aenean rhoncus in quis aliquet orci. Enim elementum ipsum dolor sit
            amet consectetur. Vitae rhoncus viverra aenean rhoncus in quis
            aliquet orci enim elementum ipsum dolor sit amet consectetur.
          </p>
          <p className="font-semibold text-[28px] text-[#0E1629]">
            Lorem Ipsum Dolor Sit Amet Consectetur. Turpis Elementum Dictum Nunc
            Nec Accumsan.
          </p>
          <p className="font-medium">
            Lorem ipsum dolor sit amet consectetur. Vitae rhoncus viverra
            aenean rhoncus in quis aliquet orci. Enim elementum ipsum dolor sit
            amet consectetur. Vitae rhoncus viverra aenean rhoncus in quis
            aliquet orci enim elementum ipsum dolor sit amet consectetur.
          </p>
          <p className="font-medium">
            Lorem ipsum dolor sit amet consectetur. Vitae rhoncus viverra
            aenean rhoncus in quis aliquet orci. Enim elementum ipsum dolor sit
            amet consectetur. Vitae rhoncus viverra aenean rhoncus in quis
            aliquet orci enim elementum ipsum dolor sit amet consectetur.
          </p>
          <p className="font-semibold text-[28px] text-[#0E1629]">
            Lorem Ipsum Dolor Sit Amet Consectetur. Turpis Elementum Dictum Nunc
            Nec Accumsan.
          </p>
          <p className="font-medium">
            Lorem ipsum dolor sit amet consectetur. Vitae rhoncus viverra
            aenean rhoncus in quis aliquet orci. Enim elementum ipsum dolor sit
            amet consectetur. Vitae rhoncus viverra aenean rhoncus in quis
            aliquet orci enim elementum ipsum dolor sit amet consectetur.
          </p>
        </div>
      </div>
    </div>
  );
}

