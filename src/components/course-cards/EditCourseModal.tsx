import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Step1Card from "./Step1Card";
import Step2Card from "./Step2Card";
import { updateCourseData, type UpdateCourseData } from '@/api/course';
import toast from 'react-hot-toast';
import type { CourseDetails } from '@/api/course';

type Step1Data = {
  courseName: string;
  description: string;
  thumbnail: File | null;
  category: string;
  courseTimeHours: string;
  courseTimeMinutes: string;
};

type Step2Data = {
  courseDurationType: string;
  coursePrice: string;
  discount: string;
  coursePriceAfterDiscount: number;
};

type EditCourseModalProps = {
  courseDetails: CourseDetails;
  counsellorId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditCourseModal({ 
  courseDetails, 
  counsellorId, 
  onClose, 
  onSuccess 
}: EditCourseModalProps) {
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  const [step1Data, setStep1Data] = useState<Step1Data>({
    courseName: courseDetails.courseName || '',
    description: courseDetails.description || '',
    thumbnail: null, // Will keep null unless user uploads new one
    category: courseDetails.category || '',
    courseTimeHours: String(courseDetails.courseTimeHours || ''),
    courseTimeMinutes: String(courseDetails.courseTimeMinutes || ''),
  });

  const [step2Data, setStep2Data] = useState<Step2Data>({
    courseDurationType: courseDetails.courseDurationType || '',
    coursePrice: String(courseDetails.coursePrice || ''),
    discount: String(courseDetails.discount || ''),
    coursePriceAfterDiscount: courseDetails.coursePriceAfterDiscount || 0,
  });

  const validateStep1 = (): boolean => {
    if (!step1Data.courseName.trim()) {
      toast.error('Please enter course name');
      return false;
    }
    if (!step1Data.description.trim()) {
      toast.error('Please enter description');
      return false;
    }
    if (!step1Data.courseTimeHours || !step1Data.courseTimeMinutes) {
      toast.error('Please enter course duration');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!step2Data.courseDurationType.trim()) {
      toast.error('Please enter course duration type');
      return false;
    }
    if (!step2Data.coursePrice) {
      toast.error('Please enter course price');
      return false;
    }
    return true;
  };

  const handleUpdateCourse = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Updating course...');

    try {
      const updateData: UpdateCourseData = {
        courseName: step1Data.courseName,
        description: step1Data.description,
        coursePrice: parseFloat(step2Data.coursePrice),
        discount: parseFloat(step2Data.discount) || 0,
        coursePriceAfterDiscount: step2Data.coursePriceAfterDiscount,
      };

      await updateCourseData(
        counsellorId,
        courseDetails.courseId,
        updateData,
        step1Data.thumbnail
      );

      toast.success('Course updated successfully!', { id: toastId });
      onSuccess(); // Refresh course details
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update course',
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currentCard = () => {
    switch (step) {
      case 1:
        return <Step1Card data={step1Data} onChange={setStep1Data} />;
      case 2:
        return <Step2Card data={step2Data} onChange={setStep2Data} />;
      default:
        return <Step1Card data={step1Data} onChange={setStep1Data} />;
    }
  };

  return (
    <div className="fixed inset-0 z-70 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 md:p-4">
      <div
        className="flex items-center flex-col gap-4 md:gap-8 w-full max-w-250 max-h-[95vh] md:max-h-fit bg-[#F5F7FA] rounded-2xl shadow-xl p-4 md:p-6 relative overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-gray-700 hover:cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        <h1 className="text-[#343C6A] text-lg md:text-2xl font-semibold">Edit Course</h1>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full ${step >= 1 ? 'bg-[#655E95] text-white' : 'bg-gray-300 text-gray-600'} text-sm md:text-base font-semibold`}>
            1
          </div>
          <div className={`w-12 md:w-16 h-1 ${step >= 2 ? 'bg-[#655E95]' : 'bg-gray-300'}`} />
          <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full ${step >= 2 ? 'bg-[#655E95] text-white' : 'bg-gray-300 text-gray-600'} text-sm md:text-base font-semibold`}>
            2
          </div>
        </div>

        {currentCard()}

        <div className="flex justify-between w-full gap-2 md:gap-4">
          <button
            onClick={() => {
              if (step > 1) {
                setStep((prev) => prev - 1);
              }
            }}
            disabled={step === 1}
            className="flex gap-1 md:gap-3 items-center py-1.5 md:py-2 px-3 md:px-6 border hover:cursor-pointer rounded-[12px] text-xs md:text-base font-semibold text-[#655E95] border-[#655E95] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            onClick={async () => {
              if (step === 1) {
                if (validateStep1()) {
                  setStep(2);
                }
              } else if (step === 2) {
                if (validateStep2()) {
                  await handleUpdateCourse();
                }
              }
            }}
            disabled={isLoading}
            className="flex items-center gap-1 md:gap-3 py-1.5 md:py-2 px-3 md:px-6 border bg-[#655E95] font-semibold rounded-[12px] text-xs md:text-[1rem] text-white hover:bg-[#534a7d] hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 2 ? (isLoading ? 'Updating...' : 'Update Course') : 'Next'}
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
