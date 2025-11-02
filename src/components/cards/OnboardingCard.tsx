import { useState, useEffect } from 'react';
import { Search, Check , ChevronLeft, Loader2 } from 'lucide-react';
import { getSates,getCoursesOnborading, updateUser } from '@/api/auth';
import toast from 'react-hot-toast';
import type { CousrseApiLogin, StatesApiResponse } from '@/types';
import { useAuthStore } from '@/store/AuthStore';


interface SelectCourseStepProps {
  selectedCourseId: string | null;
  onCourseSelect: (name: string) => void;
}



const SelectCourseStep = ({ selectedCourseId, onCourseSelect }: SelectCourseStepProps) => {
 
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState<CousrseApiLogin[]>([])

  useEffect(()=>{
    const fetchCourses = async () => {
      try{
        setLoading(true)
        const CourseData = await getCoursesOnborading()
         setCourses(CourseData)
      }catch(error){
        setError(error instanceof Error ? error.message : 'Failed to fetch Courses')
      }finally{
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  if (loading) {
    return (
      <div className="text-center p-10 flex justify-center items-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#13097D]" />
        <span className="ml-2">Loading courses...</span>
      </div>
    );
  }
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  return (
    <>
      <div>
        <div className="mb-4 md:mb-6 flex items-center justify-between">
          <h1 className="text-base md:text-2xl font-semibold md:font-bold text-[#343C6A] flex items-center gap-2">
            <ChevronLeft className="w-6 h-6" />
            <span>Select Course</span>
        </h1>
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-600">Step 1 of 2</span>
            <div className="mt-1 h-1.5 w-24 rounded-full bg-gray-200">
              <div className="h-full w-1/2 rounded-full bg-[#FA660F]"></div>
            </div>
          </div>
        </div>
        <div className="relative mb-4 md:mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FA660F]" size={20} />
          <input
            type="text"
            placeholder="Search Courses"
            className="w-full rounded-lg border border-gray-300 bg-white text-[#B2B2B2] py-2 md:py-3 pl-12 pr-4 shadow-2xs focus:border-[#FA660F] focus:outline-none"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto -mr-2 md:-mr-4 pr-2 md:pr-4">
        <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const isSelected = selectedCourseId === course.name;
            return (
              <button
                key={course.courseId}
                onClick={() => onCourseSelect(course.name)}
                className={`transform rounded-xl border md:border p-4 md:p-5 text-left md:text-center transition-all duration-200 flex flex-row items-center gap-4 md:flex-col
                  ${
                    isSelected
                      ? 'bg-[#13097D] border-transparent'
                      : 'bg-white hover:shadow-lg border-gray-200'
                  }
                `}
              >
                <img src={`/courseIcon/${course.image}`} alt={`${course.name} icon`} className="flex-shrink-0 h-12 w-12 md:h-24 md:w-24 object-contain md:mx-auto md:mb-4" />
                
                <div className="flex-1">
                  <h3 className={`text-base md:text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>{course.name}</h3>
                  <p className={`text-sm ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                    {course.duration}
                  </p>
                  <p className={`mt-1 md:mt-2 text-xs md:text-sm ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                    {course.tagline}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </>
  );
};




interface SelectStatesStepProps {
  selectedStates: string[];
  onStateSelect: (stateName: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const SelectStatesStep = ({ selectedStates, onStateSelect, onBack, onSubmit, isSubmitting }: SelectStatesStepProps) => {

  const [states, setStates]=useState<StatesApiResponse[]>([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  useEffect(()=>{
    const fetchStates = async () => {
      try{
        setLoading(true);
        const StatesData = await getSates()
         setStates(StatesData)
      }catch(error){
        setError(error instanceof Error ? error.message : 'Failed to fetch States');
      } finally {
        setLoading(false);
      }
    }
    fetchStates()
  }, [])

  const isSelected = (name: string) => selectedStates.includes(name);

  if (loading) {
    return (
      <div className="text-center p-10 flex justify-center items-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#13097D]" />
        <span className="ml-2">Loading states...</span>
      </div>
    );
  }
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;


  return (
    <>
      <div>
        <div className="mb-4 md:mb-6 flex items-center justify-between">
          <button onClick={onBack} className="text-base md:text-2xl font-semibold md:font-bold text-[#343C6A] hover:text-[#FA660F] flex items-center gap-2">
            <ChevronLeft className="w-6 h-6" />
            <span>Select States</span>
            </button>
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-600">Step 2 of 2</span>
            <div className="mt-1 h-1.5 w-24 rounded-full bg-gray-200">
              <div className="h-full w-full rounded-full bg-[#FA660F]"></div>
            </div>
          </div>
        </div>
        <div className="relative mb-4 md:mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FA660F]" size={20} />
          <input
            type="text"
            placeholder="Search States"
            className="w-full rounded-lg border border-gray-300 bg-white text-[#B2B2B2] py-2 md:py-3 pl-12 pr-4 shadow-2xs focus:border-[#FA660F] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto -mr-2 md:-mr-4 pr-2 md:pr-4">
        <div className="grid grid-cols-1 gap-3 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {states.map((state) => (
            <button
              key={state.name}
              onClick={() => onStateSelect(state.name)}
              className={`relative flex flex-row items-center justify-between md:flex-col md:justify-center rounded-xl border p-4 md:p-6 transition-colors duration-200
                ${
                  isSelected(state.name) ? 'border-transparent bg-[#13097D] text-white' : 'bg-white hover:shadow-lg border-gray-200'
                }`}
            >
              <div className="flex flex-1 items-center gap-4">
                <img src={`/stateIcons/${state.image}`} alt={`${state.name} icon`} className="h-10 w-10 md:h-12 md:w-12 object-contain md:mx-auto md:mb-3" />
                <h3 className="font-semibold text-sm md:text-base">{state.name}</h3>
              </div>

              <div
                className={`flex-shrink-0 md:absolute md:right-3 md:top-3 flex h-5 w-5 items-center justify-center rounded border-2 ${
                  isSelected(state.name) ? 'border-white bg-white text-[#13097D]' : 'border-gray-300'
                }`}
              >
                {isSelected(state.name) && <Check  size={14} strokeWidth={3} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-200">
        <div className="flex justify-center md:justify-end">
          <button
            onClick={onSubmit}
            disabled={selectedStates.length === 0 || isSubmitting}
            className="w-full md:w-auto rounded-lg bg-[#FA660F] md:px-12 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:bg-orange-300 md:min-w-[160px]"
          >
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Submit'}
          </button>
        </div>
      </div>
    </>
  );
};

const OnboardingCard = () => {
  const [step, setStep] = useState(1);
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const {toggleLogin, userId} = useAuthStore()
  const token = localStorage.getItem('jwt')
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);


  const handleCourseSelect = (name: string) => {
    setSelectedCourseName(name);
    setTimeout(() => setStep(2), 300); 
  };

  const handleStateSelect = (stateName: string) => {
    setSelectedStates(prev => 
      prev.includes(stateName) ? prev.filter(s => s !== stateName) : [...prev, stateName]
    );
  };
  
  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  const payload = {
    userInterestedStateOfCounsellors: selectedStates,
    interestedCourse:selectedCourseName
  }

  const handleSubmit = async() => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try{
      console.log('Submitting preferences...', payload);
      await updateUser(userId, payload, token)
      toast.success('Preferences saved successfully!');
      
      setTimeout(() => {
        toggleLogin()
      }, 2000);
      
    }catch(err){
      console.error('Update user error:', err);
      const error = err instanceof Error ? err.message : 'Failed to update preferences'
      toast.error(error)
    } finally {
      setIsSubmitting(false);
    }
   
  };

  return (
    <>
    <div className="fixed inset-0 bg-black/40 md:backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl rounded-2xl bg-[#F5F7FA] p-4 md:p-8 shadow-lg flex flex-col max-h-[90vh] h-auto md:h-full">
        {step === 1 && (
          <SelectCourseStep
            selectedCourseId={selectedCourseName}
            onCourseSelect={handleCourseSelect}
          />
        )}
        {step === 2 && (
          <SelectStatesStep
            selectedStates={selectedStates}
            onStateSelect={handleStateSelect}
            onBack={handleGoBack}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
    </>
  );
};

export default OnboardingCard;