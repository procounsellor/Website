import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useExamById } from '@/hooks/useExams';
import { useCourses } from '@/hooks/useCourses';

import { ExamHeroCard } from '@/components/exam-details/ExamHeroCard';
import { ExamInfoTabs } from '@/components/exam-details/ExamInfoTabs';
import { SimilarExamsCard } from '@/components/exam-details/SimilarExamsCard';
import { FeaturedCollegesCard } from '@/components/shared/FeaturedCollegesCard';
import { ExamDetailGridCard } from '@/components/exam-details/ExamDetailGridCard';
import { ExamStatsCard } from '@/components/exam-details/ExamStatsCard';
import { InfoCard } from '@/components/exam-details/InfoCard';
import { Globe } from 'lucide-react';
import { FaqItem } from '@/components/exam-details/FaqItem';

export default function ExamDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { exam, loading, error } = useExamById(id || '');
  const [activeTab, setActiveTab] = useState('Info');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const { courses, loading: coursesLoading, error: coursesError } = useCourses(4);

  const handleFaqToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading Exam...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
  if (!exam) return null;

  return (
    <div className="bg-gray-50 pt-28 pb-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{exam.examName}</h1>
          <p className="text-gray-500">Discover their expertise and find the right guidance for your future</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <ExamHeroCard name={exam.examName} level={exam.examLevel} bannerUrl={exam.bannerUrl} />
            
            <div>
              <ExamInfoTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="py-6">
                {activeTab === 'Info' && (
                  <div className="flex flex-col gap-6">

                    <ExamStatsCard examData={exam} />

                    <InfoCard title="Conducting Body">
                      <p className="text-[#718EBF] font-medium">{exam.conductingBody || 'National Testing Agency (NTA)'}</p>
                    </InfoCard>

                    <InfoCard title="Exam Type">
                      <p className="text-[#718EBF] font-medium">{exam.examType || 'Computer Based Test'}</p>
                    </InfoCard>
                    
                    <InfoCard title="Exam Mode">
                      <div className="flex flex-wrap gap-2">
                        {(exam.examMode || ['Online', 'Computer Based']).map((mode: string) => (
                          <span key={mode} className="px-3 py-1 text-sm font-medium bg-slate-100 rounded-full">{mode}</span>
                        ))}
                      </div>
                    </InfoCard>

                    <InfoCard title="Application Fees">
                      <div className="flex gap-8">
                        <div>
                          <p className="text-[#232323]">General</p>
                          <p className="font-semibold text-[#718EBF]">₹{exam.applicationFees?.general || "NA"}</p>
                        </div>
                        <div>
                          <p className='text-[#232323]'>OBC</p>
                          <p className='font-semibold text-[#718ebf]'>₹{exam.applicationFees?.obc || "NA"}</p>
                        </div>
                        <div>
                          <p className="text-[#232323]">SC/ST</p>
                          <p className="font-semibold text-[#718EBF]">₹{exam.applicationFees?.sc_st || "NA"}</p>
                        </div>
                      </div>
                    </InfoCard>

                    <InfoCard title="Eligibility Criteria">
                      <p className="text-[#718EBF] font-medium">{exam.eligibility}</p>
                    </InfoCard>

                    <InfoCard title="Subjects & Marking Scheme">
                       <p className="text-gray-600">Details about subjects and marking scheme.</p>
                    </InfoCard>
                    
                    <InfoCard title="Contact">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100/50 rounded-full flex-shrink-0">
                        <Globe className="w-7 h-7 text-[#13097D]"/>
                        </div>
                        <div>
                          <p className="text-xs text-[#9D9FA1]">Website</p>
                          <a href="#" className="text-[#2F3032] hover:underline">{exam.officialWebsite || 'NA'}</a>
                        </div>
                      </div>
                    </InfoCard>

                  </div>
                )}
                {activeTab === 'Courses' && (
                  <div className="grid grid-cols-2 gap-3 lg:gap-6">
                    {coursesLoading && <p>Loading courses...</p>}
                    {coursesError && <p className="text-red-500">{coursesError}</p>}
                    {courses?.map((course) => (
                       <ExamDetailGridCard
                        key={course.id}
                        variant='compact'
                        imageSrc={course.photoUrl}
                        imageAlt={course.name}
                        title={course.name}
                        ctaLabel="View Course"
                        badge={course.level}
                      />
                    ))}
                  </div>
                )}
                {activeTab === 'FAQs' && (
                  <div>
                    {exam.faqs && exam.faqs.length > 0 ? (
                      exam.faqs.map((faq: { question: string; answer: string }, index: number) => (
                        <FaqItem
                          key={index}
                          question={faq.question}
                          answer={faq.answer}
                          isOpen={openFaqIndex === index}
                          onToggle={() => handleFaqToggle(index)}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center">No FAQs available for this exam.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:col-span-1 lg:flex flex-col gap-8">
            <SimilarExamsCard />
            <FeaturedCollegesCard />
          </div>
        </div>
      </main>
    </div>
  );
}