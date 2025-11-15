import QuestionFilterBar from "@/components/community/QuestionFilterBar";
import QuestionList from "@/components/community/QuestionList";

export default function AnswerPage() {
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="mt-4 w-full max-w-[900px]">
          <QuestionFilterBar />
        </div>

        <div className="mt-4 w-full max-w-[900px]">
            <QuestionList />
        </div>

      </div>
    </div>
  );
}