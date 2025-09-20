import { Link } from "react-router-dom";

export type ExamCardData = {
  id: string;
  name: string;
  imageUrl: string;
  level: string;
  description: string;
};

type ExamCardProps = {
  exam: ExamCardData;
};

export function ExamCard({ exam }: ExamCardProps) {
  return (
    <Link to={`/exams/${exam.id}`} className="flex h-full">
    <div className="flex w-full max-w-sm flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className="relative">
        <img
          src={exam.imageUrl}
          alt={`Image for ${exam.name}`}
          className="h-50 w-full object-contain"
        />
        <span className="absolute right-3 top-3 rounded-md bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {exam.level}
        </span>
      </div>

      <div className="flex flex-grow flex-col p-4">
        <h3 className="text-lg font-bold text-[#343C6A]">{exam.name}</h3>
        <p className="mb-2 text-sm text-[#343C6A]">{exam.description}</p>

        <div className="mt-auto border-t border-gray-100 pt-3 text-center">
          <a
            href="#"
            className="text-sm font-semibold underline text-[#718EBF] hover:text-blue-800"
          >
            View Exam
          </a>
        </div>
      </div>
    </div>
    </Link>
  );
}