import { useState } from 'react';
import Step1Card from './Step1Card';
import Step2Card from './Step2Card';
import Step3Card from './Step3Card';
import { uploadCourseData, type CourseData } from '@/api/course';
import toast from 'react-hot-toast';

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

export default function CourseCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [step1Data, setStep1Data] = useState<Step1Data>({
    courseName: '',
    description: '',
    thumbnail: null,
    category: '',
    courseTimeHours: '',
    courseTimeMinutes: '',
  });

  const [step2Data, setStep2Data] = useState<Step2Data>({
    courseDurationType: '',
    coursePrice: '',
    discount: '',
    coursePriceAfterDiscount: 0,
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
    if (!step1Data.thumbnail) {
      toast.error('Please upload a thumbnail');
      return false;
    }
    if (!step1Data.category) {
      toast.error('Please select a category');
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

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      await handleSubmitCourse();
    }
  };

  const handleSubmitCourse = async () => {
    if (!step1Data.thumbnail) {
      toast.error('Thumbnail is required');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Uploading course data...');

    try {
      // TODO: Get actual counsellorId from auth store
      const counsellorId = '9470988669'; // Replace with actual counsellorId

      const courseData: CourseData = {
        counsellorId,
        courseName: step1Data.courseName,
        description: step1Data.description,
        category: step1Data.category,
        courseTimeHours: parseInt(step1Data.courseTimeHours),
        courseTimeMinutes: parseInt(step1Data.courseTimeMinutes),
        courseDurationType: step2Data.courseDurationType,
        coursePrice: parseFloat(step2Data.coursePrice),
        discount: parseFloat(step2Data.discount) || 0,
        coursePriceAfterDiscount: step2Data.coursePriceAfterDiscount,
      };

      const response = await uploadCourseData(courseData, step1Data.thumbnail);

      if (response.status && response.courseId) {
        setCourseId(response.courseId);
        toast.success('Course created successfully!', { id: toastId });
        setCurrentStep(3);
      } else {
        throw new Error(response.message || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error uploading course:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload course data',
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= step
                  ? 'bg-[#13097D] text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
            </div>
            <span
              className={`font-medium ${
                currentStep >= step ? 'text-[#13097D]' : 'text-gray-600'
              }`}
            >
              Step {step}
            </span>
            {step < 3 && <div className="w-12 h-0.5 bg-gray-300" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && <Step1Card data={step1Data} onChange={setStep1Data} />}
      {currentStep === 2 && <Step2Card data={step2Data} onChange={setStep2Data} />}
      {currentStep === 3 && courseId && <Step3Card courseId={courseId} />}

      {/* Navigation Buttons */}
      {currentStep < 3 && (
        <div className="flex gap-4 justify-end">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={isLoading}
              className="px-6 py-2 border border-[#13097D] text-[#13097D] rounded-[0.75rem] font-semibold hover:bg-[#f5f5f7] transition-all duration-200 disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNextStep}
            disabled={isLoading}
            className="px-6 py-2 bg-[#13097D] text-white rounded-[0.75rem] font-semibold hover:bg-[#0f0760] transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : currentStep === 2 ? 'Create Course' : 'Next'}
          </button>
        </div>
      )}
    </div>
  );
}
