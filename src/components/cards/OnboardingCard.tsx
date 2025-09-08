
import { useState, useEffect } from 'react';
import { Search, Check , ChevronLeft } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import toast, { Toaster } from 'react-hot-toast';

interface SelectCourseStepProps {
  selectedCourseId: string | null;
  onCourseSelect: (courseId: string) => void;
}

const SelectCourseStep = ({ selectedCourseId, onCourseSelect }: SelectCourseStepProps) => {
  const { courses, loading, error } = useCourses();

  const getCardStyle = (id: string) => {
    return selectedCourseId === id
      ? 'bg-[#13097D] text-white'
      : 'bg-white hover:shadow-lg';
  };
  
  const getTextStyle = (id: string, type: 'primary' | 'secondary') => {
    if (selectedCourseId === id) return 'text-white';
    return type === 'primary' ? 'text-gray-800' : 'text-gray-500';
  }

  if (loading) return <div className="text-center p-10">Loading courses...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

  return (
    <>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#343C6A] flex items-center gap-2">
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
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FA660F]" size={20} />
          <input
            type="text"
            placeholder="Search Courses"
            className="w-full rounded-lg border border-gray-300 bg-white text-[#B2B2B2] py-3 pl-12 pr-4 shadow-2xs focus:border-[#FA660F] focus:outline-none"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto -mr-4 pr-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => onCourseSelect(course.id)}
              className={`transform rounded-xl border p-5 text-center transition-all duration-200 ${getCardStyle(course.id)}`}
            >
              <img src={course.iconUrl} alt={`${course.name} icon`} className="mb-4 h-24 w-24 object-contain mx-auto" />
              <h3 className={`text-lg font-bold ${getTextStyle(course.id, 'primary')}`}>{course.name}</h3>
              <p className={`text-sm ${getTextStyle(course.id, 'secondary')}`}>
                {course.duration} &bull; {course.type}
              </p>
              <p className={`mt-2 text-sm ${getTextStyle(course.id, 'secondary')}`}>
                Build innovative solutions and shape your future
              </p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

const statesData = [
  { name: 'Delhi', icon: '/delhi.png' },
  { name: 'Maharashtra', icon: '/maharashtra.png' },
  { name: 'Arunachal Pradesh', icon: '/arunachal.png' },
  { name: 'Telangana', icon: '/delhi.png' },
  { name: 'Karnataka', icon: '/maharashtra.png' },
  { name: 'Tamil Nadu', icon: '/arunachal.png' },
  { name: 'Andhra Pradesh', icon: '/delhi.png' },
  { name: 'Uttar Pradesh', icon: '/maharashtra.png' },
  { name: 'West Bengal', icon: '/arunachal.png' },
];

interface SelectStatesStepProps {
  selectedStates: string[];
  onStateSelect: (stateName: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const SelectStatesStep = ({ selectedStates, onStateSelect, onBack, onSubmit }: SelectStatesStepProps) => {
  const isSelected = (name: string) => selectedStates.includes(name);

  return (
    <>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <button onClick={onBack} className="text-2xl font-bold text-[#343C6A] hover:text-[#FA660F] flex items-center gap-2">
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
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FA660F]" size={20} />
          <input
            type="text"
            placeholder="Search States"
            className="w-full rounded-lg border border-gray-300 bg-white text-[#B2B2B2] py-3 pl-12 pr-4 shadow-2xs focus:border-[#FA660F] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto -mr-4 pr-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statesData.map((state) => (
            <button
              key={state.name}
              onClick={() => onStateSelect(state.name)}
              className={`relative flex flex-col items-center justify-center rounded-xl border p-6 transition-colors duration-200 ${
                isSelected(state.name) ? 'border-transparent bg-[#13097D] text-white' : 'bg-white hover:shadow-lg'
              }`}
            >
              <img src={state.icon} alt={`${state.name} icon`} className="mb-3 h-12 w-12 object-contain mx-auto" />
              <h3 className="font-semibold">{state.name}</h3>
              <div
                className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded border-2 ${
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
        <div className="flex justify-end">
          <button
            onClick={onSubmit}
            disabled={selectedStates.length === 0}
            className="rounded-lg bg-[#FA660F] px-12 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

const OnboardingCard = () => {
  const [step, setStep] = useState(1);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);


  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
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

  const handleSubmit = () => {
    console.log('Submitting Data:', { courseId: selectedCourseId, states: selectedStates });
    toast.success('Preferences saved successfully!');
  };

  return (
    <>
    <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl rounded-2xl bg-[#F5F7FA] p-6 md:p-8 shadow-lg flex flex-col max-h-[90vh] h-full">
        {step === 1 && (
          <SelectCourseStep
            selectedCourseId={selectedCourseId}
            onCourseSelect={handleCourseSelect}
          />
        )}
        {step === 2 && (
          <SelectStatesStep
            selectedStates={selectedStates}
            onStateSelect={handleStateSelect}
            onBack={handleGoBack}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
    </>
  );
};

export default OnboardingCard;