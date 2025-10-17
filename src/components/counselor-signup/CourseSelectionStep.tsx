import { useState, useEffect } from 'react';
import { getCoursesOnborading } from '@/api/auth';
import type { CousrseApiLogin } from '@/types';
import { Loader2, Search, Check } from 'lucide-react';

interface CourseSelectionStepProps {
  selectedCourses: string[];
  onCourseSelect: (courseName: string) => void;
}

export default function CourseSelectionStep({ selectedCourses, onCourseSelect }: CourseSelectionStepProps) {
  const [courses, setCourses] = useState<CousrseApiLogin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseData = await getCoursesOnborading();
        setCourses(courseData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center p-10"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="font-montserrat">
        <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
                type="text"
                placeholder="Search Courses"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
                const isSelected = selectedCourses.includes(course.name);
                return (
                    <button
                        key={course.courseId}
                        onClick={() => onCourseSelect(course.name)}
                        className={`relative text-center p-5 border-2 rounded-xl transition-all duration-200 ${
                            isSelected ? 'bg-[#13097D] border-[#13097D] text-white' : 'bg-white border-gray-200 hover:shadow-lg hover:border-blue-600'
                        }`}
                    >
                        <div className={`absolute top-3 right-3 w-5 h-5 flex items-center justify-center rounded border-2 ${isSelected ? 'bg-white border-white' : 'border-gray-300'}`}>
                            {isSelected && <Check size={16} className="text-[#13097D]" />}
                        </div>
                        <img src={`/courseIcon/${course.image}`} alt={`${course.name} icon`} className="h-16 w-16 object-contain mx-auto mb-3" />
                        <h3 className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>{course.name}</h3>
                        <p className={`text-sm mt-1 ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>
                            {course.duration} &bull; {course.tagline}
                        </p>
                    </button>
                );
            })}
        </div>
    </div>
  );
}