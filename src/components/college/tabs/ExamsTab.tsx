import ExamCard from './ExamCard';
import type { CourseOffered } from '@/types/academic';

interface ExamsTabProps {
  courses?: CourseOffered[];
  fallbackImage?: string;
}

// Entrance exams this college actually accepts, derived from the exams attached
// to each offered course. Previously a hard-coded JEE/GATE/CEED/JAM list.
const ExamsTab = ({ courses = [], fallbackImage }: ExamsTabProps) => {
  const byExam = new Map<string, { title: string; tag: string }>();

  for (const course of courses) {
    for (const exam of course?.examsAccepted || []) {
      const title = exam?.examName?.trim();
      if (!title) continue;
      const key = exam.examId?.trim() || title.toLowerCase();
      if (!byExam.has(key)) {
        byExam.set(key, {
          title,
          tag: String(course.courseLevel).toUpperCase() === 'PG' ? 'PG Entrance' : 'UG Entrance',
        });
      }
    }
  }

  const items = Array.from(byExam.values());

  if (items.length === 0) {
    return (
      <div className="p-4 min-h-[200px] rounded-lg flex items-center justify-center text-center text-[#718EBF] font-medium">
        Accepted entrance exams for this college have not been published yet.
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-[23px] md:justify-center">
      {items.map((exam) => (
        <ExamCard
          key={exam.title}
          title={exam.title}
          tag={exam.tag}
          image={fallbackImage || '/course/3.webp'}
          onViewDetails={() => {}}
        />
      ))}
    </div>
  );
};

export default ExamsTab;
