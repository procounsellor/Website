import { useExams } from '@/hooks/useExams';
import { Link } from 'react-router-dom';

function SimilarExamItem({ id, name, imageUrl }: { id: string, name: string, imageUrl: string }) {
    return (
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 bg-[#F5F5F5] p-3 border border-[#EFEFEF] rounded-xl">
            <div className="relative flex-shrink-0">
                <img src={imageUrl} alt={name} className="w-24 h-24 object-contain rounded-xl bg-white p-1" />
                <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">UG</span>
            </div>
            <div className="flex flex-col justify-center min-w-0">
                <h4 className="font-medium text-xl text-[#343C6A] leading-tight mb-2">{name}</h4>
                <Link to={`/exams/${id}`} className="font-medium text-lg text-[#718EBF] underline">View Exam</Link>
            </div>
        </div>
    );
}

export function SimilarExamsCard() {
    const { exams, loading } = useExams(2); 

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-[#343C6A]">Similar Exams</h3>
            <div className="mt-4 space-y-4">
                {loading ? <p>Loading...</p> : exams?.map(exam => (
                    <SimilarExamItem key={exam.id} id={exam.id} name={exam.name} imageUrl={exam.iconUrl} />
                ))}
            </div>
        </div>
    );
}