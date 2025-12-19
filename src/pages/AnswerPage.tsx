import QuestionFilterBar from "@/components/community/QuestionFilterBar";
import QuestionList from "@/components/community/QuestionList";
import CategorySidebar from "@/components/community/CategorySidebar";
import RightSideAds from "@/components/community/RightSideAds";

export default function AnswerPage() {
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-[1440px] mx-auto flex justify-center gap-3">
        
        <div className="hidden lg:block w-[191px] shrink-0">
          <CategorySidebar />
        </div>

        <div className="flex flex-col mt-6 w-[800px] shrink-0">
          <div className="w-full">
            <QuestionFilterBar />
          </div>

          <div className="mt-4 w-full">
            <QuestionList />
          </div>
        </div>

        <div className="hidden xl:block w-[250px] shrink-0">
          <RightSideAds />
        </div>

      </div>
    </div>
  );
}