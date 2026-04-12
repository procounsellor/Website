import Blogs from "@/components/Revamp/admissions/Blogs";

export default function BlogsPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(0deg, rgba(198, 221, 240, 0.25), rgba(198, 221, 240, 0.25))",
      }}
    >
      <div className="w-full border-b border-[#E3E8F4] bg-white">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[60px] pt-3 pb-3">
          <p className="text-[0.875rem] text-(--text-muted) font-medium">
            Admission <span className="mx-1">{">"}</span>{" "}
            <span className="text-(--text-main)">Blogs</span>
          </p>
        </div>
      </div>

      <Blogs variant="full" />
    </div>
  );
}
