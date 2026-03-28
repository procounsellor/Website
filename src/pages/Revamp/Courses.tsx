import Banner from "@/components/Revamp/courses/Banner";

export default function Courses() {
  return (
    <div className="min-h-screen relative pb-24">
        <Banner />
        <div className="fixed bottom-4 left-0 right-0 z-40 px-2 md:hidden">
          <div className="mx-auto flex max-w-[420px] items-end justify-between">
            <img
              src="/course-bottom-bar.svg"
              alt="Course bottom navigation"
              className="h-auto max-w-[280px]"
            />
            <img
              src="/course-bottom-right.svg"
              alt="Course bottom action"
              className="h-16 w-16"
            />
          </div>
        </div>

        <div className="fixed bottom-4 left-0 right-0 z-40 hidden h-16 md:block">
          <img
            src="/course-bottom-bar.svg"
            alt="Course bottom navigation"
            className="absolute bottom-0 left-1/2 h-auto max-w-[280px] -translate-x-1/2"
          />
          <img
            src="/course-bottom-right.svg"
            alt="Course bottom action"
            className="absolute bottom-0 right-6 h-16 w-16"
          />
        </div>
    </div>
  );
}
