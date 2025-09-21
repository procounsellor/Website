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
    <Link to={`/exams/${exam.id}`} className="flex lg:h-full">
    <div className="flex w-full max-w-sm p-3 lg:p-0 flex-col overflow-hidden rounded-[12px] lg:rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className="relative">
        <img
          src={exam.imageUrl}
          alt={`Image for ${exam.name}`}
          className="rounded-[12px] h-[87px] lg:h-50 w-full object-cover lg:object-contain"
        />
        <span className="absolute right-3 top-3 rounded-md bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {exam.level}
        </span>
      </div>

      <div className="flex flex-grow items-center gap-0.5 flex-col pt-4 lg:p-4">
        <h3 className=" text-xs lg:text-lg font-medium lg:font-bold text-[#343C6A]">{exam.name}</h3>
        <p className="mb-2 text-sm text-[#343C6A] text-center">{exam.description}</p>

      </div>
    </div>
    </Link>
  );
}